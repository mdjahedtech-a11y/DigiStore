import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle2, Shield, Download, FileText, Image as ImageIcon, Video, Monitor, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Skeleton } from '@/components/ui/Skeleton';

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productApi.getById(id);
        setProduct(data);
      } catch (err: any) {
        console.error('Error loading product:', err);
        setError('Product not found or connection error.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 py-12 flex-1">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <Skeleton className="aspect-[4/3] w-full rounded-3xl" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-3">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{error || 'Product not found'}</h2>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PDF':
      case 'eBooks':
        return <FileText className="h-5 w-5" />;
      case 'Software':
        return <Monitor className="h-5 w-5" />;
      case 'Video Courses':
        return <Video className="h-5 w-5" />;
      case 'Themes':
      case 'Templates':
        return <ImageIcon className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-slate-50 py-12 flex-1">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column - Images & Preview */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl border border-slate-200 relative group">
              <img 
                src={product.thumbnail} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Security Overlay for Preview */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-6">
                <div className="flex items-center gap-2 text-white/90 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium">
                  <Shield className="h-4 w-4" />
                  Secure Preview
                </div>
              </div>
            </div>
            
            {/* Preview Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary-500 cursor-pointer transition-colors">
                  <img 
                    src={`${product.thumbnail}?sig=${i}`} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
                {getCategoryIcon(product.category)}
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                <span className="text-sm text-slate-400">({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {product.title}
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed no-select">
              {product.description}
            </p>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm mb-8">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">One-time payment</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</span>
                    <span className="text-lg text-slate-400 line-through">${(product.price * 1.5).toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="h-4 w-4" /> In Stock
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{product.sales} sales</p>
                </div>
              </div>

              <Button size="lg" variant="gradient" className="w-full text-lg h-14 mb-4">
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full h-14">
                Buy Now
              </Button>

              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2"><Shield className="h-4 w-4" /> Secure checkout</span>
                <span className="flex items-center gap-2"><Download className="h-4 w-4" /> Instant access</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">What's included:</h3>
              <ul className="space-y-3">
                {['Full lifetime access', 'All future updates included', 'High-quality source files', 'Commercial license'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Affiliate Promo */}
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-100 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">Earn 30% Commission</h4>
                <p className="text-sm text-slate-600 mt-1">
                  Promote this product and earn ${(product.price * 0.3).toFixed(2)} per sale. 
                  <Link to="/affiliate" className="text-primary-600 font-medium ml-1 hover:underline">Join Affiliate Program</Link>
                </p>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
