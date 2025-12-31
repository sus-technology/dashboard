import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signUp, isLoaded } = useSignUp();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password strength calculator
  const calculatePasswordStrength = (pwd: string): { score: number; label: string; color: string; tips: string[] } => {
    let score = 0;
    const tips: string[] = [];

    if (pwd.length === 0) return { score: 0, label: '', color: '', tips: [] };

    // Length check
    if (pwd.length >= 8) score++;
    else tips.push('At least 8 characters');

    if (pwd.length >= 12) score++;

    // Character variety checks
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    else tips.push('Mix of uppercase & lowercase');

    if (/\d/.test(pwd)) score++;
    else tips.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    else tips.push('Include special characters');

    // Determine label and color
    let label = '';
    let color = '';

    if (score <= 2) {
      label = 'Weak';
      color = 'destructive';
    } else if (score <= 3) {
      label = 'Medium';
      color = 'warning';
    } else {
      label = 'Strong';
      color = 'success';
    }

    return { score, label, color, tips };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !isLoaded) return;

    setIsLoading(true);

    // Trim and split the name into parts
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    // Join remaining parts for last name, or use empty string if no last name
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    try {
      // Start the sign-up process
      await signUp.create({
        firstName: firstName,
        lastName: lastName,
        emailAddress: email,
        password: password,
      });

      // Send the verification email
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // Navigate to verify-email page with sign up data
      navigate('/verify-email', {
        state: { email, from: '/login' },
      });

      toast({
        title: 'Success',
        description: 'Please check your email for the verification code.',
        variant: 'default',
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      toast({
        title: 'Error',
        description: err.errors?.[0]?.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <img src="/Logo.svg" alt="Sus-Technology" className="w-60 h-24" />
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl mb-2">Create Account</h2>
              <p className="text-muted-foreground">Start building apps with AI today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

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
                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        Password Strength: <span className={`${ passwordStrength.color === 'destructive' ? 'text-destructive' :
                            passwordStrength.color === 'warning' ? 'text-orange-500' :
                              'text-green-500'
                          }`}>{passwordStrength.label}</span>
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength.score
                              ? passwordStrength.color === 'destructive' ? 'bg-destructive' :
                                passwordStrength.color === 'warning' ? 'bg-orange-500' :
                                  'bg-green-500'
                              : 'bg-muted'
                            }`}
                        />
                      ))}
                    </div>
                    {passwordStrength.tips.length > 0 && (
                      <div className="space-y-1 mt-2">
                        {passwordStrength.tips.map((tip, index) => (
                          <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <X className="h-3 w-3" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-bl from-background via-background/95 to-background/90" />
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
              Start Building<br />
              <span className="gradient-text">Your Dream App</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md">
              Join thousands of creators who are building mobile apps
              without writing a single line of code.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut', delay: 0.1 }}
            className="mt-12 space-y-4"
          >
            {[
              'AI-powered app generation',
              '100+ professional templates',
              'One-click deployment',
            ].map((feature, index) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
