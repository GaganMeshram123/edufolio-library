import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, University, BookOpen, FileText, Image, Users, Trash2, Download } from 'lucide-react';

const AdminPage = () => {
  const { isAdminAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [resources, setResources] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  // University form state
  const [universityForm, setUniversityForm] = useState({
    name: '',
    description: '',
    location: '',
    website: '',
    image_url: ''
  });

  // Branch form state
  const [branchForm, setBranchForm] = useState({
    name: '',
    description: '',
    university_id: ''
  });

  // Subject form state
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    description: '',
    branch_id: '',
    semester: 1,
    credits: 3
  });

  // Resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    subject_id: '',
    type: 'pdf',
    file_url: ''
  });

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    fetchData();
  }, [selectedSemester]);

  const fetchData = async () => {
    try {
      // Fetch universities
      const { data: universitiesData } = await (supabase as any)
        .from('universities')
        .select('*');
      setUniversities(universitiesData || []);

      // Fetch branches
      const { data: branchesData } = await (supabase as any)
        .from('branches')
        .select('*');
      setBranches(branchesData || []);

      // Fetch subjects for selected semester
      const { data: subjectsData } = await (supabase as any)
        .from('subjects')
        .select('*')
        .eq('semester', selectedSemester);
      setSubjects(subjectsData || []);

      // Fetch resources for selected semester subjects
      if (subjectsData && subjectsData.length > 0) {
        const subjectIds = subjectsData.map((s: any) => s.id);
        const { data: resourcesData } = await (supabase as any)
          .from('resources')
          .select('*, subjects(name, semester)')
          .in('subject_id', subjectIds);
        setResources(resourcesData || []);
      } else {
        setResources([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileUpload = async (file: File, bucket: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await (supabase as any).storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = (supabase as any).storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleDeleteResource = async (resourceId: string, fileUrl: string) => {
    try {
      setLoading(true);
      
      // Delete from database
      const { error } = await (supabase as any)
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      // Try to delete file from storage
      if (fileUrl) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          const bucket = fileUrl.includes('pdfs') ? 'pdfs' : 'university-images';
          await (supabase as any).storage
            .from(bucket)
            .remove([fileName]);
        }
      }

      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });

      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resource",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUniversitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = universityForm.image_url;

      if (uploadFile) {
        imageUrl = await handleFileUpload(uploadFile, 'university-images');
      }

      const { error } = await (supabase as any)
        .from('universities')
        .insert([{ ...universityForm, image_url: imageUrl }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "University added successfully",
      });

      setUniversityForm({ name: '', description: '', location: '', website: '', image_url: '' });
      setUploadFile(null);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add university",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBranchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await (supabase as any)
        .from('branches')
        .insert([branchForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Branch added successfully",
      });

      setBranchForm({ name: '', description: '', university_id: '' });
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add branch",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, insert the subject
      const { data: subjectData, error: subjectError } = await (supabase as any)
        .from('subjects')
        .insert([subjectForm])
        .select();

      if (subjectError) throw subjectError;

      // If there's a file and we have the subject data, create a resource
      if (uploadFile && subjectData && subjectData.length > 0) {
        try {
          const bucket = uploadFile.type.includes('pdf') ? 'pdfs' : 'university-images';
          const fileUrl = await handleFileUpload(uploadFile, bucket);
          
          const resourceData = {
            title: `${subjectForm.name} Course Material`,
            description: `Course material for ${subjectForm.name}`,
            subject_id: subjectData[0].id,
            type: uploadFile.type.includes('pdf') ? 'pdf' : 'document',
            file_url: fileUrl
          };

          await (supabase as any)
            .from('resources')
            .insert([resourceData]);
        } catch (fileError) {
          console.error('File upload failed:', fileError);
          // Continue anyway since subject was created
        }
      }

      toast({
        title: "Success",
        description: "Subject added successfully" + (uploadFile ? " with course material" : ""),
      });

      setSubjectForm({ name: '', description: '', branch_id: '', semester: 1, credits: 3 });
      setUploadFile(null);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add subject",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileUrl = resourceForm.file_url;

      if (uploadFile) {
        const bucket = resourceForm.type === 'pdf' ? 'pdfs' : 'university-images';
        fileUrl = await handleFileUpload(uploadFile, bucket);
      }

      const { error } = await (supabase as any)
        .from('resources')
        .insert([{ ...resourceForm, file_url: fileUrl }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully",
      });

      setResourceForm({ title: '', description: '', subject_id: '', type: 'pdf', file_url: '' });
      setUploadFile(null);
      fetchData();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add resource",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage universities, branches, subjects, and resources</p>
        </div>

        {/* Semester Dashboard */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Semester Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[1,2,3,4,5,6,7,8].map(sem => (
                <Button
                  key={sem}
                  variant={selectedSemester === sem ? "default" : "outline"}
                  onClick={() => setSelectedSemester(sem)}
                  className="min-w-[100px]"
                >
                  Semester {sem}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Subjects</h3>
                <p className="text-2xl font-bold text-primary">{subjects.length}</p>
              </div>
              <div className="bg-secondary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Resources</h3>
                <p className="text-2xl font-bold text-secondary-foreground">{resources.length}</p>
              </div>
              <div className="bg-accent/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Universities</h3>
                <p className="text-2xl font-bold text-accent-foreground">{universities.length}</p>
              </div>
            </div>

            {/* Resources for Selected Semester */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Resources for Semester {selectedSemester}</h3>
              <div className="grid gap-4">
                {resources.map((resource: any) => (
                  <div key={resource.id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <p className="text-xs text-muted-foreground">Type: {resource.type}</p>
                    </div>
                    <div className="flex gap-2">
                      {resource.file_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resource.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteResource(resource.id, resource.file_url)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {resources.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No resources found for Semester {selectedSemester}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="universities" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="universities" className="flex items-center gap-2">
              <University className="h-4 w-4" />
              Universities
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Branches
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="universities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <University className="h-5 w-5" />
                  Add University
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUniversitySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="university-name">University Name</Label>
                      <Input
                        id="university-name"
                        value={universityForm.name}
                        onChange={(e) => setUniversityForm({ ...universityForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="university-location">Location</Label>
                      <Input
                        id="university-location"
                        value={universityForm.location}
                        onChange={(e) => setUniversityForm({ ...universityForm, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="university-description">Description</Label>
                    <Textarea
                      id="university-description"
                      value={universityForm.description}
                      onChange={(e) => setUniversityForm({ ...universityForm, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="university-website">Website</Label>
                    <Input
                      id="university-website"
                      type="url"
                      value={universityForm.website}
                      onChange={(e) => setUniversityForm({ ...universityForm, website: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="university-image">University Image</Label>
                    <Input
                      id="university-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add University'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Add Branch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBranchSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="branch-university">University</Label>
                    <Select
                      value={branchForm.university_id}
                      onValueChange={(value) => setBranchForm({ ...branchForm, university_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select University" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        {universities.map((uni: any) => (
                          <SelectItem key={uni.id} value={uni.id} className="cursor-pointer hover:bg-accent">{uni.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="branch-name">Branch Name</Label>
                    <Input
                      id="branch-name"
                      value={branchForm.name}
                      onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch-description">Description</Label>
                    <Textarea
                      id="branch-description"
                      value={branchForm.description}
                      onChange={(e) => setBranchForm({ ...branchForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Branch'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Add Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject-branch">Branch</Label>
                      <Select
                        value={subjectForm.branch_id}
                        onValueChange={(value) => setSubjectForm({ ...subjectForm, branch_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border max-h-60 overflow-y-auto">
                          {branches.map((branch: any) => (
                            <SelectItem key={branch.id} value={branch.id} className="cursor-pointer hover:bg-accent">
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input
                        id="subject-name"
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="subject-semester">Semester</Label>
                      <Select 
                        value={subjectForm.semester.toString()} 
                        onValueChange={(value) => setSubjectForm({ ...subjectForm, semester: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border">
                          {[1,2,3,4,5,6,7,8].map(sem => (
                            <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject-credits">Credits</Label>
                      <Input
                        id="subject-credits"
                        type="number"
                        value={subjectForm.credits}
                        onChange={(e) => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject-description">Description</Label>
                    <Textarea
                      id="subject-description"
                      value={subjectForm.description}
                      onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject-file">Upload Course Material (PDF, Images, etc.)</Label>
                    <Input
                      id="subject-file"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                    {uploadFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {uploadFile.name}
                      </p>
                    )}
                  </div>
                  <Button type="submit" disabled={loading || !subjectForm.branch_id || !subjectForm.name}>
                    {loading ? 'Adding...' : 'Add Subject'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Add Resource
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResourceSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="resource-subject">Subject</Label>
                      <Select
                        value={resourceForm.subject_id}
                        onValueChange={(value) => setResourceForm({ ...resourceForm, subject_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border max-h-60 overflow-y-auto">
                          {subjects.map((subject: any) => (
                            <SelectItem key={subject.id} value={subject.id} className="cursor-pointer hover:bg-accent">{subject.name} (Sem {subject.semester})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="resource-title">Resource Title</Label>
                      <Input
                        id="resource-title"
                        value={resourceForm.title}
                        onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="resource-type">Resource Type</Label>
                    <Select 
                      value={resourceForm.type} 
                      onValueChange={(value: 'pdf' | 'image' | 'video' | 'document') => setResourceForm({ ...resourceForm, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="resource-description">Description</Label>
                    <Textarea
                      id="resource-description"
                      value={resourceForm.description}
                      onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resource-file">Upload File</Label>
                    <Input
                      id="resource-file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Resource'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPage;