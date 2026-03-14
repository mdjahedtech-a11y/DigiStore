import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, CheckCircle2, XCircle, Clock, Search, Filter, ExternalLink, User, Phone, CreditCard, Loader2 } from 'lucide-react';
import { orderApi } from '@/lib/supabase';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'success' | 'cancelled') => {
    try {
      setUpdating(id);
      setError(null);
      await orderApi.updateStatus(id, status);
      await loadOrders();
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.message || 'Failed to update order status. Check your admin permissions.');
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">Success</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase">Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          <p className="text-slate-500 text-sm">Review and approve customer payments.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {error && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-600 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
            <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 rounded">
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Transaction ID or User..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {searchTerm ? 'Filtered' : 'All Orders'}
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Order Info</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-8 px-6 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400 animate-pulse">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{order.product?.title || 'Unknown Product'}</p>
                          <p className="text-[10px] text-slate-400 font-mono uppercase">{order.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                          <User className="h-3 w-3 text-slate-400" />
                          {order.user_name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Phone className="h-3 w-3 text-slate-400" />
                          {order.sender_number}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${
                            order.payment_method === 'bKash' ? 'bg-pink-500' : 
                            order.payment_method === 'Nagad' ? 'bg-orange-500' : 'bg-yellow-500'
                          }`}>
                            {order.payment_method}
                          </span>
                          <span className="text-xs font-mono text-slate-600">{order.transaction_id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">${order.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {order.status === 'pending' ? (
                        <div className="flex justify-end gap-2">
                          <button 
                            disabled={updating === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'success')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Approve Order"
                          >
                            {updating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <button 
                            disabled={updating === order.id}
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Cancel Order"
                          >
                            {updating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                      <p>No orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
