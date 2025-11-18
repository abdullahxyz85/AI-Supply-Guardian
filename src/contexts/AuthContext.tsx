import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { User as SupabaseUser, Session, AuthError } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import authTokenManager from "../lib/authTokenManager";
import { syncUserToSupabase } from "../lib/userSync";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8050';

interface GoogleUser {
  user_id: string;
  email: string;
  name: string;
  picture: string;
}

type User = SupabaseUser | GoogleUser | null;

export interface AuthContextType {
  user: User;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // For Google Sign-In loading state
  authProvider: 'supabase' | 'google' | null;
  accessToken: string | null;
  refreshToken: string | null;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: AuthError | null }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>; // Updated function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authProvider, setAuthProvider] = useState<'supabase' | 'google' | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const syncTriggered = useRef(false); // The gate to ensure the sync happens only once.

  useEffect(() => {
    // 1. Handle the redirect from Google OAuth. This runs only once on initial load.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success' && urlParams.get('user_id')) {
      const userId = urlParams.get('user_id')!;
      // Store the user ID so we can pick it up in the listener.
      localStorage.setItem('user_id', userId);
      // Clean the URL.
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Set up a single listener for all authentication events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {

        // If a sync has already been triggered for this session, do nothing.
        if (syncTriggered.current) {
          setLoading(false);
          return;
        }

        // Case 1: A Supabase session is active (user logged in via email/pass, or just signed up)
        if (session) {
          syncTriggered.current = true; // Close the gate immediately.
          
          setSession(session);
          setUser(session.user);
          setAccessToken(session.access_token);
          setRefreshToken(session.refresh_token);
          setAuthProvider("supabase");
          
          await syncUserToSupabase(session.user, session.access_token, session.refresh_token);
          setLoading(false);
          return;
        }

        // Case 2: No Supabase session, check for a pending Google session in local storage
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
          const initialized = await authTokenManager.initialize(storedUserId);
          if (initialized) {
            syncTriggered.current = true; // Close the gate immediately.

            const googleUser = authTokenManager.getUser();
            const googleAccessToken = authTokenManager.getAccessToken();
            const googleRefreshToken = authTokenManager.getRefreshToken();

            setUser(googleUser);
            setAccessToken(googleAccessToken);
            setRefreshToken(googleRefreshToken);
            setAuthProvider('google');
            
            await syncUserToSupabase(googleUser, googleAccessToken, googleRefreshToken);
            setLoading(false);
            return;
          }
        }

        // Case 3: No sessions found anywhere, the user is logged out.
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // IMPORTANT: Run this effect only once on initial application mount.

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google/login?prompt=consent`);
      if (!response.ok) {
        throw new Error('Failed to initiate login');
      }
      const data = await response.json();
      window.location.href = data.authorization_url;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    // Supabase onAuthStateChange will handle the post-signup flow.
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  };

  const signIn = async (email: string, password: string) => {
    // Supabase onAuthStateChange will handle the post-signin flow.
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  const signOut = async () => {
    const provider = authProvider;
    setLoading(true);
    
    if (provider === 'supabase') {
      await supabase.auth.signOut();
    } else if (provider === 'google') {
      await authTokenManager.logout();
    }

    // Reset all state.
    setUser(null);
    setSession(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthProvider(null);
    syncTriggered.current = false; // IMPORTANT: Reset the sync gate on sign out.
    setLoading(false);
  };

  const value = {
    user,
    session,
    loading,
    isLoading,
    authProvider,
    accessToken,
    refreshToken,
    signUp,
    signIn,
    signOut,
    googleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
