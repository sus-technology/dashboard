import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignIn, useClerk } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn, isLoaded, setActive } = useSignIn();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/dashboard';

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !isLoaded) return;

    setIsLoading(true);
    
    try {
      // Attempt to sign in
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        
        // Reset loading state before navigation to prevent memory leaks
        setIsLoading(false);
        
        // Show success message
        toast({
          title: 'Success',
          description: 'You have been successfully logged in!',
          variant: 'default',
        });
        
        // Redirect to the intended page or dashboard
        navigate(from, { replace: true });
      } else {
        // Handle additional verification steps if needed
        console.log('Additional verification required:', result);
        
        // If email verification is needed
        if (result.verifications?.emailAddress?.status === 'unverified') {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
          });
          
          // Reset loading state before navigation
          setIsLoading(false);
          
          // Navigate to verification page
          navigate('/verify-email', {
            state: { 
              email,
              from: from,
              isLogin: true 
            },
          });
        } else {
          // If no specific verification is needed but the status isn't complete
          setIsLoading(false);
          toast({
            title: 'Authentication Required',
            description: 'Additional verification is required to complete the login.',
            variant: 'destructive',
          });
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      // Ensure loading is always set to false on error
      setIsLoading(false);
      
      // More specific error messages
      const errorMessage = err.errors?.[0]?.message || 'An error occurred during login';
      let description = errorMessage;
      
      // Common error cases
      if (errorMessage.includes('identifier') || errorMessage.includes('password')) {
        description = 'Invalid email or password. Please try again.';
      } else if (errorMessage.includes('rate limit')) {
        description = 'Too many attempts. Please try again later.';
      }
      
      toast({
        title: 'Login Failed',
        description,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-8">
              <img src="/Logo.svg" alt="Sus-Technology" className="w-32 h-32" />
            </div>
            <h1 className="font-heading text-4xl xl:text-5xl mb-6 leading-tight">
              Build Mobile Apps<br />
              <span className="gradient-text">with AI Power</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Create stunning mobile applications without writing code.
              Our AI-powered platform turns your ideas into reality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
            className="mt-12 grid grid-cols-3 gap-6"
          >
            {[
              { label: 'Apps Built', value: '10K+' },
              { label: 'Active Users', value: '50K+' },
              { label: 'Templates', value: '100+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/Logo.svg" alt="Sus-Technology" className="w- h-24" />
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
