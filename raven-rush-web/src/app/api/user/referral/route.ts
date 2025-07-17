// /api/user/referral/route.ts

import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

// --- Types ---
type User = {
  address: string;          // always lowercase
  points: number;
  boosts: number;
  lastCheckIn: number | null;
  lastBoost: number | null;
};

// --- File Location ---
// Change this if you prefer root-level. Must match your repo.
const DATA_PATH = path.join(
  process.cwd(),
  "src",
  "app",
  "data",
  "user-data.json"
);

// --- Helpers ---
function ensureDataFile() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "[]", "utf8");
  }
}

function readUserData(): User[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_PATH, "utf8").trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // normalize
    return parsed.map((u: any) => ({
      address: String(u.address || "").toLowerCase(),
      points: Number.isFinite(u.points) ? Number(u.points) : 0,
      boosts: Number.isFinite(u.boosts) ? Number(u.boosts) : 0,
      lastCheckIn: typeof u.lastCheckIn === "number" ? u.lastCheckIn : null,
      lastBoost: typeof u.lastBoost === "number" ? u.lastBoost : null,
    }));
  } catch (err) {
    console.error("readUserData error:", err);
    return [];
  }
}

function writeUserData(data: User[]) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("writeUserData error:", err);
  }
}

function buildLeaderboard(users: User[]) {
  const sorted = [...users].sort((a, b) => b.points - a.points);
  return sorted.map((u, i) => ({
    address: u.address,
    points: u.points,
    boosts: u.boosts,
    lastCheckIn: u.lastCheckIn,
    rank: i + 1,
  }));
}

// --- GET ---
// /api/user            -> leaderboard array
// /api/user?address=0x -> { leaderboard, current }
export async function GET(req: Request) {
  const users = readUserData();
  const leaderboard = buildLeaderboard(users);

  const { searchParams } = new URL(req.url);
  const addr = searchParams.get("address")?.toLowerCase() || null;

  if (addr) {
    const current = users.find((u) => u.address === addr) || null;
    return NextResponse.json({ leaderboard, current });
  }

  return NextResponse.json(leaderboard);
}

// --- POST ---
// body: { address, action: "checkin" | "boost" | "ensure" }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, action } = body;

    if (
      !address ||
      typeof address !== "string" ||
      !["checkin", "boost", "ensure"].includes(action)
    ) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const normalized = address.toLowerCase();
    const users = readUserData();

    let user = users.find((u) => u.address === normalized);
    if (!user) {
      user = {
        address: normalized,
        points: 0,
        boosts: 0,
        lastCheckIn: null,
        lastBoost: null,
      };
      users.push(user);
    }

    const now = Date.now();

    if (action === "checkin") {
      const cooldown = 6 * 60 * 60 * 1000; // 6h
      if (user.lastCheckIn && now - user.lastCheckIn < cooldown) {
        return NextResponse.json(
          { error: "Check-in cooldown active" },
          { status: 429 }
        );
      }
      user.points += 10;
      user.lastCheckIn = now;
    }

    if (action === "boost") {
      user.points += 200;
      user.boosts += 1;
      user.lastBoost = now;
    }

    // ensure = make sure user exists; no change

    writeUserData(users);

    const leaderboard = buildLeaderboard(users);
    const current = leaderboard.find((u) => u.address === normalized) || null;

    return NextResponse.json({ success: true, user: current, leaderboard });
  } catch (err) {
    console.error("POST /api/user error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
