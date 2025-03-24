
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, File, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

// Sample data - in a real app, this would come from an API
const allResources = [
  {
    id: 1,
    title: "Digital Electronics Complete Notes",
    type: "notes",
    subject: "Electronics",
    semester: 3,
    date: "2 days ago",
    views: 342,
    fileSize: "4.2 MB",
  },
  {
    id: 2,
    title: "Data Structures Final Exam Question Paper 2023",
    type: "paper",
    subject: "Computer Science",
    semester: 3,
    date: "1 week ago",
    views: 821,
    fileSize: "1.8 MB",
  },
  {
    id: 3,
    title: "Fluid Mechanics Textbook Solutions",
    type: "book",
    subject: "Mechanical",
    semester: 4,
    date: "3 days ago",
    views: 512,
    fileSize: "6.5 MB",
  },
  {
    id: 4,
    title: "Microprocessors and Microcontrollers Lab Manual",
    type: "notes",
    subject: "Electronics",
    semester: 5,
    date: "5 days ago",
    views: 378,
    fileSize: "3.9 MB",
  },
  {
    id: 5,
    title: "Discrete Mathematics Mid-Semester Paper with Solutions",
    type: "paper",
    subject: "Mathematics",
    semester: 2,
    date: "2 weeks ago",
    views: 645,
    fileSize: "2.3 MB",
  },
  {
    id: 6,
    title: "Computer Networks Illustrated Guide",
    type: "book",
    subject: "Computer Science",
    semester: 6,
    date: "1 day ago",
    views: 289,
    fileSize: "5.7 MB",
  },
  {
    id: 7,
    title: "Engineering Mathematics: Calculus and Linear Algebra",
    type: "notes",
    subject: "Mathematics",
    semester: 1,
    date: "1 month ago",
    views: 1248,
    fileSize: "7.1 MB",
  },
  {
    id: 8,
    title: "Operating Systems Principles and Design",
    type: "book",
    subject: "Computer Science",
    semester: 5,
    date: "2 weeks ago",
    views: 567,
    fileSize: "8.3 MB",
  },
  {
    id: 9,
    title: "Signals and Systems Previous Year Questions",
    type: "paper",
    subject: "Electronics",
    semester: 4,
    date: "3 weeks ago",
    views: 723,
    fileSize: "3.1 MB",
  },
  {
    id: 10,
    title: "Database Management Systems Comprehensive Notes",
    type: "notes",
    subject: "Computer Science",
    semester: 4,
    date: "1 week ago",
    views: 832,
    fileSize: "5.2 MB",
  },
  {
    id: 11,
    title: "Strength of Materials Formula Sheet",
    type: "notes",
    subject: "Mechanical",
    semester: 3,
    date: "2 days ago",
    views: 476,
    fileSize: "1.5 MB",
  },
  {
    id: 12,
    title: "Compiler Design End Semester Exam 2023",
    type: "paper",
    subject: "Computer Science",
    semester: 7,
    date: "1 month ago",
    views: 581,
    fileSize: "2.7 MB",
  },
];

// Available subjects and types for filtering
const subjects = ["Computer Science", "Electronics", "Mechanical", "Mathematics"];
const resourceTypes = ["notes", "paper", "book"];
const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredResources, setFilteredResources] = useState(allResources);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if there's a search query in the URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      setSearchTerm(query);
      performSearch(query);
      
      // Show toast notification for search
      toast({
        title: "Searching for resources",
        description: `Found ${getFilteredResources(query).length} results for "${query}"`,
      });
    }
  }, [location.search]);

  useEffect(() => {
    // Apply filters
    applyFilters();
  }, [searchTerm, selectedSubjects, selectedTypes, selectedSemesters]);

  const getFilteredResources = (term: string, subjects: string[] = selectedSubjects, types: string[] = selectedTypes, sems: number[] = selectedSemesters) => {
    let results = allResources;
    
    // Search filter
    if (term) {
      results = results.filter(resource => 
        resource.title.toLowerCase().includes(term.toLowerCase()) || 
        resource.subject.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Subject filter
    if (subjects.length > 0) {
      results = results.filter(resource => subjects.includes(resource.subject));
    }
    
    // Type filter
    if (types.length > 0) {
      results = results.filter(resource => types.includes(resource.type));
    }
    
    // Semester filter
    if (sems.length > 0) {
      results = results.filter(resource => sems.includes(resource.semester));
    }
    
    return results;
  };

  const applyFilters = () => {
    const results = getFilteredResources(searchTerm);
    setFilteredResources(results);
  };

  const performSearch = (term: string) => {
    setSearchTerm(term);
    const results = getFilteredResources(term);
    setFilteredResources(results);
    console.log(`Searching for: ${term}, found ${results.length} results`);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(searchTerm);
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleSemester = (semester: number) => {
    if (selectedSemesters.includes(semester)) {
      setSelectedSemesters(selectedSemesters.filter(s => s !== semester));
    } else {
      setSelectedSemesters([...selectedSemesters, semester]);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubjects([]);
    setSelectedTypes([]);
    setSelectedSemesters([]);
    setFilteredResources(allResources);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar onSearch={performSearch} />
      
      <main className="pt-24 pb-20">
        <section className="bg-blue-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8"
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Resource Library</h1>
                <p className="text-xl text-gray-600">
                  Access thousands of study materials, notes, and past papers
                </p>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for resources by title, subject, etc."
                  className="pl-12 py-6 text-lg rounded-full shadow-md"
                  value={searchTerm}
                  onChange={handleSearchInputChange}
                  onKeyPress={handleSearchKeyPress}
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Filters - Sidebar */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-64 shrink-0"
              >
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button 
                      onClick={resetFilters}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Reset all
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Resource Type</h3>
                    <div className="space-y-2">
                      {resourceTypes.map((type) => (
                        <div key={type} className="flex items-center">
                          <Checkbox 
                            id={`type-${type}`}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() => toggleType(type)}
                          />
                          <label 
                            htmlFor={`type-${type}`}
                            className="ml-2 text-sm capitalize"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Subject</h3>
                    <div className="space-y-2">
                      {subjects.map((subject) => (
                        <div key={subject} className="flex items-center">
                          <Checkbox 
                            id={`subject-${subject}`}
                            checked={selectedSubjects.includes(subject)}
                            onCheckedChange={() => toggleSubject(subject)}
                          />
                          <label 
                            htmlFor={`subject-${subject}`}
                            className="ml-2 text-sm"
                          >
                            {subject}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Semester</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {semesters.map((semester) => (
                        <div 
                          key={semester}
                          onClick={() => toggleSemester(semester)}
                          className={`
                            cursor-pointer text-center py-1 px-2 rounded text-sm
                            ${selectedSemesters.includes(semester) 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'bg-gray-100 hover:bg-gray-200'
                            }
                          `}
                        >
                          {semester}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Mobile filter button */}
                <div className="md:hidden fixed bottom-4 right-4 z-10">
                  <Button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-full h-14 w-14 flex items-center justify-center"
                  >
                    <Filter />
                  </Button>
                </div>
              </motion.div>
              
              {/* Resources Grid */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1"
              >
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-2xl font-bold">All Resources</h2>
                  <p className="text-gray-500">{filteredResources.length} results</p>
                </div>
                
                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource, index) => (
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
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No resources found</h3>
                    <p className="text-gray-500 mb-6">
                      We couldn't find any resources matching your search criteria.
                    </p>
                    <Button variant="outline" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default ResourcesPage;
