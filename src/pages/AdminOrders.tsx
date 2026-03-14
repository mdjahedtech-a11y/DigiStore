import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, CheckCircle2, XCircle, Clock, Search, Filter, ExternalLink, User, Phone, CreditCard, Loader2, X, Calendar, Hash, DollarSign, Package, ShieldCheck } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'pending' | 'success' | 'cancelled'>('pending');
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

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
        <div className="flex border-b border-slate-100 p-1 bg-slate-50/50">
          {[
            { id: 'pending', label: 'Pending Orders', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'success', label: 'Success Orders', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { id: 'cancelled', label: 'Cancel Orders', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-black transition-all duration-300 rounded-xl",
                activeTab === tab.id 
                  ? cn(tab.bg, tab.color, "shadow-sm")
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? tab.color : "text-slate-400")} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              <span className={cn(
                "ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
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
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
            >
              {/* Vibrant Header with Animated Gradient */}
              <div className={cn(
                "p-8 text-white relative overflow-hidden transition-all duration-700",
                selectedOrder.payment_method === 'bKash' ? "bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600" :
                selectedOrder.payment_method === 'Nagad' ? "bg-gradient-to-br from-orange-500 via-red-500 to-red-600" :
                "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500"
              )}>
                {/* Decorative Elements */}
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" 
                />
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    x: [0, 20, 0],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/20 rounded-full blur-2xl" 
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-white/70 text-[10px] font-black uppercase tracking-[0.3em] mb-1"
                    >
                      Order Management
                    </motion.p>
                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-3xl sm:text-4xl font-black tracking-tighter"
                    >
                      #{selectedOrder.id.split('-')[0].toUpperCase()}
                    </motion.h2>
                  </div>
                  <motion.button 
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedOrder(null)} 
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-md"
                  >
                    <X className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Status Banner */}
                <div className="flex justify-center -mt-12 relative z-20">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                      "px-6 py-2 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest border-4 border-white",
                      selectedOrder.status === 'success' ? "bg-emerald-500 text-white" :
                      selectedOrder.status === 'cancelled' ? "bg-rose-500 text-white" :
                      "bg-amber-500 text-white"
                    )}
                  >
                    {selectedOrder.status}
                  </motion.div>
                </div>

                {/* Product Info Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-6 p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                >
                  <div className="h-24 w-24 rounded-2xl overflow-hidden shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <img 
                      src={selectedOrder.product?.thumbnail || 'https://picsum.photos/seed/product/200'} 
                      alt={selectedOrder.product?.title} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest mb-1">Digital Asset</p>
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 truncate">{selectedOrder.product?.title || 'Unknown Product'}</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-white rounded-full border border-slate-100 text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                        <Package className="h-3 w-3" />
                        {selectedOrder.product?.category || 'General'}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-8">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <User className="h-3 w-3 text-primary-500" /> Customer
                    </p>
                    <p className="text-lg font-black text-slate-900">{selectedOrder.user_name}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                      <DollarSign className="h-3 w-3 text-emerald-500" /> Amount
                    </p>
                    <p className="text-2xl font-black text-slate-900">${selectedOrder.amount.toFixed(2)}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Phone className="h-3 w-3 text-primary-500" /> Sender
                    </p>
                    <p className="font-bold text-slate-900">{selectedOrder.sender_number}</p>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-1 text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 justify-end">
                      <Calendar className="h-3 w-3 text-primary-500" /> Date
                    </p>
                    <p className="font-bold text-slate-900">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </motion.div>
                </div>

                {/* Transaction Section */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="h-16 w-16" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Transaction ID</p>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg",
                        selectedOrder.payment_method === 'bKash' ? "bg-pink-500 shadow-pink-500/20" : 
                        selectedOrder.payment_method === 'Nagad' ? "bg-orange-500 shadow-orange-500/20" : 
                        "bg-yellow-500 shadow-yellow-500/20"
                      )}>
                        {selectedOrder.payment_method}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                      <span className="text-xl font-mono font-bold tracking-widest text-primary-400">{selectedOrder.transaction_id}</span>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest">Copy</Button>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                {selectedOrder.status === 'pending' ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-2 gap-4 pt-4"
                  >
                    <Button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      disabled={updating === selectedOrder.id}
                      className="h-16 rounded-[1.25rem] bg-rose-50 text-rose-600 hover:bg-rose-100 border-none font-black tracking-tight text-lg shadow-lg shadow-rose-500/5"
                    >
                      {updating === selectedOrder.id ? <Loader2 className="h-6 w-6 animate-spin" /> : "Cancel"}
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'success')}
                      disabled={updating === selectedOrder.id}
                      className="h-16 rounded-[1.25rem] bg-emerald-500 text-white hover:bg-emerald-600 border-none font-black tracking-tight text-lg shadow-xl shadow-emerald-500/30"
                    >
                      {updating === selectedOrder.id ? <Loader2 className="h-6 w-6 animate-spin" /> : "Confirm"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="pt-4"
                  >
                    <div className={cn(
                      "w-full h-16 rounded-[1.25rem] flex items-center justify-center gap-3 font-black tracking-tight text-lg shadow-inner",
                      selectedOrder.status === 'success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                      {selectedOrder.status === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                      ORDER {selectedOrder.status.toUpperCase()}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
