import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, LayoutDashboard, Share2, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Cart', path: '/cart', icon: ShoppingCart },
];

export const FloatingNav = () => {
  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md lg:hidden">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="relative flex items-center justify-between p-2 bg-slate-900/95 backdrop-blur-lg rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden group"
      >
        {/* Animated Gradient Border Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Subtle Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {NAV_ITEMS.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center py-2 px-4 rounded-full transition-all duration-300",
                isActive ? "text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="floating-nav-active"
                  className="absolute inset-0 bg-gradient-to-tr from-primary-600 to-secondary-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative z-10"
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "hover:scale-110"
                )} />
              </motion.div>
              
              <span className={cn(
                "text-[10px] font-bold mt-1 relative z-10 transition-all duration-300 tracking-tight",
                isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 h-0 overflow-hidden"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
