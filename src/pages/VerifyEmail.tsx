import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignUp, useSignIn } from '@clerk/clerk-react';
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const email = location.state?.email || '';
  const from = location.state?.from || '/';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !signUp) return;
    
    setIsLoading(true);
    
    try {
      // Attempt to verify the email with the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      
      if (completeSignUp.status === 'complete') {
        // Sign the user in automatically after verification
        await setActive({ session: completeSignUp.createdSessionId });
        setIsVerified(true);
        
        toast({
          title: 'Email verified!',
          description: 'Your email has been successfully verified.',
          variant: 'default',
        });
        
        // Redirect to the intended page after a short delay
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 2000);
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      toast({
        title: 'Error',
        description: err.errors?.[0]?.message || 'Failed to verify email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp || !email) return;
    
    setResendStatus('sending');
    
    try {
      // Try to resend the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
      
      setResendStatus('sent');
      
      toast({
        title: 'Verification code sent',
        description: 'A new verification code has been sent to your email.',
        variant: 'default',
      });
      
      // Reset the status after 30 seconds
      setTimeout(() => {
        setResendStatus('idle');
      }, 30000);
    } catch (err: any) {
      console.error('Resend error:', err);
      toast({
        title: 'Error',
        description: err.errors?.[0]?.message || 'Failed to resend verification code.',
        variant: 'destructive',
      });
      setResendStatus('idle');
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full space-y-6"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30">
            <MailCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. Redirecting you now...
          </p>
          <div className="pt-4">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Verify Your Email</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We've sent a verification code to <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="text-center text-lg font-mono tracking-widest"
                autoComplete="one-time-code"
                required
              />
              <p className="text-xs text-muted-foreground">
                Check your email for the verification code.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Didn't receive a code?{' '}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendStatus !== 'idle'}
                  className="font-medium text-primary hover:underline focus:outline-none"
                >
                  {resendStatus === 'sending' ? (
                    'Sending...'
                  ) : resendStatus === 'sent' ? (
                    'Code sent!'
                  ) : (
                    'Resend code'
                  )}
                </button>
              </p>
              {resendStatus === 'sent' && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  A new code has been sent to your email.
                </p>
              )}
            </div>
          </form>

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Wrong email?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium text-primary hover:underline focus:outline-none"
              >
                Go back to sign up
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
