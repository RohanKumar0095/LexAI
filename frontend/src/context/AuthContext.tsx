import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signupApi,
  loginApi,
  logoutApi,
  getMeApi,
  AuthApiError,
} from '../services/authApi';
import {
  isSupabaseConfigured,
  supabase,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  supabaseGetSession,
} from '../services/supabaseClient';

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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'lexai_access_token';
const USER_KEY = 'lexai_user';
const AUTH_FLAG_KEY = 'lexai_authenticated';
const GUEST_KEY = 'lexai_guest_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load and verify initial session on mount
  useEffect(() => {
    let isMounted = true;
    let authListenerSubscription: { unsubscribe: () => void } | null = null;

    async function restoreSession() {
      // 1. If Supabase is configured, use active Supabase session
      if (isSupabaseConfigured() && supabase) {
        try {
          const session = await supabaseGetSession();
          if (!isMounted) return;

          if (session && session.user) {
            const sbUser = session.user;
            const fullProfile: UserProfile = {
              id: sbUser.id,
              name: (sbUser.user_metadata?.full_name as string) || sbUser.email?.split('@')[0] || 'User',
              email: sbUser.email || '',
              language: 'en',
            };
            setToken(session.access_token);
            setUser(fullProfile);
            setIsAuthenticated(true);
            setIsGuest(false);
            localStorage.removeItem(GUEST_KEY);
            localStorage.setItem(AUTH_FLAG_KEY, 'true');
            localStorage.setItem(TOKEN_KEY, session.access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(fullProfile));
            setIsLoading(false);
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase initial session check error:', sbErr);
        }
      }

      // 2. Fallback to local stored session
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      const storedGuest = localStorage.getItem(GUEST_KEY) === 'true';

      if (!storedToken) {
        if (isMounted) {
          setIsGuest(storedGuest);
          setIsLoading(false);
          setIsAuthenticated(false);
        }
        return;
      }

      try {
        // Verify token with backend
        const serverUser = await getMeApi(storedToken);

        if (!isMounted) return;

        let parsedLocalUser: Partial<UserProfile> = {};
        if (storedUser) {
          try {
            parsedLocalUser = JSON.parse(storedUser);
          } catch {
            // Ignore parse errors on cached profile
          }
        }

        const fullProfile: UserProfile = {
          id: serverUser.id,
          name: serverUser.full_name || parsedLocalUser.name || serverUser.email.split('@')[0],
          email: serverUser.email,
          phone: parsedLocalUser.phone,
          state: parsedLocalUser.state,
          district: parsedLocalUser.district,
          language: parsedLocalUser.language || 'en',
        };

        setToken(storedToken);
        setUser(fullProfile);
        setIsAuthenticated(true);
        setIsGuest(false);
        localStorage.removeItem(GUEST_KEY);
        localStorage.setItem(AUTH_FLAG_KEY, 'true');
        localStorage.setItem(USER_KEY, JSON.stringify(fullProfile));
      } catch (err) {
        console.warn('Session verification failed or token expired:', err);
        if (isMounted) {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setIsGuest(storedGuest);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          localStorage.removeItem(AUTH_FLAG_KEY);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Set up Supabase auth state listener if available
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session && session.user) {
            const sbUser = session.user;
            const fullProfile: UserProfile = {
              id: sbUser.id,
              name: (sbUser.user_metadata?.full_name as string) || sbUser.email?.split('@')[0] || 'User',
              email: sbUser.email || '',
              language: 'en',
            };
            setToken(session.access_token);
            setUser(fullProfile);
            setIsAuthenticated(true);
            setIsGuest(false);
            localStorage.removeItem(GUEST_KEY);
            localStorage.setItem(AUTH_FLAG_KEY, 'true');
            localStorage.setItem(TOKEN_KEY, session.access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(fullProfile));
          }
        } else if (event === 'SIGNED_OUT') {
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(AUTH_FLAG_KEY);
          localStorage.removeItem(USER_KEY);
        }
      });
      authListenerSubscription = data.subscription;
    }

    restoreSession();

    return () => {
      isMounted = false;
      authListenerSubscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      try {
        const { user: sbUser, session } = await supabaseSignIn(email, password);
        if (session && sbUser) {
          const profile: UserProfile = {
            id: sbUser.id,
            name: (sbUser.user_metadata?.full_name as string) || sbUser.email?.split('@')[0] || 'User',
            email: sbUser.email || email,
            language: 'en',
          };
          setToken(session.access_token);
          setUser(profile);
          setIsAuthenticated(true);
          setIsGuest(false);
          localStorage.removeItem(GUEST_KEY);
          localStorage.setItem(TOKEN_KEY, session.access_token);
          localStorage.setItem(AUTH_FLAG_KEY, 'true');
          localStorage.setItem(USER_KEY, JSON.stringify(profile));
          return true;
        } else if (sbUser && !session) {
          throw new AuthApiError('Please verify your email address before logging in.', 401);
        }
        return false;
      } catch (err: unknown) {
        if (err instanceof AuthApiError) throw err;
        const msg = err instanceof Error ? err.message : 'Login failed';
        throw new AuthApiError(msg, 401);
      }
    }

    const authData = await loginApi(email, password);

    const storedUser = localStorage.getItem(USER_KEY);
    let parsedLocalUser: Partial<UserProfile> = {};
    if (storedUser) {
      try {
        parsedLocalUser = JSON.parse(storedUser);
      } catch {
        // Ignore
      }
    }

    const profile: UserProfile = {
      id: authData.user.id,
      name: authData.user.full_name || parsedLocalUser.name || authData.user.email.split('@')[0],
      email: authData.user.email,
      phone: parsedLocalUser.phone,
      state: parsedLocalUser.state || 'Maharashtra',
      district: parsedLocalUser.district || 'Mumbai',
      language: parsedLocalUser.language || 'en',
    };

    setToken(authData.access_token);
    setUser(profile);
    setIsAuthenticated(true);
    setIsGuest(false);

    localStorage.removeItem(GUEST_KEY);
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem(AUTH_FLAG_KEY, 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(profile));

    return true;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    if (isSupabaseConfigured()) {
      try {
        const { user: sbUser, session } = await supabaseSignUp(data.email, data.password, data.name);
        if (session && sbUser) {
          const newUser: UserProfile = {
            id: sbUser.id,
            name: (sbUser.user_metadata?.full_name as string) || data.name || sbUser.email?.split('@')[0] || 'User',
            email: sbUser.email || data.email,
            phone: data.phone,
            language: 'en',
          };
          setToken(session.access_token);
          setUser(newUser);
          setIsAuthenticated(true);
          setIsGuest(false);
          localStorage.removeItem(GUEST_KEY);
          localStorage.setItem(TOKEN_KEY, session.access_token);
          localStorage.setItem(AUTH_FLAG_KEY, 'true');
          localStorage.setItem(USER_KEY, JSON.stringify(newUser));
          return true;
        } else if (sbUser && !session) {
          // Email confirmation is required by Supabase project settings
          throw new AuthApiError('Account created! Please check your email to confirm your registration before logging in.', 200);
        }
        return false;
      } catch (err: unknown) {
        if (err instanceof AuthApiError) throw err;
        const msg = err instanceof Error ? err.message : 'Signup failed';
        throw new AuthApiError(msg, 400);
      }
    }

    const authData = await signupApi(data.email, data.password, data.name);

    const newUser: UserProfile = {
      id: authData.user.id,
      name: authData.user.full_name || data.name || data.email.split('@')[0],
      email: authData.user.email,
      phone: data.phone,
      language: 'en',
    };

    setToken(authData.access_token);
    setUser(newUser);
    setIsAuthenticated(true);
    setIsGuest(false);

    localStorage.removeItem(GUEST_KEY);
    localStorage.setItem(TOKEN_KEY, authData.access_token);
    localStorage.setItem(AUTH_FLAG_KEY, 'true');
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return true;
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.setItem(GUEST_KEY, 'true');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const logout = () => {
    if (isSupabaseConfigured()) {
      supabaseSignOut().catch(() => {});
    }

    const currentToken = token || localStorage.getItem(TOKEN_KEY);
    if (currentToken && !isSupabaseConfigured()) {
      logoutApi(currentToken).catch(() => {});
    }

    setToken(null);
    setIsAuthenticated(false);
    setIsGuest(false);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_FLAG_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(GUEST_KEY);
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      ...profileUpdates,
    };

    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isGuest,
        isLoading,
        persona: 'citizen',
        user,
        token,
        login,
        signup,
        logout,
        continueAsGuest,
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

export { AuthApiError };
