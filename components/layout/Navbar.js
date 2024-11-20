'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black shadow-lg' : 'bg-black/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/fantaseeds-logo.png"
              alt="FANTASEEDS"
              width={120}
              height={40}
              className="w-auto h-8"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#about" 
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Nosotros
            </Link>
            <Link href="/#reprocann"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Reprocann
            </Link>
            <Link href="/geneticas"
              className="text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider">
              Genéticas
            </Link>
            <Link href="/#contact"
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg 
                       transition-all duration-200 text-sm uppercase tracking-wider">
              Contacto
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-black/95 backdrop-blur-sm rounded-lg mt-2">
              <Link href="/#about"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}>
                Nosotros
              </Link>
              <Link href="/#reprocann"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}>
                Reprocann
              </Link>
              <Link href="/geneticas"
                className="block px-3 py-2 text-gray-300 hover:text-green-400 transition-colors duration-200 text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}>
                Genéticas
              </Link>
              <Link href="/#contact"
                className="block px-3 py-2 text-green-400 hover:text-green-300 transition-colors duration-200 text-sm uppercase tracking-wider"
                onClick={() => setIsMenuOpen(false)}>
                Contacto
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 