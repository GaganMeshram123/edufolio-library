import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Filter, BookOpen, FileText, File, Download } from 'lucide-react';
import Navbar from '../components/Navbar';
import ResourceCard from '../components/ResourceCard';
import Footer from '../components/Footer';
import PDFViewer from '../components/PDFViewer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Subject {
  id: string;
  name: string;
  description: string;
  semester: number;
  credits: number;
  resource_count?: number;
}

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

const SemesterPage = () => {
  const { semesterId } = useParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [activeSubject, setActiveSubject] = useState<string>('all');
  const [activeType, setActiveType] = useState<string>('all');
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const semester = parseInt(semesterId || '1');

  useEffect(() => {
    fetchSemesterData();
  }, [semester]);

  useEffect(() => {
    filterResources();
  }, [activeSubject, activeType, resources]);

  const fetchSemesterData = async () => {
    setLoading(true);
    try {
      // Fetch subjects for this semester
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('semester', semester);

      if (subjectsError) throw subjectsError;

      // Fetch resources for subjects in this semester
      const subjectIds = subjectsData?.map(s => s.id) || [];
      
      let resourcesData: Resource[] = [];
      if (subjectIds.length > 0) {
        const { data, error: resourcesError } = await supabase
          .from('resources')
          .select(`
            *,
            subjects (
              name,
              semester
            )
          `)
          .in('subject_id', subjectIds);

        if (resourcesError) throw resourcesError;
        resourcesData = data || [];
      }

      // Count resources per subject
      const subjectsWithCounts = subjectsData?.map(subject => ({
        ...subject,
        resource_count: resourcesData.filter(r => r.subject_id === subject.id).length
      })) || [];

      setSubjects(subjectsWithCounts);
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching semester data:', error);
      toast({
        title: "Error",
        description: "Failed to load semester data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = [...resources];
    
    if (activeSubject !== 'all') {
      filtered = filtered.filter(resource => resource.subjects?.name === activeSubject);
    }
    
    if (activeType !== 'all') {
      const typeMap: { [key: string]: string[] } = {
        'notes': ['notes', 'pdf'],
        'paper': ['paper', 'question_paper'],
        'book': ['book', 'solution']
      };
      
      const allowedTypes = typeMap[activeType] || [activeType];
      filtered = filtered.filter(resource => allowedTypes.includes(resource.type.toLowerCase()));
    }
    
    setFilteredResources(filtered);
  };

  const handlePDFView = (resource: Resource) => {
    if (resource.file_url) {
      setSelectedPDF({
        title: resource.title,
        pdfUrl: resource.file_url,
        fileSize: '0 MB', // We don't store file size, could be calculated
        subjectInfo: resource.description
      });
      setIsPDFViewerOpen(true);
    }
  };

  const handlePDFDownload = (resource: Resource) => {
    if (resource.file_url) {
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.setAttribute('download', `${resource.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        description: "Resource downloaded successfully!",
        duration: 3000,
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading semester data...</p>
        </div>
      </div>
    );
  }

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
                <p className="text-gray-600 max-w-3xl">
                  Explore academic resources for semester {semester}. Access notes, question papers, and study materials for all subjects.
                </p>
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
                            <span className="truncate">{subject.name}</span>
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
                              {subject.resource_count || 0}
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
                      {filteredResources.length} resources found
                    </span>
                  </div>
                  
                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <AnimatePresence>
                        {filteredResources.map((resource, index) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
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
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                      <p className="text-gray-500">
                        No resources found matching your criteria. Try adjusting your filters or check back later.
                      </p>
                    </div>
                  )}
                </div>

                {/* PDF Resources Section */}
                {activeSubject !== 'all' && (
                  <motion.div 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <File className="h-5 w-5 text-blue-600" />
                      {activeSubject} PDF Resources
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Download or view PDF resources for {activeSubject}
                    </p>
                    
                    <div className="space-y-4">
                      {filteredResources
                        .filter(r => r.subjects?.name === activeSubject && r.file_url)
                        .map((resource) => (
                          <div 
                            key={resource.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-50 rounded-lg">
                                <File className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{resource.title}</h4>
                                <p className="text-sm text-gray-500">PDF Document</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePDFView(resource)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handlePDFDownload(resource)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {filteredResources.filter(r => r.subjects?.name === activeSubject && r.file_url).length === 0 && (
                        <div className="text-center py-8">
                          <File className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No PDF resources available for this subject yet.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
        
        {selectedPDF && (
          <PDFViewer
            title={selectedPDF.title}
            pdfUrl={selectedPDF.pdfUrl}
            fileSize={selectedPDF.fileSize}
            isOpen={isPDFViewerOpen}
            onClose={() => setIsPDFViewerOpen(false)}
            subjectInfo={selectedPDF.subjectInfo}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SemesterPage;