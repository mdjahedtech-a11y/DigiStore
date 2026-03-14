import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Loader2, FileText, Book, Monitor, Palette, Video as VideoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { productApi, CATEGORIES } from '@/lib/supabase';
import { Product } from '@/types';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const Home = () => {
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.getAll();
        setProducts(data);
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError('Failed to load products. Please check your Supabase connection.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  
  const filteredProducts = React.useMemo(() => {
    return activeCategory === 'All' 
      ? products 
      : products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  const featuredProducts = React.useMemo(() => {
    return products.filter(p => p.featured);
  }, [products]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center bg-slate-950 py-20">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-950">
          {/* Colorful glowing orbs */}
          <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-[20%] right-[20%] w-[40vw] h-[40vw] bg-secondary-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] bg-emerald-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '4s' }} />

          {/* Floating Circular Icons */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 sm:opacity-60">
            {/* PDF Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(225,29,72,0.5)]">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Book Icon */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute w-[400px] h-[400px] sm:w-[650px] sm:h-[650px]"
            >
              <div className="absolute top-1/4 -right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.5)]">
                <Book className="h-7 w-7 text-white" />
              </div>
            </motion.div>

            {/* Software Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute w-[500px] h-[500px] sm:w-[800px] sm:h-[800px]"
            >
              <div className="absolute bottom-0 left-1/4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(13,148,136,0.5)]">
                <Monitor className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Theme Icon */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute w-[350px] h-[350px] sm:w-[550px] sm:h-[550px]"
            >
              <div className="absolute bottom-1/4 -left-6 w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                <Palette className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            {/* Video Icon */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              className="absolute w-[450px] h-[450px] sm:w-[700px] sm:h-[700px]"
            >
              <div className="absolute -bottom-4 right-1/3 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,88,12,0.5)]">
                <VideoIcon className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8"
          >
            <Sparkles className="h-4 w-4 text-secondary-400" />
            <span className="text-sm font-medium text-white">The Ultimate Digital Marketplace</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6 max-w-4xl mx-auto leading-tight"
          >
            Discover Premium <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
              Digital Products
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Elevate your projects with high-quality templates, courses, software, and eBooks crafted by industry experts.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" variant="gradient" className="w-full sm:w-auto gap-2 group">
              Explore Products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Instant Delivery</h3>
                <p className="text-sm text-slate-500">Download immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-xl bg-secondary-100 flex items-center justify-center text-secondary-600 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Secure Payments</h3>
                <p className="text-sm text-slate-500">100% secure checkout process</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Premium Quality</h3>
                <p className="text-sm text-slate-500">Curated products by top creators</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-500">Hand-picked premium resources for you.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium hover:text-primary-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
              <p className="text-rose-500 font-medium mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories & All Products */}
      <section className="pt-20 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
            <p className="text-slate-500">Find exactly what you need from our extensive collection of digital assets.</p>
          </div>
          
          <div className="flex overflow-x-auto pb-4 sm:pb-0 sm:flex-wrap justify-start sm:justify-center gap-2 mb-12 no-scrollbar">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && filteredProducts.length === 0 && !error && (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
