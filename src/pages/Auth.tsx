import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const mode = searchParams.get('mode');
  const [isLogin, setIsLogin] = React.useState(mode !== 'signup');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    try {
      if (isLogin) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          if (signInError.message === 'Invalid login credentials') {
            throw new Error('Wrong email or password. Please try again.');
          }
          throw signInError;
        }
        console.log('Sign in success:', data);
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
            },
          },
        });
        if (signUpError) throw signUpError;
        
        console.log('Sign up success:', data);
        
        // Save to local storage for profile display
        localStorage.setItem('user_profile', JSON.stringify({ name, email, phone }));

        if (!data.session) {
          setError('Account created! Please check your email for a confirmation link before signing in.');
          setLoading(false);
          return;
        }
      }
      
      navigate(redirect);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Optimized Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-secondary-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-4 shadow-lg shadow-primary-500/20"
              >
                <Sparkles className="h-7 w-7 text-white" />
              </motion.div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Join our community of premium digital creators'}
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="signup-fields"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <Input 
                          name="name"
                          type="text" 
                          placeholder="Full Name" 
                          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                        <Input 
                          name="phone"
                          type="tel" 
                          placeholder="Phone Number" 
                          className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
  
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="Gmail Address" 
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                    required
                  />
                </div>
  
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20 transition-all duration-200"
                    required
                  />
                </div>

              {isLogin && (
                <div className="flex justify-end">
                  <button type="button" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full h-12 text-base font-semibold group"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Sign Up'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="p-6 bg-white/5 border-t border-white/10 text-center">
            <p className="text-slate-400 text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-400 font-semibold hover:text-primary-300 transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
