import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, BookOpen, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onSearch?: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdminAuthenticated, isAdmin, logout } = useAuth();

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log("Navbar search:", searchTerm);
      
      // If we're on the resources page and have a direct search handler
      if (location.pathname === '/resources' && onSearch) {
        onSearch(searchTerm);
      } else {
        // Otherwise, navigate to resources page with search query
        navigate(`/resources?q=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
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
              to="/universities" 
              className={`text-sm font-medium transition-opacity ${
                isActive('/universities') ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
            >
              Universities
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-opacity ${
                isActive('/about') ? 'opacity-100' : 'opacity-90 hover:opacity-100'
              }`}
            >
              About
            </Link>
            {isAdminAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/admin" 
                  className="flex items-center gap-1 text-sm font-medium transition-opacity opacity-90 hover:opacity-100"
                >
                  <Settings className="h-4 w-4" />
                  Admin Panel
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={logout}
                  className="flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-gray-100 px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
              />
              <button type="submit" className="absolute right-3 top-2 h-5 w-5 text-gray-500">
                <Search className="h-5 w-5" />
              </button>
            </form>
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
                to="/universities" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/universities') ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                Universities
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/about') ? 'text-blue-600' : 'hover:text-blue-600'
                }`}
              >
                About
              </Link>
              <form 
                onSubmit={handleSearchSubmit}
                className="relative mt-2"
              >
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="bg-gray-100 px-4 py-2 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                />
                <button type="submit" className="absolute right-3 top-2 h-5 w-5 text-gray-500">
                  <Search className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
