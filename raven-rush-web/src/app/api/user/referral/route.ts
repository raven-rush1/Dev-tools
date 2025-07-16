import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const DATA_PATH = path.resolve(process.cwd(), "referral-data.json");

type ReferralUser = {
  address: string;
  refCode: string;
  referrer: string;
  invites: number;
};

function readData(): ReferralUser[] {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
}

function writeData(data: ReferralUser[]) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

export async function POST(req: Request) {
  const { address, refCodeUsed } = await req.json();

  if (!address || typeof address !== "string") {
    return NextResponse.json({ error: "Invalid address" }, { status: 400 });
  }

  const normalized = address.toLowerCase();
  const data = readData();

  const existingUser = data.find((u) => u.address === normalized);
  if (existingUser) {
    return NextResponse.json({ success: true, user: existingUser });
  }

  if (!refCodeUsed) {
    return NextResponse.json(
      { error: "Referral code required" },
      { status: 400 }
    );
  }

  const referrer = data.find((u) => u.refCode === refCodeUsed);
  if (referrer) {
    referrer.invites += 1;
  }

  const newUser: ReferralUser = {
    address: normalized,
    refCode: normalized.slice(2, 8),
    referrer: refCodeUsed,
    invites: 0,
  };

  data.push(newUser);
  writeData(data);

  return NextResponse.json({ success: true, user: newUser });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const data = readData();

  // Return specific user info
  if (address) {
    const user = data.find(
      (u) => u.address.toLowerCase() === address.toLowerCase()
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  // Return leaderboard (top 50 users with at least 1 invite)
  const leaderboard = data
    .filter((u) => u.invites > 0)
    .sort((a, b) => b.invites - a.invites)
    .slice(0, 50)
    .map((u, i) => ({
      address: u.address,
      invites: u.invites,
      rank: i + 1,
    }));

  return NextResponse.json(leaderboard);
}
