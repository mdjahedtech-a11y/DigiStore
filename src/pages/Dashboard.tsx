import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, History, Settings, User, FileText, Shield, Clock, Loader2, CreditCard, ShoppingBag, Phone, Mail as MailIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { productApi, orderApi, supabase } from '@/lib/supabase';
import { Product, Order } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('purchases');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Load user profile from localStorage or auth metadata
        const storedProfile = localStorage.getItem('user_profile');
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        } else {
          setUserProfile({
            name: user.user_metadata?.full_name || 'User',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          });
        }

        // Load real orders from Supabase
        const userOrders = await orderApi.getByUserId(user.id);
        setOrders(userOrders);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const successfulOrders = orders.filter(o => o.status === 'success');

  return (
    <div className="bg-slate-50 py-12 flex-1">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 shrink-0"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-4">
                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{userProfile.name}</h2>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                    <MailIcon className="h-3 w-3" /> {userProfile.email}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                    <Phone className="h-3 w-3" /> {userProfile.phone}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm h-9">Edit Profile</Button>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'purchases', label: 'My Purchases', icon: Download },
                { id: 'orders', label: 'Order Status', icon: ShoppingBag },
                { id: 'payments', label: 'Payment History', icon: CreditCard },
                { id: 'settings', label: 'Account Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-primary-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[500px]">
              {loading ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-slate-100">
                        <Skeleton className="w-full sm:w-48 aspect-[4/3] rounded-xl" />
                        <div className="flex-1 space-y-4">
                          <Skeleton className="h-6 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                          <div className="flex justify-between items-center pt-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-32 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'purchases' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Purchases</h2>
                      {successfulOrders.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {successfulOrders.map((order) => (
                            <div key={order.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                              <div className="w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                                <img src={order.product?.thumbnail} alt={order.product?.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-slate-900">{order.product?.title}</h3>
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Active</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{order.product?.description}</p>
                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Purchased: {new Date(order.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Secure Link</span>
                                  </div>
                                  {order.product?.download_url && (
                                    <a 
                                      href={order.product.download_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      <Button size="sm" variant="gradient" className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Download File
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20">
                          <p className="text-slate-500">You haven't purchased any products yet or your payment is pending.</p>
                          <Link to="/">
                            <Button variant="outline" className="mt-4">Browse Products</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Status</h2>
                      <div className="space-y-4">
                        {orders.length > 0 ? (
                          orders.map((order) => (
                            <div key={order.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/30">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                                    <ShoppingBag className="h-6 w-6" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{order.product?.title || 'Order #' + order.id.slice(0, 8)}</p>
                                    <p className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()} • {order.payment_method}</p>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6">
                                  <div className="text-right">
                                    <p className="font-bold text-slate-900">${order.amount.toFixed(2)}</p>
                                    <p className="text-xs text-slate-400">Total Amount</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.status === 'success' 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : order.status === 'cancelled'
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-10 text-slate-500">No orders found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'payments' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment History</h2>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="py-4 px-4 text-sm font-semibold text-slate-600">Transaction ID</th>
                              <th className="py-4 px-4 text-sm font-semibold text-slate-600">Date</th>
                              <th className="py-4 px-4 text-sm font-semibold text-slate-600">Method</th>
                              <th className="py-4 px-4 text-sm font-semibold text-slate-600">Amount</th>
                              <th className="py-4 px-4 text-sm font-semibold text-slate-600">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 px-4 text-sm font-medium text-slate-900">{order.transaction_id}</td>
                                <td className="py-4 px-4 text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="py-4 px-4 text-sm text-slate-500">{order.payment_method}</td>
                                <td className="py-4 px-4 text-sm font-bold text-slate-900">${order.amount.toFixed(2)}</td>
                                <td className="py-4 px-4">
                                  <span className={`text-xs font-bold uppercase ${
                                    order.status === 'success' ? 'text-emerald-600' : 
                                    order.status === 'cancelled' ? 'text-rose-600' : 'text-amber-600'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
                      <div className="max-w-md space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                          <input type="text" defaultValue={userProfile.name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input type="email" defaultValue={userProfile.email} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                          <input type="tel" defaultValue={userProfile.phone} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                        </div>
                        <Button variant="gradient">Save Changes</Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
