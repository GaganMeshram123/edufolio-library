
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import SemesterSection from '../components/SemesterSection';
import FeaturesSection from '../components/FeaturesSection';
import RecentResourcesSection from '../components/RecentResourcesSection';
import UniversitiesSection from '../components/UniversitiesSection';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { universitiesAPI } from '../utils/api';
import { Link } from 'react-router-dom';
import { University, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const data = await universitiesAPI.getUniversities();
        // Only show first 4 universities on homepage
        setUniversities(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <Hero />
      <SemesterSection />
      
      {/* Enhanced University Section with Direct CTA */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by University</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access study materials, notes, and past papers from all major universities across Maharashtra.
              Choose your university to find resources specific to your curriculum.
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <Link to="/universities">
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <University className="h-5 w-5" />
                <span>Browse All Maharashtra Universities</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {!isLoading && <UniversitiesSection universities={universities} />}
      <FeaturesSection />
      <RecentResourcesSection />
      <Footer />
    </motion.div>
  );
};

export default Index;
