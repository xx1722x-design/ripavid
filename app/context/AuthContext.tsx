'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  uid?: string;
  email?: string;
  name?: string;
  avatar?: string;
  tier: 'free' | 'starter' | 'pro' | 'max';
  createdAt?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    refreshUser();
  }, []);

  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Set user as guest with free tier access
        setUser({
          tier: 'free',
          isGuest: true,
        });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      // Set user as guest with free tier access
      setUser({
        tier: 'free',
        isGuest: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    // Login is handled by Google OAuth callback
    await refreshUser();
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      // Keep guest user after logout
      setUser({
        tier: 'free',
        isGuest: true,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: user?.isGuest || false,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
