
import React from 'react';
import { motion } from 'framer-motion';
import { University } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Map, Users } from 'lucide-react';

interface UniversitySectionProps {
  universities: University[];
}

const UniversitiesSection = ({ universities }: UniversitySectionProps) => {
  const navigate = useNavigate();

  return (
    <section id="universities" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Maharashtra Universities</h2>
          <p className="text-gray-600">
            Access study materials, notes, and past papers from all major universities across Maharashtra.
            Choose your university to find resources specific to your curriculum.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((university, index) => (
            <motion.div
              key={university.id}
              className="neo-card overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => navigate(`/university/${university.id}`)}
            >
              <div className="h-36 overflow-hidden">
                <img 
                  src={university.imageUrl} 
                  alt={university.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2 line-clamp-1">{university.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{university.description}</p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Map className="h-4 w-4" />
                    <span>{university.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{university.resourceCount} resources</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button
            onClick={() => navigate('/universities')}
            className="inline-flex items-center px-6 py-3 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
          >
            View All Universities
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;
