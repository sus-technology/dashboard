import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useClerk, useSession } from '@clerk/clerk-react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { session } = useSession();
  const { signOut } = useClerk();
  
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Clerk user with our auth context
  useEffect(() => {
    const syncUser = async () => {
      if (!isUserLoaded) {
        setIsLoading(true);
        return;
      }

      if (clerkUser && session) {
        try {
          const token = await session.getToken();
          setToken(token);
          
          setUser({
            id: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress || '',
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            avatar: clerkUser.imageUrl,
          });
        } catch (error) {
          console.error('Error getting session token:', error);
        }
      } else {
        setUser(null);
        setToken(null);
      }
      
      setIsLoading(false);
    };

    syncUser();
  }, [clerkUser, isUserLoaded, session]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // This function is kept for backward compatibility but won't be used directly
    // as Clerk handles the login flow through their components
    return { success: false, error: 'Use Clerk sign-in components instead' };
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // This function is kept for backward compatibility but won't be used directly
    // as Clerk handles the signup flow through their components
    return { success: false, error: 'Use Clerk sign-up components instead' };
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading: isLoading || !isUserLoaded,
    isAuthenticated: !!clerkUser,
    login,
    signup,
    logout,
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
