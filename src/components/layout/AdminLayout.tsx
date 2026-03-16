import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Star, 
  Tag, 
  BarChart3, 
  Share2, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_LINKS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

export const AdminLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="h-8 w-8 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Admin Panel</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {ADMIN_LINKS.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
                isActive 
                  ? 'bg-primary-600/10 text-primary-400 font-medium' 
                  : 'hover:bg-slate-800/50 hover:text-white'
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-nav-bg"
                  className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent border-l-2 border-primary-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <link.icon className={cn("h-5 w-5 relative z-10", isActive ? "text-primary-400" : "text-slate-500 group-hover:text-slate-300")} />
              <span className="relative z-10">{link.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-slate-800 hidden sm:block">
              {ADMIN_LINKS.find(l => l.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-700 leading-none">Admin User</p>
                <p className="text-xs text-slate-500 mt-0.5">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};
