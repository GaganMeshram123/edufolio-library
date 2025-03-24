
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div>
      <Navbar />
      
      <main className="min-h-[80vh] flex items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <AlertTriangle size={36} />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Go back home
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
