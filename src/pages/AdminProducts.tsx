import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Filter, Edit2, Trash2, ExternalLink, Image as ImageIcon, Link as LinkIcon, FileText, Book, Monitor, Video, X, Save, Loader2, Package } from 'lucide-react';
import { productApi, CATEGORIES } from '@/lib/supabase';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: 0,
    category: 'PDF',
    thumbnail: '',
    download_url: '',
    download_urls: [],
    preview_url: '',
    featured: false,
    rating: 5,
    reviews: 0,
    sales: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        description: '',
        price: 0,
        category: 'PDF',
        thumbnail: '',
        download_url: '',
        download_urls: [],
        preview_url: '',
        featured: false,
        rating: 5,
        reviews: 0,
        sales: 0
      });
    }
    setIsModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, formData);
      } else {
        await productApi.create(formData as any);
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product. Please check your database permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PDF': return <FileText className="h-4 w-4" />;
      case 'eBooks': return <Book className="h-4 w-4" />;
      case 'Software': return <Monitor className="h-4 w-4" />;
      case 'Video Courses': return <Video className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products Management</h1>
          <p className="text-slate-500 text-sm">Add, edit and manage your digital assets.</p>
        </div>
        <Button onClick={() => handleOpenModal()} variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search products..." className="pl-10 bg-slate-50 border-transparent focus:bg-white" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sales</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="py-8 px-6">
                      <div className="flex items-center gap-4 animate-pulse">
                        <div className="h-12 w-12 bg-slate-100 rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-slate-100 rounded" />
                          <div className="h-3 w-32 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          <img src={product.thumbnail} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-slate-600">
                        {getCategoryIcon(product.category)}
                        <span className="text-sm">{product.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">৳{product.price.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-600">{product.sales} sales</span>
                    </td>
                    <td className="py-4 px-6">
                      {product.featured ? (
                        <span className="px-2 py-1 rounded-full bg-primary-50 text-primary-600 text-[10px] font-bold uppercase">Featured</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">Standard</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(product)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Package className="h-12 w-12 opacity-20" />
                      <p>No products found. Add your first product!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh]">
                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center gap-2">
                    <X className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Product Title</label>
                    <Input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Ultimate React Mastery Course" 
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700">Description</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none min-h-[100px]"
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Price (৳)</label>
                    <Input 
                      required
                      type="number"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Cover Photo URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        required
                        className="pl-10"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..." 
                      />
                    </div>
                    {formData.thumbnail && (
                      <div className="mt-2 relative group">
                        <div className="h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                          <img 
                            src={formData.thumbnail} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/error/800/600';
                            }}
                          />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <span className="text-white text-xs font-medium">Image Preview</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700">Preview Link (Google Drive)</label>
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        className="pl-10"
                        value={formData.preview_url}
                        onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
                        placeholder="Google Drive Preview Link" 
                      />
                    </div>
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-700">Download Links (Hidden until paid)</label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentLinks = formData.download_urls || [];
                          setFormData({
                            ...formData,
                            download_urls: [...currentLinks, { title: '', url: '' }]
                          });
                        }}
                        className="h-8 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Link
                      </Button>
                    </div>
                    
                    {/* Main link */}
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        required={!formData.download_urls || formData.download_urls.length === 0}
                        className="pl-10"
                        value={formData.download_url || ''}
                        onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                        placeholder="Main Download Link (e.g. Google Drive)" 
                      />
                    </div>

                    {/* Multiple links */}
                    {formData.download_urls && formData.download_urls.length > 0 && (
                      <div className="space-y-3 mt-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Additional Links</p>
                        {formData.download_urls.map((link, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1 space-y-2">
                              <Input
                                required
                                placeholder="Link Title (e.g. Part 1, Source Code)"
                                value={link.title}
                                onChange={(e) => {
                                  const newLinks = [...(formData.download_urls || [])];
                                  newLinks[index].title = e.target.value;
                                  setFormData({ ...formData, download_urls: newLinks });
                                }}
                              />
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                  required
                                  className="pl-10"
                                  placeholder="URL (e.g. https://...)"
                                  value={link.url}
                                  onChange={(e) => {
                                    const newLinks = [...(formData.download_urls || [])];
                                    newLinks[index].url = e.target.value;
                                    setFormData({ ...formData, download_urls: newLinks });
                                  }}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newLinks = [...(formData.download_urls || [])];
                                newLinks.splice(index, 1);
                                setFormData({ ...formData, download_urls: newLinks });
                              }}
                              className="p-2.5 mt-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="h-5 w-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-slate-700">Feature this product on home page</label>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 rounded-xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="gradient" 
                    className="flex-1 rounded-xl"
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Save className="h-5 w-5 mr-2" /> Save Product</>}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
