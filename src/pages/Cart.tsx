import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, CreditCard, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, orderApi } from '@/lib/supabase';

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      setCheckoutStatus('loading');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Create orders for each item in the cart
      // In a real app, this might be a single transaction or a batch
      for (const item of items) {
        await orderApi.create({
          user_id: user.id,
          product_id: item.id,
          amount: item.product.price * item.quantity,
          payment_method: 'bKash', // Default for demo
          sender_number: '01700000000', // Placeholder
          transaction_id: 'TRX-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        });
      }

      setCheckoutStatus('success');
      clearCart();
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutStatus('error');
    }
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

  if (checkoutStatus === 'success') {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="h-24 w-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Order Placed!</h2>
          <p className="text-slate-500 mb-8">Thank you for your purchase. Your digital products will be available in your dashboard once payment is verified.</p>
          <div className="animate-pulse text-primary-600 font-medium">Redirecting to dashboard...</div>
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
    </div>
  );
};
