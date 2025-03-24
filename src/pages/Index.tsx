
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
      {!isLoading && <UniversitiesSection universities={universities} />}
      <FeaturesSection />
      <RecentResourcesSection />
      <Footer />
    </motion.div>
  );
};

export default Index;
