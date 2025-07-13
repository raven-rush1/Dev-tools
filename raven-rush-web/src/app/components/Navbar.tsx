'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-black text-white w-full shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://i.postimg.cc/05YvjHFS/Raven-Rush-logo-2-0.png"
            alt="Raven Rush Logo"
            className="w-8 h-8 rounded-full border-2 border-purple-700"
          />
          <span className="text-xl font-bold tracking-wide">Raven Rush</span>
        </Link>

        <button className="md:hidden" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/home" className="hover:text-gray-300">Home</Link>
          <Link href="/main-quest" className="hover:text-gray-300">Main Quest</Link>
          <a href="https://discord.gg/ZcfGd3DJjd" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Discord</a>
          <a href="https://twitter.com/raven_rush1" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">Twitter</a>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 bg-black text-sm space-y-2">
          <Link href="/home" onClick={toggleMenu} className="block">Home</Link>
          <Link href="/main-quest" onClick={toggleMenu} className="block">Main Quest</Link>
          <a href="https://discord.gg/ZcfGd3DJjd" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="block">Discord</a>
          <a href="https://twitter.com/raven_rush1" target="_blank" rel="noopener noreferrer" onClick={toggleMenu} className="block">Twitter</a>
        </div>
      )}
    </header>
  );
}
