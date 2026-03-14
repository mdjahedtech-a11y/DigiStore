import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Tag, Percent, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { couponApi } from '@/lib/supabase';
import { Coupon } from '@/types';

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_percentage: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getAll();
      setCoupons(data);
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.discount_percentage) return;

    const percentage = parseInt(newCoupon.discount_percentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      setError('Discount percentage must be between 1 and 100');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const created = await couponApi.create({
        code: newCoupon.code.toUpperCase(),
        discount_percentage: percentage
      });
      
      setCoupons([created, ...coupons]);
      setNewCoupon({ code: '', discount_percentage: '' });
      setIsAdding(false);
    } catch (err: any) {
      console.error('Failed to create coupon:', err);
      setError(err.message || 'Failed to create coupon. Code might already exist.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    
    try {
      await couponApi.delete(id);
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete coupon:', err);
      alert('Failed to delete coupon');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coupons</h1>
          <p className="text-slate-500 mt-2">Manage discount codes for your customers</p>
        </div>
        <Button 
          variant="gradient" 
          className="gap-2"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus className="h-5 w-5" />
          Add Coupon
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddCoupon} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Create New Coupon</h3>
              
              {error && (
                <div className="mb-4 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Coupon Code</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      required
                      placeholder="e.g. SUMMER20"
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      className="pl-10 uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Discount Percentage</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                      required
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 20"
                      value={newCoupon.discount_percentage}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount_percentage: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gradient" disabled={submitting}>
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Save Coupon'}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-bold text-slate-700">Code</th>
                <th className="p-4 font-bold text-slate-700">Discount</th>
                <th className="p-4 font-bold text-slate-700">Created</th>
                <th className="p-4 font-bold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No coupons found. Create one to get started.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold text-sm border border-primary-100">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-emerald-600">{coupon.discount_percentage}% OFF</span>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(coupon.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
