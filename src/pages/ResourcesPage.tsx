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
import { supabase } from '@/integrations/supabase/client';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string;
  created_at: string;
  subject_id: string;
  subjects: {
    name: string;
    semester: number;
  };
}

interface Subject {
  id: string;
  name: string;
  semester: number;
}

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const location = useLocation();

  const resourceTypes = [
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'paper', label: 'Question Papers', icon: File },
    { id: 'book', label: 'Books/Solutions', icon: BookOpen },
  ];

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedSubjects, selectedTypes, selectedSemesters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all resources with subject information
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select(`
          *,
          subjects (
            name,
            semester
          )
        `);

      if (resourcesError) throw resourcesError;

      // Fetch all subjects for filters
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, name, semester');

      if (subjectsError) throw subjectsError;

      setResources(resourcesData || []);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.subjects?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Subject filter
    if (selectedSubjects.length > 0) {
      filtered = filtered.filter(resource =>
        selectedSubjects.includes(resource.subjects?.name || '')
      );
    }

    // Type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(resource => {
        const resourceType = getResourceTypeDisplay(resource.type);
        return selectedTypes.includes(resourceType);
      });
    }

    // Semester filter
    if (selectedSemesters.length > 0) {
      filtered = filtered.filter(resource =>
        selectedSemesters.includes(resource.subjects?.semester || 0)
      );
    }

    setFilteredResources(filtered);
  };

  const getResourceTypeDisplay = (type: string): 'notes' | 'paper' | 'book' => {
    const typeMap: { [key: string]: 'notes' | 'paper' | 'book' } = {
      'pdf': 'notes',
      'notes': 'notes',
      'paper': 'paper',
      'question_paper': 'paper',
      'book': 'book',
      'solution': 'book'
    };
    return typeMap[type.toLowerCase()] || 'notes';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    setSelectedSubjects(prev =>
      checked ? [...prev, subject] : prev.filter(s => s !== subject)
    );
  };

  const handleTypeChange = (type: string, checked: boolean) => {
    setSelectedTypes(prev =>
      checked ? [...prev, type] : prev.filter(t => t !== type)
    );
  };

  const handleSemesterChange = (semester: number, checked: boolean) => {
    setSelectedSemesters(prev =>
      checked ? [...prev, semester] : prev.filter(s => s !== semester)
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubjects([]);
    setSelectedTypes([]);
    setSelectedSemesters([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Study Resources</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover a vast collection of study materials, notes, question papers, and reference books 
              to enhance your learning experience across all semesters.
            </p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <motion.div 
              className="lg:w-1/4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="sticky top-24">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" />
                      Filters
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Resources
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by title, subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Resource Types */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Resource Type
                    </label>
                    <div className="space-y-2">
                      {resourceTypes.map(type => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.id}
                            checked={selectedTypes.includes(type.id)}
                            onCheckedChange={(checked) => 
                              handleTypeChange(type.id, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={type.id}
                            className="text-sm text-gray-700 cursor-pointer flex items-center gap-2"
                          >
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Subjects
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Array.from(new Set(subjects.map(s => s.name))).map(subjectName => (
                        <div key={subjectName} className="flex items-center space-x-2">
                          <Checkbox
                            id={subjectName}
                            checked={selectedSubjects.includes(subjectName)}
                            onCheckedChange={(checked) => 
                              handleSubjectChange(subjectName, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={subjectName}
                            className="text-sm text-gray-700 cursor-pointer truncate"
                            title={subjectName}
                          >
                            {subjectName}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Semesters */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Semester
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {semesters.map(sem => (
                        <div key={sem} className="flex items-center space-x-1">
                          <Checkbox
                            id={`sem-${sem}`}
                            checked={selectedSemesters.includes(sem)}
                            onCheckedChange={(checked) => 
                              handleSemesterChange(sem, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`sem-${sem}`}
                            className="text-sm text-gray-700 cursor-pointer"
                          >
                            {sem}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div 
              className="lg:w-3/4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {filteredResources.length === resources.length 
                      ? 'All Resources' 
                      : `Filtered Resources`
                    }
                  </h2>
                  <span className="text-gray-500 text-sm">
                    {filteredResources.length} of {resources.length} resources
                  </span>
                </div>

                {filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.map((resource, index) => (
                      <motion.div
                        key={resource.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ResourceCard
                          title={resource.title}
                          type={getResourceTypeDisplay(resource.type)}
                          subject={resource.subjects?.name || 'Unknown Subject'}
                          date={formatDate(resource.created_at)}
                          views={Math.floor(Math.random() * 1000)} // Random views for now
                          fileSize="0 MB" // File size not stored
                          delay={index}
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <File className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                    <p className="text-gray-500 mb-4">
                      No resources match your current filters. Try adjusting your search criteria.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;