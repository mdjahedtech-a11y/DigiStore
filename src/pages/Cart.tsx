import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CreditCard, ShieldCheck, ShoppingBag, X, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, orderApi } from '@/lib/supabase';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Binance'>('bKash');
  const [paymentData, setPaymentData] = useState({
    name: '',
    senderNumber: '',
    transactionId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth?redirect=/cart');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Create orders for each item in the cart
      for (const item of items) {
        await orderApi.create({
          user_id: user.id,
          product_id: item.id,
          amount: item.product.price * item.quantity,
          payment_method: paymentMethod,
          sender_number: paymentData.senderNumber,
          transaction_id: paymentData.transactionId,
          user_name: paymentData.name,
        });
      }

      setCheckoutStatus('success');
      clearCart();
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setCheckoutStatus('error');
      const errorMessage = error?.message || 'Unknown error';
      alert(`Failed to process order: ${errorMessage}. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  const paymentNumbers = {
    bKash: '01700000000',
    Nagad: '01800000000',
    Binance: 'binance_id_here'
  };

  const paymentColors = {
    bKash: 'from-[#D12053] to-[#E2136E]',
    Nagad: 'from-[#F7941D] to-[#ED1C24]',
    Binance: 'from-[#F3BA2F] to-[#F0B90B]'
  };

  if (items.length === 0 && checkoutStatus !== 'success') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-8">Looks like you haven't added any digital products to your cart yet.</p>
          <Link to="/">
            <Button variant="gradient" size="lg" className="gap-2">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
          <ShoppingCart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-500">{totalItems} items in your cart</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6 group hover:border-primary-200 transition-colors"
              >
                <div className="h-24 w-32 rounded-xl overflow-hidden shrink-0">
                  <img 
                    src={item.product.thumbnail} 
                    alt={item.product.title} 
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                    {item.product.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-2">{item.product.category}</p>
                  <div className="text-lg font-bold text-slate-900">${item.product.price.toFixed(2)}</div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-1 rounded-xl border border-slate-100">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="h-px bg-slate-100 my-4" />
              <div className="flex justify-between text-xl font-bold text-slate-900">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button 
              variant="gradient" 
              size="lg" 
              className="w-full gap-2 py-6 rounded-2xl shadow-lg shadow-primary-500/20"
              onClick={handleCheckout}
              disabled={checkoutStatus === 'loading'}
            >
              {checkoutStatus === 'loading' ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  Checkout Now
                </>
              )}
            </Button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Secure checkout powered by DigiStore
            </div>
          </div>
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
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {checkoutStatus === 'success' ? (
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
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Order Placed!</h2>
                    <p className="text-slate-500 font-medium text-lg max-w-xs mx-auto">
                      Your transaction is being verified. You'll be redirected to your dashboard in a moment.
                    </p>
                    <div className="pt-4">
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "linear" }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                    {/* Vibrant Header */}
                    <div className={cn(
                      "p-8 text-white relative overflow-hidden bg-gradient-to-br transition-all duration-500",
                      paymentColors[paymentMethod]
                    )}>
                      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                      
                      <div className="relative z-10 flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">Secure Checkout</h2>
                          <p className="text-white/80 font-medium">Total Amount: ${totalPrice.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => setIsPaymentModalOpen(false)} 
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <form onSubmit={handlePaymentSubmit} className="p-8 space-y-8">
                      {/* Payment Methods */}
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

                      {/* Instructions */}
                      <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <CreditCard className="h-12 w-12" />
                        </div>
                        <div className="relative z-10">
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Payment Instructions</p>
                          <p className="text-sm font-medium leading-relaxed">
                            Send <span className="text-primary-400 font-black text-lg">৳{(totalPrice * 120).toFixed(0)}</span> to the following {paymentMethod} number:
                          </p>
                          <div className="mt-4 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
                            <span className="text-xl font-mono font-bold tracking-wider">{paymentNumbers[paymentMethod]}</span>
                            <Button size="sm" variant="ghost" className="text-primary-400 hover:text-primary-300 hover:bg-white/10">Copy</Button>
                          </div>
                        </div>
                      </div>

                      {/* Form Inputs */}
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
