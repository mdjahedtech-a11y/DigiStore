import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Download, History, Settings, User, FileText, Shield, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { productApi } from '@/lib/supabase';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/Skeleton';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('purchases');
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setLoading(true);
        // For demo, we'll just show some products as "purchased"
        const data = await productApi.getAll();
        setPurchasedProducts(data.slice(0, 3));
      } catch (err) {
        console.error('Error loading purchases:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPurchases();
  }, []);

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
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  JD
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">John Doe</h2>
                  <p className="text-sm text-slate-500">john.doe@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full text-sm h-9">Edit Profile</Button>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'purchases', label: 'My Purchases', icon: Download },
                { id: 'history', label: 'Download History', icon: History },
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
                      {purchasedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                          {purchasedProducts.map((product) => (
                            <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                              <div className="w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                                <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-semibold text-slate-900">{product.title}</h3>
                                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Active</span>
                                </div>
                                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> Purchased: Oct 12, 2023</span>
                                    <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Secure Link</span>
                                  </div>
                                  <Button size="sm" variant="gradient" className="gap-2">
                                    <Download className="h-4 w-4" />
                                    Download File
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20">
                          <p className="text-slate-500">You haven't purchased any products yet.</p>
                          <Link to="/">
                            <Button variant="outline" className="mt-4">Browse Products</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'history' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Download History</h2>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">Ultimate React Mastery Course - Part {i}.zip</p>
                                <p className="text-sm text-slate-500">Downloaded on Oct {12 + i}, 2023 at 14:30 PM</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-emerald-600">Success</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
                      <div className="max-w-md space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                          <input type="text" defaultValue="John Doe" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                          <input type="email" defaultValue="john.doe@example.com" className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
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
