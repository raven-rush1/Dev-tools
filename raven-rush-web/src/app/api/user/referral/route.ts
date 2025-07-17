import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const referralDataPath = path.join(process.cwd(), "src", "app", "data", "referral-data.json");

export async function GET() {
  try {
    if (!fs.existsSync(referralDataPath)) {
      fs.writeFileSync(referralDataPath, JSON.stringify({}), "utf8");
    }

    const rawData = fs.readFileSync(referralDataPath, "utf8");
    const data = rawData.trim() === "" ? {} : JSON.parse(rawData);

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/user/referral error:", error);
    return NextResponse.json({ error: "Failed to fetch referral data." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userAddress, referralCode } = body;

    if (!userAddress || !referralCode) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const rawData = fs.existsSync(referralDataPath)
      ? fs.readFileSync(referralDataPath, "utf8")
      : "{}";

    const data = rawData.trim() === "" ? {} : JSON.parse(rawData);

    data[userAddress] = { referralCode, timestamp: Date.now() };

    fs.writeFileSync(referralDataPath, JSON.stringify(data, null, 2), "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/user/referral error:", error);
    return NextResponse.json({ error: "Failed to save referral data." }, { status: 500 });
  }
}
