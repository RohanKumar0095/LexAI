import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  state?: string;
  district?: string;
  language?: 'en' | 'hi';
}

interface AuthContextType {
  isAuthenticated: boolean;
  persona: 'citizen';
  user: UserProfile | null;
  login: (email: string) => Promise<boolean>;
  signup: (profile: Omit<UserProfile, 'state' | 'district' | 'language'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profileUpdates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load initial session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('lexai_authenticated');
    const storedUser = localStorage.getItem('lexai_user');
    
    if (storedAuth === 'true' && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user info', e);
        localStorage.removeItem('lexai_authenticated');
        localStorage.removeItem('lexai_user');
      }
    }
  }, []);

  const login = async (email: string): Promise<boolean> => {
    // Mock login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Check if we have a registered user matching this email in localStorage (as a demo register flow helper)
    const registeredUsersStr = localStorage.getItem('lexai_registered_users');
    let profile: UserProfile = {
      name: 'Rohan Kumar',
      email: email,
      phone: '+91 98765 43210',
      state: 'Maharashtra',
      district: 'Mumbai',
      language: 'en'
    };

    if (registeredUsersStr) {
      try {
        const users: Record<string, UserProfile> = JSON.parse(registeredUsersStr);
        if (users[email.toLowerCase()]) {
          profile = users[email.toLowerCase()];
        }
      } catch (e) {
        console.error('Error parsing registered users database placeholder', e);
      }
    }

    setUser(profile);
    setIsAuthenticated(true);
    localStorage.setItem('lexai_authenticated', 'true');
    localStorage.setItem('lexai_user', JSON.stringify(profile));
    return true;
  };

  const signup = async (profile: Omit<UserProfile, 'state' | 'district' | 'language'>): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      ...profile,
      language: 'en', // Default language
    };

    // Save user profile in state (for onboarding flow completion)
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('lexai_authenticated', 'true');
    localStorage.setItem('lexai_user', JSON.stringify(newUser));

    // Keep track of registered users locally to let them sign back in during the demo
    const registeredUsersStr = localStorage.getItem('lexai_registered_users') || '{}';
    try {
      const users = JSON.parse(registeredUsersStr);
      users[profile.email.toLowerCase()] = newUser;
      localStorage.setItem('lexai_registered_users', JSON.stringify(users));
    } catch (e) {
      console.error('Failed to update registered users database placeholder', e);
    }

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('lexai_authenticated');
    localStorage.removeItem('lexai_user');
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...profileUpdates,
    };
    setUser(updatedUser);
    localStorage.setItem('lexai_user', JSON.stringify(updatedUser));

    // Update registered user catalog as well
    const registeredUsersStr = localStorage.getItem('lexai_registered_users');
    if (registeredUsersStr) {
      try {
        const users = JSON.parse(registeredUsersStr);
        if (users[updatedUser.email.toLowerCase()]) {
          users[updatedUser.email.toLowerCase()] = updatedUser;
          localStorage.setItem('lexai_registered_users', JSON.stringify(users));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        persona: 'citizen',
        user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
