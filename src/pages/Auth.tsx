import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Mail, Phone, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useNavigate } from 'react-router-dom';

export const Auth = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-600/20 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, -120, 0],
            x: [0, -150, 0],
            y: [0, 100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary-600/20 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mb-4 shadow-lg shadow-primary-500/20"
              >
                <Sparkles className="h-8 w-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-slate-400">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Join our community of premium digital creators'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input 
                        type="text" 
                        placeholder="Full Name" 
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input 
                        type="tel" 
                        placeholder="Phone Number" 
                        className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  type="email" 
                  placeholder="Gmail Address" 
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-primary-500/20"
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

              <Button type="submit" variant="gradient" className="w-full h-12 text-base font-semibold group">
                {isLogin ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
