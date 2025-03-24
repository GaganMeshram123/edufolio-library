
import React from 'react';
import { motion } from 'framer-motion';
import SemesterCard from './SemesterCard';

const semesterData = [
  {
    semester: 1,
    description: "Foundation courses including Math, Physics and Basic Engineering",
    resources: 120
  },
  {
    semester: 2,
    description: "Core engineering principles and programming fundamentals",
    resources: 145
  },
  {
    semester: 3,
    description: "Dive deeper into circuit theory and digital electronics",
    resources: 165
  },
  {
    semester: 4,
    description: "Data structures, algorithms and software engineering",
    resources: 185
  },
  {
    semester: 5,
    description: "Advanced topics in your specialization field",
    resources: 175
  },
  {
    semester: 6,
    description: "Systems design, networks and specialized electives",
    resources: 155
  },
  {
    semester: 7,
    description: "Project work begins with advanced technical electives",
    resources: 125
  },
  {
    semester: 8,
    description: "Final projects, thesis work and specialized courses",
    resources: 130
  }
];

const SemesterSection = () => {
  return (
    <section id="semesters" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Browse by Semester</h2>
          <p className="text-gray-600">
            All engineering resources organized semester-wise for easy access. 
            Select your semester to find relevant study materials.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {semesterData.map((semester, index) => (
            <SemesterCard
              key={semester.semester}
              semester={semester.semester}
              description={semester.description}
              resources={semester.resources}
              delay={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SemesterSection;
