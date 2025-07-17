"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
// ❌ removed: import { motion } from "framer-motion";
// Types
type RefData = {
  address: string;
  invites: number;
  rank: number;
};

type UserRefInfo = {
  refCode: string;
  referrer: string;
  invites: number;
};

export default function ReferralPanel() {
  const { address, isConnected } = useAccount();
  const [inputCode, setInputCode] = useState("");
  const [userRef, setUserRef] = useState<UserRefInfo | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<RefData[]>([]);
  const [copied, setCopied] = useState(false);
const copyCode = () => {
  if (userRef?.refCode) {
    navigator.clipboard.writeText(userRef.refCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
};

  const [error, setError] = useState<string | null>(null);

 useEffect(() => {
  if (!address) return;

  // Get leaderboard
  fetch("/api/user/referral")
    .then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", text);
        throw new Error("Failed to fetch referral leaderboard");
      }
      return res.json();
    })
    .then((data) => {
      const leaderboardArr = Object.entries(data)
        .map(([address, info]) => ({
          address,
          invites: Object.values(data).filter(
            (entry) => entry.referredBy === info.referralCode
          ).length,
        }))
        .sort((a, b) => b.invites - a.invites)
        .map((user, index) => ({ ...user, rank: index + 1 }));

      setLeaderboard(leaderboardArr);
    })
    .catch((err) => {
      console.error("Referral API error:", err);
      setError("Unable to load referral leaderboard");
    });

  // Fetch user referral info remains unchanged
  fetch(`/api/user/referral?address=${address}`)
    .then((res) => res.json())
    .then((data) => {
      if (data?.refCode) {
        setUserRef(data);
        setSubmitted(true);
      }
    })
    .catch((err) => {
      console.error("User referral fetch failed:", err);
    });
}, [address]);


 // Handle submission
 const submitReferral = async () => {
  if (!inputCode || !address) return;

  console.log("Submitting referral for:", address, "with code:", inputCode);

  try {
    const res = await fetch("/api/user/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress: address,
        referralCode: inputCode || "Raven-rush",
      }),
    });

    console.log("Raw response:", res);

    let data;
    try {
      data = await res.json();
      console.log("Parsed response:", data);
    } catch (err) {
      console.error("JSON parse error:", err);
      setError("Failed to parse server response.");
      return;
    }

    if (res.ok && data?.user) {
      console.log("Referral successful:", data.user);
      setUserRef(data.user);
      setSubmitted(true);
      setError(null);
    } else if (data?.error) {
      console.warn("Referral error:", data.error);
      setError(data.error);
    } else {
      console.warn("Unexpected error:", data);
      setError("Invalid referral code or already used.");
    }
  } catch (err) {
    console.error("Submit error:", err);
    setError("Referral code submission failed.");
  }
};



  if (!isConnected || !address) {
    return (
      <div className="mt-16 text-center text-purple-300 text-sm">
        🔒 Connect your wallet to Access All Quests.
      </div>
    );
  }

  return (
    <section className="w-full max-w-4xl bg-black/60 border border-purple-700 p-6 rounded-lg mt-16 shadow-xl">
      <h2 className="text-2xl font-bold text-purple-300 mb-4">
        👥 Referral Dashboard {userRef && <span className="text-sm text-purple-400 ml-2">My Invites: {userRef.invites}</span>}
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-2">⚠ {error}</p>
      )}

      {!submitted ? (
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter a referral code (default: Raven-rush)"
            className="flex-1 px-4 py-2 rounded bg-[#120422] border border-purple-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={submitReferral}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded text-white font-semibold"
          >
            Submit Code
          </button>
        </div>
      ) : (
        <div className="mb-6 space-y-2 text-sm">
          <p className="text-purple-300">
            ✅ Referral code submitted! You used: {" "}
            <span className="font-bold text-white">{userRef?.referrer}</span>
          </p>
          <div className="flex items-center gap-2">
  <input
    type="text"
    value={userRef?.refCode || ""}
    readOnly
    className="flex-1 px-4 py-2 rounded bg-[#120422] border border-purple-800 text-white"
  />
  <button
    onClick={copyCode}
    className="px-3 py-1 text-sm bg-yellow-400 hover:bg-yellow-500 text-black rounded"
  >
    {copied ? "Copied!" : "Copy"}
  </button>
</div>
          <p className="text-gray-400 text-xs">
            Share your referral code. You will earn 1 invite point per user.
          </p>
        </div>
      )}

      {/* Leaderboard */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-purple-200 mb-2">
          🏆 Referral Leaderboard
        </h3>
        <div className="grid grid-cols-3 font-bold text-purple-400 text-sm border-b border-purple-800 pb-1 mb-2">
          <span>Rank</span>
          <span>User</span>
          <span>Invites</span>
        </div>
        <ul className="space-y-1 text-sm text-white">
          {leaderboard.map((u, i) => (
            <li
              key={i}
              className="grid grid-cols-3 py-1 border-b border-purple-900"
            >
              <span>#{u.rank}</span>
              <span>{u.address.slice(0, 6)}...{u.address.slice(-4)}</span>
              <span>{u.invites}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
