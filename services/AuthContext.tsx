// services/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { account } from './appwrite';
import { getCurrentUser } from './auth';
import { Models } from 'appwrite';

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<Models.User<Models.Preferences> | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser(); // Call on mount
  }, []);

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
