"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";

export default function DashboardNavBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const redirectToNASANews = () => {
    if (searchTerm.trim() !== "") {
      window.open(
        `https://science.nasa.gov/?search=${encodeURIComponent(searchTerm)}`,
        "_blank"
      );
      setIsSearchOpen(false);
      setSearchTerm("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      redirectToNASANews();
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 sm:h-20 bg-[#3B2462D4] px-3 sm:px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Link href="/dashboard" className="cursor-pointer">
            <Image
              src="/images/logos/chakrulo.png"
              alt="Chakrulo Logo"
              width={40}
              height={40}
              className="sm:w-12 sm:h-12"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center justify-center gap-3 xl:gap-4">
          <Link
            href="/dashboard/questionnaire"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            Questionnaire
          </Link>
          <Link
            href="/dashboard/readiness-score"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            Readiness Score
          </Link>
          <Link
            href="/dashboard/community"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            NASA Community
          </Link>
          <Link
            href="/dashboard/publications"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            Publications
          </Link>
          <Link
            href="/dashboard/profile"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            My Profile
          </Link>
          <Link
            href="http://localhost:8501/"
            target="_blank"
            className="text-base xl:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            Chakrulo AI
          </Link>
        </nav>

        {/* Right side - Search and Mobile Menu */}
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="hidden md:flex items-center justify-center">
            <input
              type="text"
              id="searchInput"
              placeholder="Search NASA News"
              value={searchTerm}
              className="py-2 sm:py-2.5 pl-3 sm:pl-4 pr-12 sm:pr-16 outline-none border-2 rounded-4xl text-white border-white input-icon text-sm sm:text-base w-40 lg:w-48 xl:w-auto"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
            />
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-white hover:text-[#E0DAE9] transition-colors"
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-[#E0DAE9] transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="fixed top-16 sm:top-20 left-0 right-0 z-40 bg-[#3B2462D4] p-3 sm:p-4 md:hidden">
          <input
            type="text"
            placeholder="Search NASA News"
            value={searchTerm}
            className="w-full py-2.5 pl-4 pr-4 outline-none border-2 rounded-4xl text-white border-white input-icon"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0000008d] z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <nav
        className={`fixed top-16 sm:top-20 right-0 h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] w-64 sm:w-80 bg-[#3B2462] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
          <Link
            href="/dashboard/questionnaire"
            onClick={closeMenu}
            className="text-lg sm:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out py-2 border-b border-[#E0DAE9]/30"
          >
            Questionnaire
          </Link>
          <Link
            href="/dashboard/readiness-score"
            onClick={closeMenu}
            className="text-lg sm:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out py-2 border-b border-[#E0DAE9]/30"
          >
            Readiness Score
          </Link>
          <Link
            href="/dashboard/community"
            onClick={closeMenu}
            className="text-lg sm:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out py-2 border-b border-[#E0DAE9]/30"
          >
            NASA Community
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={closeMenu}
            className="text-lg sm:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out py-2 border-b border-[#E0DAE9]/30"
          >
            My Profile
          </Link>
          <Link
            href="/dashboard/ai"
            target="_blank"
            onClick={closeMenu}
            className="text-lg sm:text-xl text-[#E0DAE9] hover:text-white transition-all duration-200 ease-in-out py-2 border-b border-[#E0DAE9]/30"
          >
            Chakrulo AI
          </Link>
        </div>
      </nav>
    </>
  );
}
