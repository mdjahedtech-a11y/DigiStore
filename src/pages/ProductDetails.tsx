import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productApi, orderApi, supabase } from '@/lib/supabase';
import { Product, Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { Star, CheckCircle2, Shield, Download, FileText, Image as ImageIcon, Video, Monitor, Loader2, X, CreditCard, Send, ExternalLink, Check, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Skeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const isInCart = items.some(item => item.id === id);
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
      navigate(`/auth?mode=signup&redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setIsPaymentModalOpen(true);
  };

  const [isSuccess, setIsSuccess] = React.useState(false);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !user) return;

    setSubmitting(true);
    try {
      console.log('Submitting order with data:', {
        user_id: user.id,
        product_id: product.id,
        amount: product.price,
        payment_method: paymentMethod,
        sender_number: paymentData.senderNumber,
        transaction_id: paymentData.transactionId,
        user_name: paymentData.name,
      });

      await orderApi.create({
        user_id: user.id,
        product_id: product.id,
        amount: product.price,
        payment_method: paymentMethod,
        sender_number: paymentData.senderNumber,
        transaction_id: paymentData.transactionId,
        user_name: paymentData.name,
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setIsSuccess(false);
        navigate('/dashboard');
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting payment:', err);
      const errorMsg = err.message || 'Unknown error';
      alert(`Failed to submit payment: ${errorMsg}. Please check your connection or try again.`);
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
    bKash: '01645921662',
    Nagad: '01645921662',
    Binance: 'Mdjahedtech@gmail.com'
  };

  const paymentColors = {
    bKash: 'from-[#D12053] to-[#E2136E]',
    Nagad: 'from-[#F7941D] to-[#ED1C24]',
    Binance: 'from-[#F3BA2F] to-[#F0B90B]'
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
                    <span className="text-4xl font-bold text-slate-900">৳{product.price.toFixed(2)}</span>
                    <span className="text-lg text-slate-400 line-through">৳{(product.price * 1.5).toFixed(2)}</span>
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
                
                <Button 
                  size="lg" 
                  variant={isInCart ? "outline" : "ghost"} 
                  className="w-full h-14 gap-2"
                  onClick={() => product && addToCart(product)}
                >
                  {isInCart ? (
                    <>
                      <Check className="h-5 w-5" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
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
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-xl bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-12 text-center space-y-6"
                  >
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="h-12 w-12 stroke-[3]" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Received!</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xs mx-auto">
                      Your transaction is being verified. You'll be redirected to your dashboard in a moment.
                    </p>
                    <div className="pt-4">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.5, ease: "linear" }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                    {/* Vibrant Header */}
                    <div className={cn(
                      "p-6 sm:p-10 text-white relative overflow-hidden bg-gradient-to-br transition-all duration-500",
                      paymentColors[paymentMethod]
                    )}>
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Secure Checkout</h2>
                          <p className="text-white/90 font-medium text-sm sm:text-base flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Total: ৳{product?.price.toFixed(2)}
                          </p>
                        </div>
                        <button 
                          onClick={() => setIsPaymentModalOpen(false)} 
                          className="p-2.5 bg-white/20 hover:bg-white/30 rounded-full transition-all hover:rotate-90 active:scale-90"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
                      {/* Payment Methods - Redesigned */}
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Payment Method</label>
                        <div className="grid grid-cols-3 gap-4">
                          {(['bKash', 'Nagad', 'Binance'] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={cn(
                                "relative py-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 group",
                                paymentMethod === method 
                                  ? "border-primary-500 bg-primary-50 text-primary-600 shadow-lg shadow-primary-500/10" 
                                  : "border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-600"
                              )}
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                paymentMethod === method ? "bg-primary-500 text-white" : "bg-slate-100"
                              )}>
                                {method === 'bKash' && <span className="font-bold text-xs">bK</span>}
                                {method === 'Nagad' && <span className="font-bold text-xs">Ng</span>}
                                {method === 'Binance' && <span className="font-bold text-xs">Bi</span>}
                              </div>
                              <span className="text-xs font-black uppercase tracking-wider">{method}</span>
                              {paymentMethod === method && (
                                <motion.div layoutId="active-method" className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full p-1 shadow-lg">
                                  <Check className="h-3 w-3 stroke-[4]" />
                                </motion.div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Instructions - Dark & Stylish */}
                      <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <CreditCard className="h-12 w-12" />
                        </div>
                        <div className="relative z-10">
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Payment Instructions</p>
                          <p className="text-xs sm:text-sm font-medium leading-relaxed">
                            Send <span className="text-primary-400 font-black text-base sm:text-lg">৳{product?.price.toFixed(0)}</span> to the following {paymentMethod === 'Binance' ? 'Binance ID' : 'number'}:
                          </p>
                          <div className="mt-3 sm:mt-4 flex items-center justify-between bg-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 group/copy">
                            <span className="text-sm sm:text-xl font-mono font-bold tracking-wider truncate mr-2">{paymentNumbers[paymentMethod]}</span>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(paymentNumbers[paymentMethod]);
                              }}
                              className="text-primary-400 hover:text-primary-300 hover:bg-white/10 h-8 sm:h-10 shrink-0"
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Form Inputs - Modern & Clean */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2 sm:col-span-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                          <Input
                            required
                            placeholder="Full Name"
                            value={paymentData.name}
                            onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 rounded-2xl text-slate-900 font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sender Number</label>
                          <Input
                            required
                            placeholder="017XXXXXXXX"
                            value={paymentData.senderNumber}
                            onChange={(e) => setPaymentData({ ...paymentData, senderNumber: e.target.value })}
                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 rounded-2xl text-slate-900 font-medium"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Transaction ID</label>
                          <Input
                            required
                            placeholder="Enter Transaction ID"
                            value={paymentData.transactionId}
                            onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                            className="h-14 bg-slate-50 border-transparent focus:bg-white focus:border-primary-500 rounded-2xl text-slate-900 font-medium"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={submitting}
                        className={cn(
                          "w-full h-16 rounded-2xl text-lg font-black tracking-tight transition-all duration-300 shadow-xl",
                          paymentColors[paymentMethod],
                          "hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        )}
                      >
                        {submitting ? (
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          "Confirm Payment"
                        )}
                      </Button>
                      
                      <p className="text-center text-xs text-slate-400 font-medium">
                        By clicking confirm, you agree to our <Link to="#" className="underline">Terms of Service</Link>
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
