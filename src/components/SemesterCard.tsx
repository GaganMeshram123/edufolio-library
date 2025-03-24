
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight } from 'lucide-react';

interface SemesterCardProps {
  semester: number;
  description: string;
  resources: number;
  delay?: number;
}

const SemesterCard: React.FC<SemesterCardProps> = ({ 
  semester, 
  description, 
  resources, 
  delay = 0 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="neo-card overflow-hidden group"
    >
      <Link to={`/semester/${semester}`} className="block p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600">
            <span className="font-bold">{semester}</span>
          </div>
          <motion.div 
            animate={{ 
              x: isHovered ? 0 : -5, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ duration: 0.3 }}
            className="bg-blue-500 text-white p-1 rounded-full"
          >
            <ArrowRight size={16} />
          </motion.div>
        </div>
        <h3 className="text-lg font-bold mb-2">Semester {semester}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1 text-gray-500">
            <FileText size={14} />
            <span>{resources} resources</span>
          </div>
          <motion.span 
            className="text-blue-600 font-medium flex items-center gap-1"
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            Explore
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
};

export default SemesterCard;
