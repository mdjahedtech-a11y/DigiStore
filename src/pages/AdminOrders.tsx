import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle2, XCircle, Clock, Search, Filter, ExternalLink, User, Phone, CreditCard, Loader2, X, Calendar, Hash, DollarSign, Package, ShieldCheck, Trash2 } from 'lucide-react';
import { orderApi } from '@/lib/supabase';
import { Order } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'success' | 'cancelled' | 'deleted'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (activeTab === 'deleted') {
      cleanupDeletedOrders();
    }
  }, [activeTab, orders]);

  const cleanupDeletedOrders = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const toDelete = orders.filter(order =>
      order.status === 'deleted' &&
      new Date(order.updated_at || order.created_at) < sevenDaysAgo
    );

    if (toDelete.length > 0) {
      try {
        for (const order of toDelete) {
          await orderApi.permanentDelete(order.id);
        }
        loadOrders();
      } catch (err) {
        console.error('Failed to permanently delete orders:', err);
      }
    }
  };

  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearch = 
        order.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = order.status === activeTab;
      
      return matchesSearch && matchesTab;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders, activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderApi.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'success' | 'cancelled' | 'deleted') => {
    try {
      setUpdating(id);
      setError(null);
      await orderApi.updateStatus(id, status);
      await loadOrders();
      if (selectedOrder?.id === id) {
        setSelectedOrder(null);
      }
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
        return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">Success</span>;
      case 'cancelled':
        return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider">Cancelled</span>;
      case 'deleted':
        return <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider">Deleted</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-wider">Pending</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 text-sm">
            {activeTab === 'pending' ? 'Review and approve customer payments.' : 
             activeTab === 'success' ? 'View successfully completed orders.' : 
             'View cancelled or rejected orders.'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tab Switcher */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 p-1 bg-slate-50/50">
          {[
            { id: 'pending', label: 'Pending Orders', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'success', label: 'Success Orders', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { id: 'cancelled', label: 'Cancel Orders', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
            { id: 'deleted', label: 'Deleted Orders', icon: Trash2, color: 'text-slate-600', bg: 'bg-slate-100' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 min-w-[110px] flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-black transition-all duration-300 rounded-xl",
                activeTab === tab.id 
                  ? cn(tab.bg, tab.color, "shadow-sm")
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              )}
            >
              <tab.icon className={cn("h-4 w-4 shrink-0", activeTab === tab.id ? tab.color : "text-slate-400")} />
              <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
              <span className="sm:hidden whitespace-nowrap">{tab.label.split(' ')[0]}</span>
              <span className={cn(
                "px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                activeTab === tab.id ? cn(tab.bg, "border border-current/20") : "bg-slate-100 text-slate-500"
              )}>
                {orders.filter(o => o.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

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
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Payment</th>
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
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                          <ShoppingBag className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{order.product?.title || 'Unknown Product'}</p>
                          <p className="text-[10px] text-slate-400 font-mono uppercase">{order.id.split('-')[0]}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 hidden md:table-cell">
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
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black text-white uppercase tracking-tighter",
                            order.payment_method === 'bKash' ? 'bg-pink-500' : 
                            order.payment_method === 'Nagad' ? 'bg-orange-500' : 'bg-yellow-500'
                          )}>
                            {order.payment_method}
                          </span>
                          <span className="text-xs font-mono text-slate-600">{order.transaction_id}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">${order.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        {order.status !== 'deleted' && (
                          <>
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
                          </>
                        )}
                        <button 
                          disabled={updating === order.id}
                          onClick={() => handleUpdateStatus(order.id, 'deleted')}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          title="Delete Order"
                        >
                          {updating === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                      <p>No {activeTab} orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stylish Order Details Popup */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <div className="fixed inset-0 overflow-y-auto">
              <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="relative w-full max-w-lg bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100"
                >
                  {/* Header */}
                  <div className={cn(
                    "p-6 sm:p-8 text-white relative overflow-hidden",
                    selectedOrder.payment_method === 'bKash' ? "bg-pink-600" :
                    selectedOrder.payment_method === 'Nagad' ? "bg-orange-600" :
                    "bg-amber-500"
                  )}>
                    {/* Simplified Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 flex items-center justify-between">
                      <div>
                        <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-1">
                          Order Management
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
                          #{selectedOrder.id.split('-')[0].toUpperCase()}
                        </h2>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(null)} 
                        className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5 sm:h-6 sm:w-6" />
                      </button>
                    </div>
                  </div>

                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                  {/* Status Banner */}
                  <div className="flex justify-center -mt-10 sm:-mt-12 relative z-20">
                    <div className={cn(
                        "px-6 py-2 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest border-4 border-white",
                        selectedOrder.status === 'success' ? "bg-emerald-500 text-white" :
                        selectedOrder.status === 'cancelled' ? "bg-rose-500 text-white" :
                        "bg-amber-500 text-white"
                      )}
                    >
                      {selectedOrder.status}
                    </div>
                  </div>

                  {/* Product Info Section */}
                  <div className="flex items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-[2rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                    <div className="h-16 w-16 sm:h-24 sm:w-24 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={selectedOrder.product?.thumbnail || 'https://picsum.photos/seed/product/200'} 
                        alt={selectedOrder.product?.title} 
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Digital Asset</p>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight mb-2 truncate">{selectedOrder.product?.title || 'Unknown Product'}</h3>
                      <div className="flex items-center gap-2">
                        <div className="px-2 sm:px-3 py-1 bg-white rounded-full border border-slate-100 text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                          <Package className="h-3 w-3" />
                          <span className="truncate">{selectedOrder.product?.category || 'General'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 sm:gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                        <User className="h-3 w-3 text-primary-500" /> Customer
                      </p>
                      <p className="text-base sm:text-lg font-black text-slate-900 truncate">{selectedOrder.user_name}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 sm:gap-2 justify-end">
                        <DollarSign className="h-3 w-3 text-emerald-500" /> Amount
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">${selectedOrder.amount.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 sm:gap-2">
                        <Phone className="h-3 w-3 text-primary-500" /> Sender
                      </p>
                      <p className="text-sm sm:text-base font-bold text-slate-900 truncate">{selectedOrder.sender_number}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 sm:gap-2 justify-end">
                        <Calendar className="h-3 w-3 text-primary-500" /> Date
                      </p>
                      <p className="text-sm sm:text-base font-bold text-slate-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Transaction Section */}
                  <div className="p-4 sm:p-6 bg-slate-900 rounded-2xl sm:rounded-[2rem] text-white relative overflow-hidden group shadow-xl shadow-slate-900/20">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <ShieldCheck className="h-12 w-12 sm:h-16 sm:w-16" />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Transaction ID</p>
                        <span className={cn(
                          "px-2 sm:px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg",
                          selectedOrder.payment_method === 'bKash' ? "bg-pink-500 shadow-pink-500/20" : 
                          selectedOrder.payment_method === 'Nagad' ? "bg-orange-500 shadow-orange-500/20" : 
                          "bg-yellow-500 shadow-yellow-500/20"
                        )}>
                          {selectedOrder.payment_method}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10">
                        <span className="text-sm sm:text-lg font-mono font-bold tracking-widest text-primary-400 truncate mr-2">{selectedOrder.transaction_id}</span>
                        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl font-black text-[10px] uppercase tracking-widest shrink-0">Copy</Button>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedOrder.status !== 'deleted' ? (
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <Button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                        disabled={updating === selectedOrder.id}
                        className="h-12 sm:h-16 rounded-xl sm:rounded-[1.25rem] bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-black tracking-tight text-base sm:text-lg shadow-lg shadow-rose-500/5"
                      >
                        {updating === selectedOrder.id ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "Cancel"}
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'deleted')}
                        disabled={updating === selectedOrder.id}
                        className="h-12 sm:h-16 rounded-xl sm:rounded-[1.25rem] bg-slate-100 text-slate-600 hover:bg-slate-200 border-none font-black tracking-tight text-base sm:text-lg shadow-lg shadow-slate-500/5"
                      >
                        {updating === selectedOrder.id ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "Delete"}
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus(selectedOrder.id, 'success')}
                        disabled={updating === selectedOrder.id}
                        className="h-12 sm:h-16 rounded-xl sm:rounded-[1.25rem] bg-emerald-500 text-white hover:bg-emerald-600 border-none font-black tracking-tight text-base sm:text-lg shadow-xl shadow-emerald-500/30"
                      >
                        {updating === selectedOrder.id ? <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" /> : "Confirm"}
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-2 sm:pt-4">
                      <div className={cn(
                        "w-full h-12 sm:h-16 rounded-xl sm:rounded-[1.25rem] flex items-center justify-center gap-2 sm:gap-3 font-black tracking-tight text-base sm:text-lg shadow-inner",
                        selectedOrder.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                        {selectedOrder.status === 'success' ? <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" /> : <XCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
                        ORDER {selectedOrder.status.toUpperCase()}
                      </div>
                    </div>
                  )}
                </div>
            </motion.div>
          </div>
        </div>
      </div>
      )}
    </AnimatePresence>
  </div>
);
};
