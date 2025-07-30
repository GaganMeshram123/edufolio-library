import React, { useState } from 'react';
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
import { Upload, University, BookOpen, FileText, Image, Users } from 'lucide-react';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  // Check if user is admin (you can implement role-based auth)
  const isAdmin = user?.email === 'admin@college.com'; // Replace with proper role check

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

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
      const { error } = await (supabase as any)
        .from('subjects')
        .insert([subjectForm]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject added successfully",
      });

      setSubjectForm({ name: '', description: '', branch_id: '', semester: 1, credits: 3 });
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
        const bucket = resourceForm.type === 'pdf' ? 'pdfs' : 'images';
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
                    <Input
                      id="branch-university"
                      placeholder="University ID"
                      value={branchForm.university_id}
                      onChange={(e) => setBranchForm({ ...branchForm, university_id: e.target.value })}
                      required
                    />
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
                      <Label htmlFor="subject-branch">Branch ID</Label>
                      <Input
                        id="subject-branch"
                        placeholder="Branch ID"
                        value={subjectForm.branch_id}
                        onChange={(e) => setSubjectForm({ ...subjectForm, branch_id: e.target.value })}
                        required
                      />
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
                        <SelectContent>
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
                  <Button type="submit" disabled={loading}>
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
                      <Label htmlFor="resource-subject">Subject ID</Label>
                      <Input
                        id="resource-subject"
                        placeholder="Subject ID"
                        value={resourceForm.subject_id}
                        onChange={(e) => setResourceForm({ ...resourceForm, subject_id: e.target.value })}
                        required
                      />
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
                      <SelectContent>
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