import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi, orderApi, supabase } from '@/lib/supabase';
import { Product, Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle2, Shield, Download, FileText, Image as ImageIcon, Video, Monitor, Loader2, X, CreditCard, Send, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Binance'>('bKash');
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [paymentData, setPaymentData] = useState({
    name: '',
    senderNumber: '',
    transactionId: ''
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productApi.getById(id);
        setProduct(data);
        
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err: any) {
        console.error('Error loading product:', err);
        setError('Product not found or connection error.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    setSubmitting(true);
    try {
      await orderApi.create({
        user_id: user.id,
        product_id: product.id,
        amount: product.price,
        payment_method: paymentMethod,
        sender_number: paymentData.senderNumber,
        transaction_id: paymentData.transactionId,
        user_name: paymentData.name,
      });
      
      setIsPaymentModalOpen(false);
      alert('Payment submitted successfully! Your order is now pending approval.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error submitting payment:', err);
      alert('Failed to submit payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const paymentNumbers = {
    bKash: '01700000000',
    Nagad: '01800000000',
    Binance: 'binance_id_here'
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
            
            {/* Action Buttons for Preview */}
            {product.preview_url && (
              <div className="flex gap-4">
                <a 
                  href={product.preview_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                >
                  <ExternalLink className="h-5 w-5" />
                  Preview {product.category}
                </a>
              </div>
            )}

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

              <div className="flex flex-col gap-3 mb-8">
                <Button 
                  onClick={handleBuyNow}
                  size="lg" 
                  variant="gradient" 
                  className="w-full text-lg h-14"
                >
                  Buy Now
                </Button>
                
                {product.preview_url && (
                  <a 
                    href={product.preview_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button size="lg" variant="outline" className="w-full h-14 gap-2">
                      <ExternalLink className="h-5 w-5" />
                      Preview 2-3 Pages
                    </Button>
                  </a>
                )}
                
                <Button size="lg" variant="ghost" className="w-full h-14">
                  Add to Cart
                </Button>
              </div>

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
          </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Complete Payment</h2>
                <button onClick={() => setIsPaymentModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
                {/* Payment Methods */}
                <div className="grid grid-cols-3 gap-3">
                  {(['bKash', 'Nagad', 'Binance'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                        paymentMethod === method 
                          ? 'border-primary-500 bg-primary-50 text-primary-700' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500'
                      }`}
                    >
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs font-bold">{method}</span>
                    </button>
                  ))}
                </div>

                {/* Payment Instructions */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <p className="text-sm text-slate-500 mb-1">Send <span className="font-bold text-slate-900">${product?.price}</span> to this {paymentMethod} number:</p>
                  <p className="text-2xl font-bold text-primary-600 tracking-wider">{paymentNumbers[paymentMethod]}</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Personal Account</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Your Full Name</label>
                    <Input 
                      required
                      value={paymentData.name}
                      onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                      placeholder="Enter your name" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Sender {paymentMethod} Number</label>
                    <Input 
                      required
                      value={paymentData.senderNumber}
                      onChange={(e) => setPaymentData({ ...paymentData, senderNumber: e.target.value })}
                      placeholder="01XXXXXXXXX" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Transaction ID</label>
                    <Input 
                      required
                      value={paymentData.transactionId}
                      onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                      placeholder="Enter Transaction ID" 
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="gradient" 
                  className="w-full h-14 rounded-2xl text-lg gap-2"
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Payment Complete</>}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
