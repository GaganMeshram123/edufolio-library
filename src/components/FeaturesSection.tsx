
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, Download, Users, Shield } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Organized Content",
    description: "All resources neatly categorized by semester and subject for easy access."
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Smart Search",
    description: "Find exactly what you need with our powerful search functionality."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Regular Updates",
    description: "New resources added daily to keep you up-to-date with the latest materials."
  },
  {
    icon: <Download className="h-6 w-6" />,
    title: "Quick Downloads",
    description: "Download notes, papers and books instantly without any hassle."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community Driven",
    description: "Resources curated and validated by students and educators."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Quality Assured",
    description: "All materials are reviewed for accuracy and quality before publishing."
  }
];

const FeaturesSection = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose CollegeSpace?</h2>
          <p className="text-gray-600">
            We've designed the ultimate resource platform to make your academic journey smoother and more efficient.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              variants={item}
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
