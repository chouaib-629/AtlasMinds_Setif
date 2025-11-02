'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService, Admin, LoginCredentials } from '@/lib/api';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('admin_token');
      if (savedToken) {
        setToken(savedToken);
      }
    }
  }, []);

  // Load admin profile when token exists
  useEffect(() => {
    const loadAdmin = async () => {
      if (token) {
        try {
          const response = await apiService.getAdminProfile();
          if (response.success && response.data) {
            setAdmin(response.data.admin);
          } else {
            // Token might be invalid, clear it
            localStorage.removeItem('admin_token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('admin_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadAdmin();
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await apiService.adminLogin(credentials);
      if (response.success && response.data) {
        const { admin: adminData, token: newToken } = response.data;
        setAdmin(adminData);
        setToken(newToken);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', newToken);
        }
        return { success: true };
      }
      return {
        success: false,
        message: response.message || 'Login failed',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiService.adminLogout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    if (!token) return;
    try {
      const response = await apiService.getAdminProfile();
      if (response.success && response.data) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error('Error refreshing admin:', error);
    }
  }, [token]);

  const value: AuthContextType = {
    admin,
    token,
    isLoading,
    isAuthenticated: !!admin && !!token,
    isSuperAdmin: admin?.is_super_admin ?? false,
    login,
    logout,
    refreshAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

