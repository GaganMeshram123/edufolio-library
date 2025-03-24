
import React from 'react';
import { motion } from 'framer-motion';
import { File, Download, Clock, Eye } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  type: 'notes' | 'paper' | 'book';
  subject: string;
  date: string;
  views: number;
  fileSize: string;
  delay?: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  type,
  subject,
  date,
  views,
  fileSize,
  delay = 0
}) => {
  const getIcon = () => {
    switch (type) {
      case 'notes':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'paper':
        return <File className="h-5 w-5 text-orange-500" />;
      case 'book':
        return <File className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'notes':
        return 'bg-blue-50 text-blue-700';
      case 'paper':
        return 'bg-orange-50 text-orange-700';
      case 'book':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
      className="neo-card p-5 hover:shadow-md group"
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            {getIcon()}
            <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${getTypeColor()}`}>
              {type}
            </span>
            <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-50">
              {subject}
            </span>
          </div>
          <h3 className="font-medium text-lg mb-2 line-clamp-2">{title}</h3>
          
          <div className="flex items-center gap-5 mt-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{views} views</span>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="flex flex-col items-center justify-between"
          whileHover={{ scale: 1.05 }}
        >
          <button className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Download className="h-5 w-5" />
          </button>
          <span className="text-xs text-gray-500 mt-2">{fileSize}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;
