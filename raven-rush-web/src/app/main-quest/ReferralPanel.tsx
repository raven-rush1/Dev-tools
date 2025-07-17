"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

type ReferralRecord = {
  referralCode: string;
  referredBy: string | null;
  timestamp: number;
};

type UserRefInfo = {
  refCode: string;
  referrer: string;
  invites: number;
};

type RefData = {
  address: string;
  invites: number;
  rank: number;
};

export default function ReferralPanel() {
  const { address } = useAccount();
  const [userRef, setUserRef] = useState<UserRefInfo | null>(null);
  const [leaderboard, setLeaderboard] = useState<RefData[]>([]);
  const [inputCode, setInputCode] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // 🧠 Copy Code
  const copyCode = () => {
    if (userRef?.refCode) {
      navigator.clipboard.writeText(userRef.refCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 📡 Submit Referral
  const submitReferral = async () => {
    if (!address || submitted) return;
    setSubmitted(true);

    const res = await fetch("/api/user/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress: address,
        referralCode: inputCode || "Raven-rush",
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setUserRef(data);
    }
  };

  // 📊 Fetch Leaderboard & User
  useEffect(() => {
    if (!address) return;

    fetch("/api/user/referral?address=" + address)
      .then((res) => res.json())
      .then((typedData) => {
        setUserRef(typedData[address]);

        // ✅ FIX FILTER TYPE ISSUE HERE
        const leaderboardArr = Object.entries(
          typedData as Record<string, ReferralRecord>
        )
          .map(([addr, info]) => ({
            address: addr,
            invites: Object.values(
              typedData as Record<string, ReferralRecord>
            ).filter((entry) => entry.referredBy === info.referralCode).length,
          }))
          .sort((a, b) => b.invites - a.invites)
          .map((user, i) => ({ ...user, rank: i + 1 }));

        setLeaderboard(leaderboardArr);
      });
  }, [address]);

  return (
    <div>
      <h1 className="text-xl font-bold">Referral System</h1>

      {!userRef && (
        <div>
          <input
            type="text"
            placeholder="Enter referral code (optional)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="border p-2 mt-2"
          />
          <button onClick={submitReferral} className="bg-blue-500 p-2 text-white">
            Submit Referral
          </button>
        </div>
      )}

      {userRef && (
        <div className="mt-4">
          <p>Your Code: {userRef.refCode}</p>
          <p>Invites: {userRef.invites}</p>
          <button onClick={copyCode} className="bg-green-500 p-2 text-white">
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>
      )}

      <h2 className="mt-6 font-bold">Leaderboard</h2>
      <ul>
        {leaderboard.map((user) => (
          <li key={user.address}>
            #{user.rank} - {user.address.slice(0, 6)}... — {user.invites} invites
          </li>
        ))}
      </ul>
    </div>
  );
}

