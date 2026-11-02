import { createContext } from 'react';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  state?: string;
  district?: string;
  language?: 'en' | 'hi';
}

export interface SignupData {
  name?: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  persona: 'citizen';
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (profileUpdates: Partial<UserProfile>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
