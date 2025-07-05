// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in cookies
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
          ?.split('=')[1];

        if (token) {
          // TODO: Verify token with backend
          // For now, we'll just set a mock user
          setUser({ id: '1', username: 'Admin', email: 'admin@example.com' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return false;
      }

      const data = await response.json();
      
      // Extract user info from JWT token or use the response data
      const userData = { 
        id: '1', // This should come from token decode or API response
        username: email.split('@')[0], // Use email prefix as username for now
        email 
      };
      
      setUser(userData);
      
      // Set token in cookie that expires in 1 day
      document.cookie = `auth-token=${data.access_token}; path=/; max-age=${60 * 60 * 24}`;
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    // Remove the auth token
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user,
        loading 
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};