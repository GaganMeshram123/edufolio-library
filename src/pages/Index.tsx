
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SemesterSection from '../components/SemesterSection';
import RecentResourcesSection from '../components/RecentResourcesSection';
import FeaturesSection from '../components/FeaturesSection';
import Footer from '../components/Footer';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        <Hero />
        <SemesterSection />
        <RecentResourcesSection />
        <FeaturesSection />
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
