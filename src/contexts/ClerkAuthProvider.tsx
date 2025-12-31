import React from 'react';
import { 
  ClerkProvider, 
  useUser, 
  useSignIn, 
  useSignUp, 
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp
} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext, type AuthContextType, type User } from './AuthContext';

// Update this with your Clerk publishable key from the .env file
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

// Wrapper component to provide Clerk functionality
const ClerkAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signOut } = useClerk();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp();
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    if (!isSignInLoaded) return { success: false, error: 'Auth not ready' };
    
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // The user is signed in
        return { success: true };
      } else {
        // The user needs to complete additional steps
        return { success: false, error: 'Additional verification required' };
      }
    } catch (err: any) {
      console.error('Login error:', err);
      return { 
        success: false, 
        error: err.errors?.[0]?.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!isSignUpLoaded) return { success: false, error: 'Auth not ready' };
    
    try {
      await signUp.create({
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || ' ', // Handle single name
        emailAddress: email,
        password,
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { 
        success: false, 
        error: err.errors?.[0]?.message || 'Signup failed. Please try again.' 
      };
    }
  };

  const logout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Map Clerk user to our app's user type
  const mappedUser: User | null = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'User',
    avatar: user.imageUrl,
  } : null;

  const contextValue: AuthContextType = {
    user: mappedUser,
    token: user ? 'clerk-auth-token' : null,
    isLoading: !isUserLoaded || !isSignInLoaded || !isSignUpLoaded,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from './AuthContext';

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // Create a custom navigate function that works with Clerk
  const clerkNavigate = (to: string) => {
    return navigate(to);
  };

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      routerPush={(to) => clerkNavigate(to)}
      routerReplace={(to) => {
        navigate(to, { replace: true });
        return Promise.resolve();
      }}
    >
      <ClerkAuthWrapper>
        {children}
      </ClerkAuthWrapper>
    </ClerkProvider>
  );
};

export const ClerkAuthComponents = {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
};

export default ClerkAuthProvider;
