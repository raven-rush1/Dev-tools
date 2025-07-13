import { FaDiscord, FaTwitter, FaBook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white text-sm py-6 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Raven Rush. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="https://discord.gg/ZcfGd3DJjd" target="_blank" rel="noopener noreferrer">
            <FaDiscord className="text-xl hover:text-gray-300" />
          </a>
          <a href="https://twitter.com/raven_rush1" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-gray-300" />
          </a>
          <a href="https://raven-rush.gitbook.io/docs" target="_blank" rel="noopener noreferrer">
            <FaBook className="text-xl hover:text-gray-300" />
          </a>
        </div>
      </div>
    </footer>
  );
}
