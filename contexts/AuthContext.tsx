import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyCode: (code: string) => Promise<void>;
  sendVerificationCode: (email: string, phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing token on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
    }
  };

  const signIn = async (token: string) => {
    try {
      await AsyncStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const sendVerificationCode = async (email: string, phoneNumber: string) => {
    try {
      // TODO: Implement API call to send verification code
      // This should be replaced with your actual API call
      console.log('Sending verification code to:', email, phoneNumber);
    } catch (error) {
      console.error('Error sending verification code:', error);
      throw error;
    }
  };

  const verifyCode = async (code: string) => {
    try {
      // TODO: Implement API call to verify code
      // This should be replaced with your actual API call
      console.log('Verifying code:', code);
      // For now, we'll just simulate a successful verification
      await signIn('dummy-token');
    } catch (error) {
      console.error('Error verifying code:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        signIn, 
        signOut, 
        verifyCode,
        sendVerificationCode 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 