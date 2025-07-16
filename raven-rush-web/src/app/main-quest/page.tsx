"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ReferralPanel from "./ReferralPanel";


const CONTRACT_ADDRESS = "0xA597a1Dc00E722627bA796dCFF1130d33A35a1Eb";
const CONTRACT_ABI = [
  "function checkIn() external payable",
  "function boost() external payable"
];

type LeaderboardUser = {
  address: string;
  points: number;
  rank: number;
  boosts?: number;
  lastCheckIn?: number;
};

export default function QuestPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState<number | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [boostCount, setBoostCount] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState<number | null>(null);
  const [recentTxs, setRecentTxs] = useState<string[]>([]);
  const [cooldown, setCooldown] = useState<number | null>(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const networkName =
    chainId === 42161
      ? "Arbitrum One"
      : chainId === 1
      ? "Ethereum Mainnet"
      : chainId
      ? `Chain ID: ${chainId}`
      : "Unknown";

  const getCooldownTime = (lastTime: number) => {
    const remaining = 6 * 60 * 60 * 1000 - (Date.now() - lastTime);
    return remaining > 0 ? remaining : null;
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    if (lastCheckIn) {
      const interval = setInterval(() => {
        const remaining = getCooldownTime(lastCheckIn);
        setCooldown(remaining);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCooldown(null);
    }
  }, [lastCheckIn]);

  async function handleTransaction(type: "checkin" | "boost") {
  try {
    if (!window.ethereum) throw new Error("Wallet not detected");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const value = type === "checkin" ? ethers.parseEther("0.00003") : ethers.parseEther("0.002");

    setLoading(true);
    setMessage(type === "checkin" ? "Checking in..." : "Boosting...");
    const tx = await contract[type === "checkin" ? "checkIn" : "boost"]({ value });
    await tx.wait();

    setRecentTxs((prev) => [tx.hash, ...prev.slice(0, 4)]);

    // Tell backend and get fresh leaderboard back
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, action: type })
    });
    const data = await res.json();

    if (data && data.leaderboard) {
      setLeaderboard(data.leaderboard);
      const current = data.leaderboard.find((u:LeaderboardUser) => u.address === address?.toLowerCase());
      if (current) {
        setPoints(current.points);
        setRank(current.rank);
        setBoostCount(current.boosts || 0);
        if (current.lastCheckIn) setLastCheckIn(current.lastCheckIn);
      }
    }

    setMessage(type === "checkin" ? "✅ Check-in successful!" : "⚡ Boost successful!");
  } catch (err) {
    console.error(err);
    setMessage("❌ Transaction failed.");
  } finally {
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);

  }
}
  async function fetchLeaderboard() {
    const res = await fetch("/api/user");
    const data = await res.json();
    setLeaderboard(data);
    const current = data.find(
  (u: LeaderboardUser) => u.address.toLowerCase() === address?.toLowerCase()
);
    if (current) {
      setPoints(current.points);
      setRank(current.rank);
      setBoostCount(current.boosts || 0);
      if (current.lastCheckIn) setLastCheckIn(current.lastCheckIn);
    }
  }

  useEffect(() => {
  if (isConnected && address) {
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, action: 'ensure' }),
    }).then(() => fetchLeaderboard());
  }
}, [isConnected, address]);

  return (
    <div
      className="flex flex-col min-h-screen text-white bg-cover bg-center"
      style={{ backgroundImage: 'url("https://i.postimg.cc/Y2s64bFp/Raven-1.png")' }}
    >
      <Navbar />

      <main className="flex-1 px-6 pt-20 flex flex-col items-center">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-purple-500 mb-2 drop-shadow-lg"
        >
          Raven Rush Quest
        </motion.h1>

        {/* Empty space for your small content */}
        <div className="max-w-2xl text-center text-sm text-purple-200 mb-6">
          {/* <-- put your small text/banner here --> */} Complete daily check-ins, boost your points with boosters, earn rewards, and climb the leaderboard.
        </div>

        {isConnected ? (
          <>
            <div className="text-sm text-white/90 mb-6 flex flex-wrap items-center gap-3 justify-center md:justify-start font-medium">
              <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
                <strong className="text-purple-300">Connected:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <span className="bg-black/50 px-3 py-1 rounded border border-purple-600">
                <strong className="text-purple-300">Network:</strong> {networkName}
              </span>
              <button
                onClick={() => setShowProfile(true)}
                className="text-sm font-semibold px-3 py-1 rounded bg-purple-700 hover:bg-purple-800"
              >
                👤 Profile
              </button>
              <button
                onClick={() => disconnect()}
                className="text-sm font-semibold text-red-400 underline hover:text-red-300"
              >
                Disconnect
              </button>
            </div>

            <section className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-10 gap-6 px-4">
              {/* Total points & rank */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center bg-black/60 border border-purple-800 px-6 py-4 rounded-lg shadow-md"
              >
                <p className="text-sm text-purple-300">⭐ Total Points</p>
                <p className="text-2xl font-bold">{points}</p>
                {rank !== null && <p className="text-sm font-semibold text-yellow-300 mt-1">🎖️ Rank: #{rank}</p>}
              </motion.div>

              {/* Check-in button & bold timer */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleTransaction("checkin")}
                  disabled={loading || !!cooldown}
                  className={`w-40 py-3 rounded-md font-semibold transition ${
                    cooldown ? "bg-blue-600 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  🧭 Check-in
                </button>
                {cooldown && (
                  <div className="mt-2 text-center">
                    <p className="text-xl font-bold text-yellow-300 animate-pulse">
                      ⏱ Next check-in: {formatTime(cooldown)}
                    </p>
                    <p className="text-xs text-purple-200">Come back after 6 hours for next check-in</p>
                  </div>
                )}
              </div>

              {/* Boost */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleTransaction("boost")}
                  disabled={loading}
                  className="w-40 py-3 rounded-md font-semibold bg-yellow-500 hover:bg-yellow-600 text-black transition shadow"
                >
                  ⚡ Boost ({boostCount})
                </button>
              </div>
            </section>

            {message && <div className="text-center text-green-400 text-sm mb-3 animate-fadeIn">{message}</div>}

            {/* Leaderboard */}
            <aside className="w-full max-w-5xl bg-black/60 rounded-lg p-6 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-purple-300">🏆 Leaderboard</h3>
                <button onClick={toggleSidebar} className="text-sm text-gray-400 hover:text-white">
                  {showSidebar ? "Hide Panel" : "Show Panel"}
                </button>
              </div>
              <AnimatePresence>
                {showSidebar && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-3 text-sm text-purple-200 font-bold border-b border-purple-800 pb-2 mb-2">
                      <span>rank</span>
                      <span>user</span>
                      <span>Points</span>
                    </div>
                    <ul className="space-y-1 text-sm text-white">
                      {leaderboard.map((user, i) => (
                        <li key={i} className="grid grid-cols-3 border-b border-purple-900 py-1">
                          <span>#{user.rank}</span>
                          <span>{user.address.slice(0, 6)}...{user.address.slice(-4)}</span>
                          <span>{user.points}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </aside>

            {/* Profile panel */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#0a001a] border-l border-purple-800 p-6 z-50 shadow-lg overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-purple-400">User Profile</h2>
                    <button onClick={() => setShowProfile(false)} className="text-red-400 hover:underline">Close</button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-gray-400">Address:</span>
                      <div className="cursor-pointer hover:underline" onClick={() => navigator.clipboard.writeText(address || "")}>{address}</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Points:</span>
                      <p className="font-semibold">{points}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Rank:</span>
                      <p className="font-semibold text-yellow-400">#{rank}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Boosts Used:</span>
                      <p className="font-semibold text-purple-300">{boostCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Recent Transactions:</span>
                      <ul className="list-disc list-inside text-xs text-blue-300 space-y-1">
                        {recentTxs.length > 0 ? (
                          recentTxs.map((tx, i) => (
                            <li key={i}>
                              <a href={`https://arbiscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                {tx.slice(0, 10)}...
                              </a>
                            </li>
                          ))
                        ) : (
                          <li>No recent transactions</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
             </AnimatePresence>
          </>
        ) : (
          <div className="mt-6">
            <ConnectButton />
          </div>
        )}

        {/* ✅ Referral Panel: shown only inside Main Quest page */}
        <ReferralPanel />
      </main>

      <Footer />
    </div>
  );
}
