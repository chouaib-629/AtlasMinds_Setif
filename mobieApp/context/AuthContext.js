import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const storedUser = await AsyncStorage.getItem('user');

      if (token && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
        
        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          if (response.success) {
            setUser(response.data.user);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          // Token invalid, clear storage
          await logout();
        }
      }
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        const { user, token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  const register = async (registerData) => {
    try {
      const response = await authAPI.register(registerData);
      if (response.success) {
        const { user, token } = response.data;
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message || 'Registration failed', errors: response.errors };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      const errors = error.response?.data?.errors;
      return { success: false, message, errors };
    }
  };

  const logout = async () => {
    try {
      // Clear local state first
      setUser(null);
      setIsAuthenticated(false);
      
      // Try to call logout API
      try {
        await authAPI.logout();
      } catch (apiError) {
        // Even if API fails, continue with local cleanup
      }
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      // Ensure cleanup even on error
      setUser(null);
      setIsAuthenticated(false);
      try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
      } catch (storageError) {
        // Silent error handling
      }
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return { success: response.success, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send password reset email. Please try again.';
      return { success: false, message };
    }
  };

  const resetPassword = async (email, token, password, passwordConfirmation) => {
    try {
      const response = await authAPI.resetPassword(email, token, password, passwordConfirmation);
      return { success: response.success, message: response.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. Please try again.';
      const errors = error.response?.data?.errors;
      return { success: false, message, errors };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

