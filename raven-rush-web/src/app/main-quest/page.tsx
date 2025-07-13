"use client";

import { motion } from "framer-motion";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function QuestPage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url("https://i.postimg.cc/Y2s64bFp/Raven-1.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0a001a",
      }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center bg-black/70">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold text-purple-400 mb-6"
        >
          ⚔️ Main Quest Unlocks Soon!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-300 max-w-xl mb-8"
        >
          We're almost ready to launch the Raven Rush main quest. Gear up, rally your guild, and prepare for a PvP racing showdown like no other.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition cursor-pointer"
        >
          🕹️ Stay Tuned, Racer!
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
