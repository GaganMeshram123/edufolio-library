
import React from 'react';
import { motion } from 'framer-motion';
import ResourceCard from './ResourceCard';
import { ArrowRight } from 'lucide-react';

const recentResources = [
  {
    id: 1,
    title: "Digital Electronics Complete Notes",
    type: "notes",
    subject: "Electronics",
    date: "2 days ago",
    views: 342,
    fileSize: "4.2 MB",
  },
  {
    id: 2,
    title: "Data Structures Final Exam Question Paper 2023",
    type: "paper",
    subject: "Computer Science",
    date: "1 week ago",
    views: 821,
    fileSize: "1.8 MB",
  },
  {
    id: 3,
    title: "Fluid Mechanics Textbook Solutions",
    type: "book",
    subject: "Mechanical",
    date: "3 days ago",
    views: 512,
    fileSize: "6.5 MB",
  },
  {
    id: 4,
    title: "Microprocessors and Microcontrollers Lab Manual",
    type: "notes",
    subject: "Electronics",
    date: "5 days ago",
    views: 378,
    fileSize: "3.9 MB",
  },
  {
    id: 5,
    title: "Discrete Mathematics Mid-Semester Paper with Solutions",
    type: "paper",
    subject: "Mathematics",
    date: "2 weeks ago",
    views: 645,
    fileSize: "2.3 MB",
  },
  {
    id: 6,
    title: "Computer Networks Illustrated Guide",
    type: "book",
    subject: "Computer Science",
    date: "1 day ago",
    views: 289,
    fileSize: "5.7 MB",
  }
];

const RecentResourcesSection = () => {
  return (
    <section id="resources" className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-12">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Recently Added Resources</h2>
            <p className="text-gray-600">
              Stay updated with the latest study materials and resources added to our library.
            </p>
          </motion.div>
          
          <motion.a 
            href="/resources"
            className="hidden md:flex items-center gap-2 text-blue-600 font-medium hover:underline"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            View all resources
            <ArrowRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {recentResources.map((resource, index) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              type={resource.type as 'notes' | 'paper' | 'book'}
              subject={resource.subject}
              date={resource.date}
              views={resource.views}
              fileSize={resource.fileSize}
              delay={index}
            />
          ))}
        </div>
        
        <motion.div 
          className="flex md:hidden justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <a 
            href="/resources"
            className="py-3 px-6 rounded-full bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
          >
            View all resources
            <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RecentResourcesSection;
