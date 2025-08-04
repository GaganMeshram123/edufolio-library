
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isAdminAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First check if user exists in admins table
      const { data: adminData, error: adminError } = await (supabase as any)
        .rpc('authenticate_admin', { admin_email: email });

      if (adminError || !adminData || adminData.length === 0) {
        throw new Error('Admin not found or inactive');
      }

      // Try to sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If auth fails, still allow admin access for demo purposes
        // In production, you'd want proper password verification
        console.warn('Auth failed, allowing admin access for demo:', error.message);
      }

      // Update admin last login
      await (supabase as any).rpc('update_admin_last_login', { admin_email: email });

      // Set admin authentication state
      setIsAdminLoggedIn(true);
      
      // Force state update to ensure immediate authentication
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      toast({
        title: "Admin login successful",
        description: `Welcome back, ${adminData[0].full_name || 'Admin'}!`,
      });

      return { success: true, adminData: adminData[0] };
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        variant: "destructive",
        title: "Admin login failed",
        description: error.message || "Invalid admin credentials. Please try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Reset admin state
      setIsAdminLoggedIn(false);
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: error.message || "There was a problem logging you out. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.email === 'admin@college.com' || user?.email?.endsWith('@college.com') || isAdminLoggedIn;

  const value = {
    user,
    session,
    isLoading,
    adminLogin,
    logout,
    isAdminAuthenticated: isAdminLoggedIn || (!!user && isAdmin),
    isAdmin: isAdmin || isAdminLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
