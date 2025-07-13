"use client";

import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const sections = [
  {
    title: "About Raven Rush",
    description:
      "Raven rush is high octane, skill driven racing game where real time pvp battels push players to the limit. blaze through futuristic tracks, outmaneuer rivals, and race for glory, every race is a chance to earn rewards, prove your dominance, and level up your legacy. Think speed. Think strategy. Think Raven Rush.",
    image: "https://i.postimg.cc/Y2s64bFp/Raven-1.png",
  },
  {
    title: "Why Play Raven Rush?",
    description:
      "No randomness, just pure skill, race in free play mode to sharpen your skills, stake tokens in PvP mode to earn based on performance, or climb leaderboards in weekly tournaments to win big. Because every victory, every bit of progress, is owned by YOU.",
    image: "https://i.postimg.cc/JnZ73jCG/Race-to-Glory.png",
  },
  {
    title: "Beta Pass NFT",
    description:
      "Mint your Beta Pass NFT, the only way to acces Raven rush testnet and play the game early while unlocking special ingame rewards, and exclusive benefits for early supporters.",
    image: "https://i.postimg.cc/tJFyK6X8/Raven-Rush-Beta-Pass-Resized.png",
  },
  {
    title: "Leaderboard & Genesis Rewards",
    description:
      "Climb the leaderboard through our social quests and campaigns to earn exclusive Genesis Rewards, Available to the 30k Beta Pass holders. Early testers with a Beta Pass nft get special access to these rewards, including future airdrops and perks. complete quest, secure your spot, and unlock exclusive benefits before the official launch.",
    image: "https://i.postimg.cc/VNTpfhTC/Genesis-Reward.png",
  },
  {
    title: "Join our Community",
    description:
      "Raven Rush isn’t just a game, it’s a community of racers, creators, and Web3 fans. 🏁\n\nJoin us on Discord to share race clips, win giveaways, and vote on game features. Weekly events, contests, and exclusive drops keep the hype alive. \n\nWhether you're here to compete, create, or just vibe, there's a place for you in the rush. 🚀",
    image: "https://i.postimg.cc/1zq0hYZX/65601744-ff2a-4cd5-868e-4d0d1e88c482.png",
  },
];

export default function HomePage() {
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

      <main className="flex-1 text-white px-4 py-12 bg-black/70 flex flex-col items-center">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center text-center mb-12"
        >
          <img
            src="https://i.postimg.cc/05YvjHFS/Raven-Rush-logo-2-0.png"
            alt="Raven Rush Logo"
            className="w-28 h-28 md:w-36 md:h-36 mb-6 rounded-full border-4 border-purple-700 shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-extrabold text-purple-400 leading-tight tracking-tight mb-4">
            Race. Stake. Conquer.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
            Raven Rush is a decentralised PvP racing game, where you race, compete, and trade in-game assests.
            Dominate the track, explore our on-chain marketplace, where every assest you earn is truly yours.
            
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="https://tally.so/r/nGVddZ"
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition"
            >
              🎟️ Join the Waitlist
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="https://raven-rush-beta-pass.nfts2.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition"
            >
              🚀 Mint Beta Pass
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="https://raven-rush.gitbook.io/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition"
            >
              📖 Read our Docs
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="https://guild.xyz/raven-rush"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-700 hover:bg-purple-800 px-6 py-3 rounded-lg font-semibold text-white shadow-lg transition"
            >
              🛡️ Join Guild
            </motion.a>
          </div>
        </motion.div>

        {/* Dynamic Content Sections */}
        {sections.map((section, idx) => (
          <motion.section
            key={section.title}
            className={`flex flex-col md:flex-row items-center gap-6 bg-black/80 rounded-xl p-8 max-w-5xl w-full mb-12 shadow-xl border border-purple-700 ${
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src={section.image}
              alt={section.title}
              className="w-full md:w-1/2 h-auto rounded-lg shadow-lg object-cover"
            />
            <div className="text-left md:w-1/2">
              <h3 className="text-purple-300 text-2xl font-bold mb-4">
                {section.title}
              </h3>
              <p className="text-gray-200 text-lg leading-relaxed">
                {section.description}
              </p>
            </div>
          </motion.section>
        ))}

        {/* Custom Roadmap Section - At Bottom */}
        <motion.section
          className="flex flex-col md:flex-row items-center gap-6 bg-black/80 rounded-xl p-8 max-w-5xl w-full mb-12 shadow-xl border border-purple-700"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src="https://i.postimg.cc/R0D7j5Yj/Road-map-0.png"
            alt="Road map"
            className="w-full md:w-1/2 h-auto rounded-lg shadow-lg object-cover"
          />
          <div className="md:w-1/2">
            <h3 className="text-purple-300 text-2xl font-bold mb-4">Road map</h3>
            <div className="space-y-6 text-gray-200 text-lg leading-relaxed">
              <div>
                <span className="font-bold text-purple-400">🚧 Phase 1 – Build the Community:</span><br />
                Launch waitlist, Galxe campaigns, and distribute Beta Pass NFTs to onboard 30,000 early supporters and reward early engagement.
              </div>
              <div>
                <span className="font-bold text-purple-400">🚀 Phase 2 – Beta Launch:</span><br />
                Selected testers will access the Beta Game to play PvP and Free Mode, join tournaments, test smart contracts, and give feedback before public launch.
              </div>
              <div>
                <span className="font-bold text-purple-400">🌍 Phase 3 – Global Launch:</span><br />
                Raven Rush will go live across all supported chains with full gameplay, marketplace, tournaments, mobile version, and a smooth onboarding experience for Web2 and Web3 users.
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

