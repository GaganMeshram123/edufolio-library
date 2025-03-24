
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Filter, BookOpen, FileText, File } from 'lucide-react';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import Footer from '../components/Footer';

// Mock data for subjects by semester
const semesterSubjects = {
  '1': [
    { id: 1, name: 'Engineering Mathematics I', resources: 24 },
    { id: 2, name: 'Engineering Physics', resources: 18 },
    { id: 3, name: 'Engineering Chemistry', resources: 16 },
    { id: 4, name: 'Basic Electrical Engineering', resources: 21 },
    { id: 5, name: 'Engineering Graphics', resources: 12 },
  ],
  '2': [
    { id: 1, name: 'Engineering Mathematics II', resources: 22 },
    { id: 2, name: 'Basic Electronics', resources: 19 },
    { id: 3, name: 'Programming and Data Structures', resources: 25 },
    { id: 4, name: 'Engineering Mechanics', resources: 17 },
    { id: 5, name: 'Environmental Studies', resources: 14 },
  ],
  // ... remaining semesters
};

// Mock data for semester descriptions
const semesterDescriptions = {
  '1': 'First semester focuses on fundamental sciences and basic engineering principles that form the foundation of your engineering education.',
  '2': 'Second semester builds upon the basics and introduces core engineering concepts and programming fundamentals.',
  '3': 'Third semester dives deeper into your chosen branch with specialized subjects and more advanced concepts.',
  '4': 'Fourth semester focuses on core technical subjects and introduces more specialized areas of study.',
  '5': 'Fifth semester introduces advanced topics in your specialization with more emphasis on applications.',
  '6': 'Sixth semester covers complex engineering concepts and introduces electives for specialization.',
  '7': 'Seventh semester focuses on industry-relevant topics and begins project work in specialized areas.',
  '8': 'Final semester is dedicated to completing major projects and specialized elective courses.',
};

// Mock resources data
const mockResources = [
  {
    id: 1,
    title: "Complete Mathematics I Notes",
    type: "notes",
    subject: "Engineering Mathematics I",
    date: "2 weeks ago",
    views: 542,
    fileSize: "3.8 MB",
  },
  {
    id: 2,
    title: "Physics Mid Term Question Paper 2023",
    type: "paper",
    subject: "Engineering Physics",
    date: "1 month ago",
    views: 742,
    fileSize: "1.5 MB",
  },
  {
    id: 3,
    title: "Chemistry Laboratory Manual",
    type: "book",
    subject: "Engineering Chemistry",
    date: "3 weeks ago",
    views: 412,
    fileSize: "5.2 MB",
  },
  {
    id: 4,
    title: "Electrical Engineering Fundamentals",
    type: "notes",
    subject: "Basic Electrical Engineering",
    date: "5 days ago",
    views: 298,
    fileSize: "4.1 MB",
  },
  {
    id: 5,
    title: "Engineering Graphics Practice Sheets",
    type: "notes",
    subject: "Engineering Graphics",
    date: "2 days ago",
    views: 185,
    fileSize: "6.7 MB",
  },
  {
    id: 6,
    title: "Final Exam Previous Year Papers",
    type: "paper",
    subject: "Engineering Mathematics I",
    date: "1 week ago",
    views: 687,
    fileSize: "2.9 MB",
  },
];

const SemesterPage = () => {
  const { semesterId } = useParams();
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [resources, setResources] = useState(mockResources);
  
  const semester = semesterId || '1';
  const subjects = semesterSubjects[semester as keyof typeof semesterSubjects] || [];
  const description = semesterDescriptions[semester as keyof typeof semesterDescriptions] || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Filter based on subject and type
    let filtered = [...mockResources];
    
    if (activeSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === activeSubject);
    }
    
    if (activeType !== 'all') {
      filtered = filtered.filter(resource => resource.type === activeType);
    }
    
    setResources(filtered);
  }, [activeSubject, activeType]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navbar />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-8">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors mb-4"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Semester {semester} Resources</h1>
                <p className="text-gray-600 max-w-3xl">{description}</p>
              </motion.div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <motion.div 
                className="lg:w-1/4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="sticky top-24">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      Subjects
                    </h3>
                    
                    <ul className="space-y-2">
                      <li>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeSubject === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveSubject('all')}
                        >
                          All Subjects
                        </button>
                      </li>
                      {subjects.map(subject => (
                        <li key={subject.id}>
                          <button 
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                              activeSubject === subject.name ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setActiveSubject(subject.name)}
                          >
                            <span>{subject.name}</span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                              {subject.resources}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      Resource Type
                    </h3>
                    
                    <ul className="space-y-2">
                      <li>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeType === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveType('all')}
                        >
                          All Types
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            activeType === 'notes' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveType('notes')}
                        >
                          <FileText className="h-4 w-4" />
                          Notes
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            activeType === 'paper' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveType('paper')}
                        >
                          <File className="h-4 w-4" />
                          Question Papers
                        </button>
                      </li>
                      <li>
                        <button 
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                            activeType === 'book' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setActiveType('book')}
                        >
                          <BookOpen className="h-4 w-4" />
                          Books/Solutions
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="lg:w-3/4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">
                      {activeSubject === 'all' ? 'All Resources' : activeSubject}
                      {activeType !== 'all' && ` - ${activeType === 'notes' ? 'Notes' : activeType === 'paper' ? 'Question Papers' : 'Books/Solutions'}`}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {resources.length} resources found
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <AnimatePresence>
                      {resources.length > 0 ? (
                        resources.map((resource, index) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <ResourceCard
                              title={resource.title}
                              type={resource.type as 'notes' | 'paper' | 'book'}
                              subject={resource.subject}
                              date={resource.date}
                              views={resource.views}
                              fileSize={resource.fileSize}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <motion.div 
                          className="col-span-2 py-10 text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-500">No resources found matching your criteria.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default SemesterPage;
