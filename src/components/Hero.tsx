
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, FileText, Clock, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/resources?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const stats = [
    { icon: <BookOpen className="h-5 w-5" />, label: 'Subjects', value: '48+' },
    { icon: <FileText className="h-5 w-5" />, label: 'Resources', value: '1200+' },
    { icon: <School className="h-5 w-5" />, label: 'Universities', value: '8+' },
    { icon: <Clock className="h-5 w-5" />, label: 'Updated', value: 'Daily' },
  ];

  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-60 blur-3xl"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-indigo-100 rounded-full opacity-60 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              Welcome to CollegeSpace
            </span>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Complete Engineering <br /> Resource Library
          </motion.h1>

          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Access quality study materials for all engineering semesters and universities in Maharashtra. 
            Notes, question papers, and resources organized for maximum productivity.
          </motion.p>

          <motion.div 
            className="relative max-w-xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for resources, notes, papers..." 
                className="w-full py-4 px-6 pr-12 bg-white rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Try searching: "Digital Electronics notes" or "Data Structures question paper"
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mb-3 text-blue-600">
                  {stat.icon}
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a 
              href="#semesters" 
              className="py-3 px-6 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              Browse by Semester
            </a>
            <a 
              href="#universities" 
              className="py-3 px-6 rounded-full bg-white border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
            >
              Browse by University
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
