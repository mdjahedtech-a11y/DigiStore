import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FloatingNav } from '@/components/ui/FloatingNav';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export const MainLayout = () => {
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const location = useLocation();

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 relative">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              DigitalEmpire
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md relative mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search products, templates, courses..." 
              className="pl-10 bg-slate-100/50 border-transparent focus:bg-white focus:border-primary-500 rounded-full"
            />
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Products</Link>
            {user?.email === 'mdjahedtech@gmail.com' && (
              <Link to="/admin" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">Admin Panel</Link>
            )}
            <div className="h-4 w-px bg-slate-200"></div>
            <Link to="/cart" className="relative text-slate-600 hover:text-primary-600 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <User className="h-4 w-4" />
                {user ? "Dashboard" : "Account"}
              </Button>
            </Link>
          </nav>

          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="md:hidden fixed top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl z-40"
          >
            <div className="p-4 flex flex-col gap-2">
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  type="search" 
                  placeholder="Search products..." 
                  className="pl-10 bg-slate-100/50 rounded-xl border-transparent focus:bg-white"
                />
              </div>
              <Link to="/products" className="p-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl transition-colors">Products</Link>
              <Link to="/cart" className="p-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl transition-colors flex justify-between items-center">
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              <Link to={user ? "/dashboard" : "/auth"} className="p-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl transition-colors">
                {user ? "Dashboard" : "Account"}
              </Link>
              {user?.email === 'mdjahedtech@gmail.com' && (
                <Link to="/admin" className="p-3 text-primary-600 font-semibold hover:bg-primary-50 rounded-xl transition-colors">Admin Panel</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <FloatingNav />

      <footer className="bg-slate-900 text-slate-300 py-12 pb-28 lg:pb-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-xl font-bold text-white">DigitalEmpire</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              The ultimate marketplace for premium digital products. Download high-quality PDFs, templates, software, and courses instantly.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Browse Products</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          &copy; {new Date().getFullYear()} DigitalEmpire. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
