
// This file contains the API utilities for the application
// In a production app, this would connect to a real backend

// Simulating API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Types for our API responses
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Resource {
  id: number;
  title: string;
  type: 'notes' | 'paper' | 'book';
  subject: string;
  semester: number;
  uploadDate: string;
  views: number;
  fileSize: string;
  downloadUrl: string;
}

// Authentication API
export const authAPI = {
  // Sign up a new user
  async signup(name: string, email: string, password: string): Promise<User> {
    await delay(1000); // Simulate network request
    
    // In a real app, this would be a POST request to your backend
    console.log('Signup:', { name, email, password });
    
    // Return a mock user
    return {
      id: Math.random().toString(36).substring(2, 15),
      name,
      email,
      role: 'user',
    };
  },
  
  // Login an existing user
  async login(email: string, password: string): Promise<User> {
    await delay(1000); // Simulate network request
    
    // In a real app, this would validate credentials with your backend
    console.log('Login:', { email, password });
    
    // For demo purposes, we're just checking if the email has "admin"
    const isAdmin = email.includes('admin');
    
    return {
      id: Math.random().toString(36).substring(2, 15),
      name: email.split('@')[0],
      email,
      role: isAdmin ? 'admin' : 'user',
    };
  },
  
  // Log out the current user
  async logout(): Promise<void> {
    await delay(500); // Simulate network request
    console.log('User logged out');
    localStorage.removeItem('user');
  },
  
  // Get the current user
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson) as User;
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
      return null;
    }
  },
  
  // Save the user to localStorage
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },
};

// Resources API
export const resourcesAPI = {
  // Get all resources with optional filters
  async getResources(filters?: {
    search?: string;
    subjects?: string[];
    types?: string[];
    semesters?: number[];
  }): Promise<Resource[]> {
    await delay(800); // Simulate network request
    
    // In a real app, this would be a GET request to your backend
    console.log('Getting resources with filters:', filters);
    
    // Mock resources data
    let resources: Resource[] = [
      {
        id: 1,
        title: "Digital Electronics Complete Notes",
        type: "notes",
        subject: "Electronics",
        semester: 3,
        uploadDate: "2023-05-15",
        views: 342,
        fileSize: "4.2 MB",
        downloadUrl: "/files/digital-electronics-notes.pdf",
      },
      {
        id: 2,
        title: "Data Structures Final Exam Question Paper 2023",
        type: "paper",
        subject: "Computer Science",
        semester: 3,
        uploadDate: "2023-05-01",
        views: 821,
        fileSize: "1.8 MB",
        downloadUrl: "/files/data-structures-exam.pdf",
      },
      // Add more mock resources here...
    ];
    
    // Apply filters if provided
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        resources = resources.filter(r => 
          r.title.toLowerCase().includes(searchLower) || 
          r.subject.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.subjects && filters.subjects.length > 0) {
        resources = resources.filter(r => 
          filters.subjects!.includes(r.subject)
        );
      }
      
      if (filters.types && filters.types.length > 0) {
        resources = resources.filter(r => 
          filters.types!.includes(r.type)
        );
      }
      
      if (filters.semesters && filters.semesters.length > 0) {
        resources = resources.filter(r => 
          filters.semesters!.includes(r.semester)
        );
      }
    }
    
    return resources;
  },
  
  // Get a single resource by ID
  async getResourceById(id: number): Promise<Resource | null> {
    await delay(500); // Simulate network request
    
    // In a real app, this would be a GET request to your backend
    console.log('Getting resource with ID:', id);
    
    // Mock data - in a real app, you'd fetch this from your API
    return {
      id: id,
      title: "Example Resource",
      type: "notes",
      subject: "Computer Science",
      semester: 3,
      uploadDate: "2023-05-15",
      views: 342,
      fileSize: "4.2 MB",
      downloadUrl: "/files/example-resource.pdf",
    };
  },
  
  // Get resources by semester
  async getResourcesBySemester(semester: number): Promise<Resource[]> {
    await delay(800); // Simulate network request
    
    // In a real app, this would be a GET request to your backend
    console.log('Getting resources for semester:', semester);
    
    // Return mock filtered data
    return this.getResources({ semesters: [semester] });
  },
};

// About & Content API
export const contentAPI = {
  // Get team members
  async getTeamMembers(): Promise<any[]> {
    await delay(600); // Simulate network request
    
    return [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        role: "Founder & Academic Lead",
        bio: "PhD in Computer Science with 15 years of teaching experience.",
        imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      },
      {
        id: 2,
        name: "Michael Chen",
        role: "Technical Director",
        bio: "MSc in Software Engineering and former senior developer at Google.",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
      },
      // Add more team members here...
    ];
  },
  
  // Send a contact form message
  async sendContactMessage(name: string, email: string, message: string): Promise<boolean> {
    await delay(1200); // Simulate network request
    
    // In a real app, this would be a POST request to your backend
    console.log('Contact form submission:', { name, email, message });
    
    // Return success
    return true;
  },
};
