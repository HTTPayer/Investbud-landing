'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-xl font-bold"
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-xs sm:text-sm ${
              isScrolled ? 'text-white' : 'text-white'
            }`}>
              IB
            </div>
            <div className="flex flex-col">
              <div>
                <span className={`${isScrolled ? 'text-gray-900' : 'text-white'} hidden xs:inline`}>
                  Investbud AI
                </span>
                <span className={`${isScrolled ? 'text-gray-900' : 'text-white'} xs:hidden`}>
                  Investbud AI
                </span>
              </div>
              <a
                href="https://httpayer.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[9px] sm:text-[10px] ${isScrolled ? 'text-gray-500' : 'text-gray-400'} hover:text-blue-500 transition-colors -mt-0.5`}
                onClick={(e) => e.stopPropagation()}
              >
                by HTTPayer
              </a>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('how-it-works')}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('chat-section')}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Try It
            </button>
            <button
              onClick={() => scrollToSection('for-builders')}
              className={`text-sm font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-blue-600'
                  : 'text-white/90 hover:text-white'
              }`}
            >
              For Builders
            </button>
            <button
              onClick={() => scrollToSection('chat-section')}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition-colors"
            >
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Start Now</span>
              <span className="xs:hidden">Start</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('capabilities')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Capabilities
              </button>
              <button
                onClick={() => scrollToSection('chat-section')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Try It
              </button>
              <button
                onClick={() => scrollToSection('for-builders')}
                className="text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                For Builders
              </button>
              <button
                onClick={() => scrollToSection('chat-section')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
              >
                <TrendingUp className="w-4 h-4" />
                Start Now
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
