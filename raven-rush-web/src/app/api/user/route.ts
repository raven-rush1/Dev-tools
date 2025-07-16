import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DATA_PATH = path.resolve(process.cwd(), "user-data.json");

type User = {
  address: string;
  points: number;
  boosts: number;
  lastCheckIn: number | null;
  lastBoost: number | null;
};

// Read users
function readUserData(): User[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  const data = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(data);
}

// Write users
function writeUserData(data: User[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET leaderboard
export async function GET() {
  const users = readUserData();

  // Clone before sort to avoid mutating file data
  const sorted = [...users].sort((a, b) => b.points - a.points);

  const filtered = sorted.filter((u) => u.points > 0);

const leaderboard = filtered.map((u, i) => ({
  address: u.address,
  points: u.points,
  boosts: u.boosts || 0,
  lastCheckIn: u.lastCheckIn || null,
  rank: i + 1,
}));


  return NextResponse.json(leaderboard);
}

// POST: checkin / boost / ensure
export async function POST(req: Request) {
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

  let users = readUserData();
  let userIndex = users.findIndex((u) => u.address.toLowerCase() === normalized);
  let user = userIndex !== -1 ? users[userIndex] : null;

  const now = Date.now();

  if (!user) {
    // Create new user if missing
    user = {
      address: normalized,
      points: 0,
      boosts: 0,
      lastCheckIn: null,
      lastBoost: null,
    };
    users.push(user);
    userIndex = users.length - 1;
  }

  if (action === "checkin") {
    const cooldown = 6 * 60 * 60 * 1000; // 6 hours
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
    user.lastBoost = now;
    user.boosts += 1;
  }

  // Update and save
  users[userIndex] = user;
  writeUserData(users);

  // Also return the fresh sorted leaderboard so frontend can update everything at once
  const sorted = [...users].sort((a, b) => b.points - a.points);
const filtered = sorted.filter((u) => u.points > 0);

const leaderboard = filtered.map((u, i) => ({
  address: u.address,
  points: u.points,
  boosts: u.boosts || 0,
  lastCheckIn: u.lastCheckIn || null,
  rank: i + 1,
}));

  return NextResponse.json({ success: true, user, leaderboard });
}
