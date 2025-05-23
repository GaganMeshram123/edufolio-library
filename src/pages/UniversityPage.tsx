import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { BookOpen, Calendar, Clock, File, FileText, Map, Users, ExternalLink, GraduationCap, Layers, Book, Download, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ResourceCard from '../components/ResourceCard';
import PDFViewer from '../components/PDFViewer';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { University, Resource, universitiesAPI, BranchSubject } from '../utils/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock PDF data for subjects
const subjectPDFs = {
  'Applied Mathematics I': [
    { id: 1, title: 'Chapter 1: Calculus Fundamentals', fileSize: '3.2 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 2, title: 'Chapter 2: Differential Equations', fileSize: '2.8 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 3, title: 'Practice Problems Set 1', fileSize: '1.5 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'Database Management Systems': [
    { id: 4, title: 'SQL Complete Guide', fileSize: '4.2 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 5, title: 'Normalization Techniques', fileSize: '2.1 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'Object Oriented Programming': [
    { id: 6, title: 'Java Programming Notes', fileSize: '3.8 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 7, title: 'OOP Concepts and Examples', fileSize: '2.5 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'Operating Systems': [
    { id: 8, title: 'Process Management', fileSize: '4.0 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 9, title: 'Memory Management Techniques', fileSize: '3.5 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  'Computer Networks': [
    { id: 10, title: 'Network Protocols Handbook', fileSize: '5.2 MB', type: 'pdf', downloadUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  ],
  // Add more subjects and PDFs as needed
};

// Add subject information data
const subjectInformation = {
  'Applied Mathematics I': 'This foundational course covers calculus, differential equations, matrices, and other mathematical concepts essential for engineering applications. Students learn analytical skills for solving complex engineering problems.',
  'Database Management Systems': 'Covers relational database design, SQL, normalization, transaction management, and database administration. Students learn to design and implement efficient database solutions for various applications.',
  'Object Oriented Programming': 'Introduces object-oriented design principles, inheritance, polymorphism, encapsulation, and exception handling. Students learn to develop modular, reusable software using object-oriented programming languages.',
  'Operating Systems': 'Covers process management, memory management, file systems, I/O systems, and protection mechanisms. Students learn how operating systems function and manage computer resources efficiently.',
  'Computer Networks': 'Explores network architectures, protocols, routing algorithms, network security, and application layer services. Students learn to design and implement computer networks for various communication needs.',
};

const UniversityPage = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const [university, setUniversity] = useState<University | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState<string>('branches');
  const [selectedPDF, setSelectedPDF] = useState<any>(null);
  const [isPDFViewerOpen, setIsPDFViewerOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        setIsLoading(true);
        if (!universityId) return;
        
        const id = parseInt(universityId);
        const universityData = await universitiesAPI.getUniversityById(id);
        
        if (universityData) {
          setUniversity(universityData);
          // Fetch resources for this university
          const resourcesData = await universitiesAPI.getUniversityResources(universityData.name);
          setResources(resourcesData);
        } else {
          toast({
            title: "University not found",
            description: "The requested university could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching university data:", error);
        toast({
          title: "Error",
          description: "Failed to load university data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUniversityData();
  }, [universityId, toast]);

  // Helper to get resources for a specific subject and semester
  const getResourcesForSubject = (subjectName: string, semester: number) => {
    return resources.filter(
      resource => resource.subject === subjectName && resource.semester === semester
    );
  };

  const filteredResources = resources.filter(resource => {
    const matchesSemester = selectedSemester === 'all' || resource.semester.toString() === selectedSemester;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesSemester && matchesSubject;
  });

  // Extract unique subjects and semesters for filters
  const subjects = Array.from(new Set(resources.map(r => r.subject)));
  const semesters = Array.from(new Set(resources.map(r => r.semester))).sort((a, b) => a - b);

  // Handle PDF view
  const handlePDFView = (pdf: any) => {
    setSelectedPDF(pdf);
    setIsPDFViewerOpen(true);
  };

  // Handle PDF download
  const handlePDFDownload = (pdf: any) => {
    const link = document.createElement('a');
    link.href = pdf.downloadUrl;
    link.setAttribute('download', `${pdf.title.replace(/\s+/g, '-').toLowerCase()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      description: "PDF downloaded successfully!",
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading university data...</div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">University not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section 
          className="relative bg-blue-900 text-white py-16"
          style={{
            backgroundImage: `linear-gradient(rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.9)), url(${university.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{university.name}</h1>
                  <p className="text-blue-100 mb-6 max-w-2xl">{university.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                      <Map className="h-5 w-5 mr-2" />
                      <span>{university.location}</span>
                    </div>
                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>Est. {university.established}</span>
                    </div>
                    <div className="bg-blue-800/50 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      <span>{university.resourceCount} Resources</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  <Button className="bg-white text-blue-900 hover:bg-blue-50">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit University Website
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Main Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4 md:px-6">
            <Tabs 
              defaultValue="branches" 
              className="w-full"
              value={selectedTab}
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
                <TabsTrigger value="branches">Branches & Subjects</TabsTrigger>
                <TabsTrigger value="resources">Study Resources</TabsTrigger>
                <TabsTrigger value="about">About University</TabsTrigger>
              </TabsList>
              
              {/* Branches & Subjects Tab */}
              <TabsContent value="branches" className="w-full">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Branches & Subjects</h2>
                    
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Select Branch</label>
                      <Select 
                        value={selectedBranch} 
                        onValueChange={setSelectedBranch} 
                        defaultValue={university.branches[0]?.id.toString() || "all"}
                      >
                        <SelectTrigger className="w-full md:w-1/3">
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {university.branches.map(branch => (
                            <SelectItem key={branch.id} value={branch.id.toString()}>
                              {branch.name} ({branch.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedBranch !== 'all' && (
                      <div className="mt-8">
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                          <div className="flex items-start">
                            <GraduationCap className="h-6 w-6 text-blue-700 mr-3 mt-1" />
                            <div>
                              <h3 className="text-xl font-semibold text-blue-900">
                                {university.branches.find(b => b.id.toString() === selectedBranch)?.name}
                              </h3>
                              <p className="text-blue-700">
                                Code: {university.branches.find(b => b.id.toString() === selectedBranch)?.code}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Accordion type="single" collapsible className="w-full">
                          {Array.from({ length: 8 }, (_, i) => i + 1).map(semester => {
                            const branch = university.branches.find(b => b.id.toString() === selectedBranch);
                            const subjects = branch?.subjects[semester] || [];
                            
                            return (
                              <AccordionItem key={semester} value={`semester-${semester}`}>
                                <AccordionTrigger className="text-lg hover:no-underline">
                                  <div className="flex items-center">
                                    <Layers className="h-5 w-5 mr-2 text-blue-600" />
                                    <span>Semester {semester}</span>
                                    <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                      {subjects.length} subjects
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {subjects.length > 0 ? (
                                    <div className="rounded-md border overflow-hidden">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Subject Name</TableHead>
                                            <TableHead>Credits</TableHead>
                                            <TableHead className="hidden md:table-cell">Description</TableHead>
                                            <TableHead>Resources</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {subjects.map((subject: BranchSubject) => {
                                            const subjectResources = getResourcesForSubject(subject.name, semester);
                                            const hasPDFs = subjectPDFs[subject.name as keyof typeof subjectPDFs]?.length > 0;
                                            
                                            return (
                                              <TableRow key={subject.id}>
                                                <TableCell className="font-medium">{subject.code}</TableCell>
                                                <TableCell>{subject.name}</TableCell>
                                                <TableCell>{subject.credits}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-xs truncate">
                                                  {subject.description}
                                                </TableCell>
                                                <TableCell>
                                                  <div className="flex gap-2">
                                                    <Button 
                                                      variant="outline" 
                                                      size="sm"
                                                      className="flex items-center"
                                                      onClick={() => {
                                                        setSelectedTab('resources');
                                                        setSelectedSemester(semester.toString());
                                                        setSelectedSubject(subject.name);
                                                      }}
                                                    >
                                                      <Book className="h-4 w-4 mr-1" />
                                                      View
                                                    </Button>
                                                    {hasPDFs && (
                                                      <Button
                                                        variant="default"
                                                        size="sm"
                                                        className="flex items-center"
                                                        onClick={() => {
                                                          const firstPDF = subjectPDFs[subject.name as keyof typeof subjectPDFs][0];
                                                          if (firstPDF) handlePDFView(firstPDF);
                                                        }}
                                                      >
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        PDFs ({subjectPDFs[subject.name as keyof typeof subjectPDFs]?.length || 0})
                                                      </Button>
                                                    )}
                                                  </div>
                                                </TableCell>
                                              </TableRow>
                                            );
                                          })}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  ) : (
                                    <div className="bg-gray-50 p-6 rounded-md">
                                      <div className="flex items-center justify-center flex-col">
                                        <File className="h-10 w-10 text-gray-400 mb-3" />
                                        <h3 className="text-lg font-medium">No subjects available</h3>
                                        <p className="text-gray-500 mt-1 text-center">
                                          Subject data for this semester is not available yet.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Semester Resources Summary */}
                                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <h4 className="font-semibold mb-3 flex items-center">
                                      <Award className="h-5 w-5 mr-2 text-blue-700" />
                                      Semester {semester} Important Resources
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="bg-white p-4 rounded-md shadow-sm border border-blue-100">
                                        <h5 className="font-medium text-blue-800 mb-2">Exam Papers</h5>
                                        <ul className="space-y-2">
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Previous Question Papers</span>
                                          </li>
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Model Answer Papers</span>
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="bg-white p-4 rounded-md shadow-sm border border-blue-100">
                                        <h5 className="font-medium text-blue-800 mb-2">Study Notes</h5>
                                        <ul className="space-y-2">
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Faculty Notes</span>
                                          </li>
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Student Notes</span>
                                          </li>
                                        </ul>
                                      </div>
                                      <div className="bg-white p-4 rounded-md shadow-sm border border-blue-100">
                                        <h5 className="font-medium text-blue-800 mb-2">Syllabus</h5>
                                        <ul className="space-y-2">
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Complete Semester Syllabus</span>
                                          </li>
                                          <li className="flex items-center">
                                            <Download className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="text-sm">Practical Assignments</span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="mt-4 text-center">
                                      <Button
                                        variant="link" 
                                        className="text-blue-600"
                                        onClick={() => {
                                          setSelectedTab('resources');
                                          setSelectedSemester(semester.toString());
                                        }}
                                      >
                                        View All Semester {semester} Resources →
                                      </Button>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            );
                          })}
                        </Accordion>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources" className="w-full">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Study Resources</h2>
                    
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Semester</label>
                        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Semesters" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Semesters</SelectItem>
                            {semesters.map(semester => (
                              <SelectItem key={semester} value={semester.toString()}>
                                Semester {semester}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="All Subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Subjects</SelectItem>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Resources Grid */}
                    {filteredResources.length > 0 ? (
                      <>
                        {/* Display PDF resources if a subject is selected */}
                        {selectedSubject !== 'all' && subjectPDFs[selectedSubject as keyof typeof subjectPDFs] && (
                          <div className="mb-8 bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-bold mb-4 flex items-center">
                              <FileText className="h-5 w-5 text-blue-700 mr-2" />
                              PDF Resources for {selectedSubject}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              {subjectPDFs[selectedSubject as keyof typeof subjectPDFs]?.map((pdf) => (
                                <div 
                                  key={pdf.id}
                                  className="bg-white p-4 rounded-md shadow-sm border border-blue-100 flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded-md">
                                      <FileText className="h-5 w-5 text-blue-700" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{pdf.title}</h4>
                                      <p className="text-sm text-gray-500">{pdf.fileSize}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" onClick={() => handlePDFView(pdf)}>
                                      <FileText className="h-4 w-4 mr-1" />
                                      View
                                    </Button>
                                    <Button size="sm" onClick={() => handlePDFDownload(pdf)}>
                                      <Download className="h-4 w-4 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredResources.map((resource, index) => (
                            <ResourceCard
                              key={resource.id}
                              title={resource.title}
                              type={resource.type}
                              subject={resource.subject}
                              date={resource.uploadDate}
                              views={resource.views}
                              fileSize={resource.fileSize}
                              delay={index}
                            />
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No resources found</h3>
                        <p className="text-gray-500 mb-6">
                          We couldn't find any resources matching your filters for this university.
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedSemester('all');
                            setSelectedSubject('all');
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* About Tab */}
              <TabsContent value="about">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">About {university.name}</h2>
                    
                    <div className="prose max-w-none">
                      <p className="mb-4">
                        {university.name} ({university.shortName}) was established in {university.established} and is located in {university.location}, Maharashtra. 
                        It is one of the premier institutions in the state offering quality education across various disciplines.
                      </p>
                      
                      <p className="mb-4">
                        The university has a rich history of academic excellence and has produced numerous distinguished alumni who have made significant contributions in their respective fields.
                      </p>
                      
                      <p className="mb-4">
                        With state-of-the-art infrastructure and a dedicated faculty, {university.name} continues to be at the forefront of higher education in Maharashtra.
                      </p>
                      
                      <h3 className="text-xl font-bold mt-8 mb-4">Key Facilities</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Modern libraries with extensive collections of books and journals</li>
                        <li>Well-equipped laboratories for scientific research</li>
                        <li>Computer centers with high-speed internet connectivity</li>
                        <li>Sports facilities for overall development of students</li>
                        <li>Hostels and accommodation facilities</li>
                        <li>Career guidance and placement cell</li>
                      </ul>
                      
                      <h3 className="text-xl font-bold mt-8 mb-4">Academic Programs</h3>
                      <p>
                        The university offers a wide range of undergraduate, postgraduate, and doctoral programs across various disciplines including:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        {university.branches.map(branch => (
                          <li key={branch.id}>{branch.name}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      
      {/* PDF Viewer Dialog */}
      {selectedPDF && (
        <PDFViewer
          title={selectedPDF.title}
          pdfUrl={selectedPDF.downloadUrl}
          fileSize={selectedPDF.fileSize}
          isOpen={isPDFViewerOpen}
          onClose={() => {
            setIsPDFViewerOpen(false);
            setSelectedPDF(null);
          }}
          subjectInfo={subjectInformation[selectedSubject as keyof typeof subjectInformation]}
        />
      )}
      
      <Footer />
    </motion.div>
  );
};

export default UniversityPage;
