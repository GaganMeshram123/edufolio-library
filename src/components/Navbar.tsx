
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User, BookOpen } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-medium"
          >
            <BookOpen className="h-6 w-6" />
            <span className="font-bold">CollegeSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-opacity ${
                isActive('/') ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/resources" 
              className={`text-sm font-medium transition-opacity ${
                isActive('/resources') ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
            >
              Resources
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-opacity ${
                isActive('/about') ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
            >
              About
            </Link>
            <div className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-gray-100 px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
              <Search className="absolute right-3 top-2 h-5 w-5 text-gray-500" />
            </div>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <button 
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              to="/login" 
              className="flex items-center gap-2 py-2 px-4 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              <span>Login</span>
            </Link>
            <Link 
              to="/signup" 
              className="flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors text-blue-600 text-sm font-medium"
            >
              <User className="h-4 w-4" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/resources" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/resources') ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                Resources
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                About
              </Link>
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="bg-gray-100 px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                />
                <Search className="absolute right-3 top-2 h-5 w-5 text-gray-500" />
              </div>
              <div className="flex flex-col space-y-2 mt-2">
                <Link 
                  to="/login" 
                  className="flex items-center gap-2 py-2 px-4 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-medium w-fit"
                >
                  <span>Login</span>
                </Link>
                <Link 
                  to="/signup" 
                  className="flex items-center gap-2 py-2 px-4 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors text-blue-600 text-sm font-medium w-fit"
                >
                  <User className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
