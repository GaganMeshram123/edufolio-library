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
  university?: string; // Optional university association
}

export interface University {
  id: number;
  name: string;
  shortName: string;
  location: string;
  established: number;
  imageUrl: string;
  resourceCount: number;
  description: string;
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
    university?: string;
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
        university: "University of Mumbai",
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
        university: "Pune University",
      },
      {
        id: 3,
        title: "Advanced Mathematics for Engineering",
        type: "notes",
        subject: "Mathematics",
        semester: 2,
        uploadDate: "2023-04-20",
        views: 542,
        fileSize: "3.5 MB",
        downloadUrl: "/files/advanced-mathematics.pdf",
        university: "SNDT Women's University",
      },
      {
        id: 4,
        title: "Computer Networks Previous Year Paper",
        type: "paper",
        subject: "Computer Science",
        semester: 5,
        uploadDate: "2023-06-05",
        views: 328,
        fileSize: "2.1 MB",
        downloadUrl: "/files/computer-networks-paper.pdf",
        university: "Dr. Babasaheb Ambedkar Technological University",
      },
      {
        id: 5,
        title: "Mechanical Engineering Handbook",
        type: "book",
        subject: "Mechanical",
        semester: 4,
        uploadDate: "2023-03-25",
        views: 687,
        fileSize: "8.7 MB",
        downloadUrl: "/files/mechanical-handbook.pdf",
        university: "Shivaji University",
      },
      {
        id: 6,
        title: "Operating Systems Semester Notes",
        type: "notes",
        subject: "Computer Science",
        semester: 4,
        uploadDate: "2023-04-12",
        views: 753,
        fileSize: "4.8 MB",
        downloadUrl: "/files/operating-systems-notes.pdf",
        university: "University of Mumbai",
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
      
      if (filters.university) {
        resources = resources.filter(r => 
          r.university === filters.university
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

// Universities API
export const universitiesAPI = {
  // Get all universities in Maharashtra
  async getUniversities(): Promise<University[]> {
    await delay(800); // Simulate network request
    
    return [
      {
        id: 1,
        name: "University of Mumbai",
        shortName: "MU",
        location: "Mumbai",
        established: 1857,
        imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 458,
        description: "One of the oldest and premier universities in India, offering a wide range of courses across various disciplines."
      },
      {
        id: 2,
        name: "Savitribai Phule Pune University",
        shortName: "SPPU",
        location: "Pune",
        established: 1949,
        imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 392,
        description: "Formerly known as University of Pune, it is a collegiate public state university located in Pune, Maharashtra."
      },
      {
        id: 3,
        name: "Shivaji University",
        shortName: "SUK",
        location: "Kolhapur",
        established: 1962,
        imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 276,
        description: "Named after the great Maratha warrior and king Chhatrapati Shivaji Maharaj, established to serve the southern parts of Maharashtra."
      },
      {
        id: 4,
        name: "Dr. Babasaheb Ambedkar Technological University",
        shortName: "DBATU",
        location: "Lonere",
        established: 1989,
        imageUrl: "https://images.unsplash.com/photo-1592066575526-a436aa8f882d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 185,
        description: "A specialized technological university offering various engineering and technical courses in Maharashtra."
      },
      {
        id: 5,
        name: "SNDT Women's University",
        shortName: "SNDTWU",
        location: "Mumbai",
        established: 1916,
        imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 214,
        description: "First women's university in India and South-East Asia, founded by Maharshi Dhondo Keshav Karve."
      },
      {
        id: 6,
        name: "Rashtrasant Tukadoji Maharaj Nagpur University",
        shortName: "RTMNU",
        location: "Nagpur",
        established: 1923,
        imageUrl: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 245,
        description: "One of the oldest universities in Maharashtra serving the Vidarbha region with numerous affiliated colleges."
      },
      {
        id: 7,
        name: "Dr. Babasaheb Ambedkar Marathwada University",
        shortName: "BAMU",
        location: "Aurangabad",
        established: 1958,
        imageUrl: "https://images.unsplash.com/photo-1565034946487-077786996e27?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 198,
        description: "Named after Dr. Babasaheb Ambedkar, serving the Marathwada region of Maharashtra."
      },
      {
        id: 8,
        name: "Swami Ramanand Teerth Marathwada University",
        shortName: "SRTMU",
        location: "Nanded",
        established: 1994,
        imageUrl: "https://images.unsplash.com/photo-1544376798-76a74d934f86?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
        resourceCount: 157,
        description: "A teaching and affiliating university serving the southern part of Marathwada region in Maharashtra."
      }
    ];
  },
  
  // Get a single university by ID
  async getUniversityById(id: number): Promise<University | null> {
    const universities = await this.getUniversities();
    return universities.find(university => university.id === id) || null;
  },
  
  // Get resources for a specific university
  async getUniversityResources(universityName: string): Promise<Resource[]> {
    return resourcesAPI.getResources({ university: universityName });
  }
};
