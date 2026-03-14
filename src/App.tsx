import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Pages
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Dashboard } from './pages/Dashboard';
import { Cart } from './pages/Cart';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminOrders } from './pages/AdminOrders';
import { AdminUsers } from './pages/AdminUsers';
import { Auth } from './pages/Auth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public & User Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          {/* Fallbacks for demo */}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          {/* Placeholders for other admin pages */}
          <Route path="reviews" element={<div className="p-8 text-slate-500">Reviews Management (Coming Soon)</div>} />
          <Route path="coupons" element={<div className="p-8 text-slate-500">Coupons Management (Coming Soon)</div>} />
          <Route path="analytics" element={<div className="p-8 text-slate-500">Analytics (Coming Soon)</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
