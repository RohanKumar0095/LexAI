/**
 * Supabase Client Configuration for LexAI India
 * Provides initialized Supabase client and authentication helpers.
 * Never expose service_role keys here; only the public anon key is used.
 */
import { createClient, type SupabaseClient, type Session, type User } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Checks if Supabase credentials are provided in the environment
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim() !== '' &&
    supabaseAnonKey.trim() !== '' &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-key-here')
  );
}

/**
 * Singleton Supabase client instance (or null if not configured)
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export interface SupabaseAuthResult {
  session: Session | null;
  user: User | null;
  error?: string | null;
}

/**
 * Sign up a user with email, password and optional display name
 */
export async function supabaseSignUp(
  email: string,
  password: string,
  fullName?: string
): Promise<{ user: User | null; session: Session | null; error?: string }> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || email.split('@')[0],
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign in a user with email and password
 */
export async function supabaseSignIn(
  email: string,
  password: string
): Promise<{ user: User | null; session: Session | null; error?: string }> {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
  };
}

/**
 * Sign out the currently authenticated user
 */
export async function supabaseSignOut(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.warn('Supabase sign out error:', error.message);
  }
}

/**
 * Retrieve the active Supabase session
 */
export async function supabaseGetSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.warn('Error fetching Supabase session:', error.message);
    return null;
  }
  return data.session;
}
