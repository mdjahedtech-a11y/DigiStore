/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { type Product, type Order, type Profile } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vzmwxvuhvktohrybfted.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6bXd4dnVodmt0b2hyeWJmdGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMTc1OTIsImV4cCI6MjA4ODc5MzU5Mn0.t9P3nYRsF6_o_5zagoA1DfDdI8A2Rg-aalzBFCxZXSo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for Database
export const productApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true);
    
    if (error) throw error;
    return data as Product[];
  },

  async create(product: Omit<Product, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) {
        console.error('Supabase Product Create Error:', error);
        throw error;
      }
      return data as Product;
    } catch (err) {
      console.error('Product API Create Exception:', err);
      throw err;
    }
  },

  async update(id: string, product: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase Product Update Error:', error);
        throw error;
      }
      return data as Product;
    } catch (err) {
      console.error('Product API Update Exception:', err);
      throw err;
    }
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

export const orderApi = {
  async create(order: Omit<Order, 'id' | 'created_at' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{ ...order, status: 'pending' }])
        .select();
      
      if (error) {
        console.error('Supabase Order Create Error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from order creation');
      }
      
      return data[0] as Order;
    } catch (err) {
      console.error('Order API Create Exception:', err);
      throw err;
    }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },

  async updateStatus(id: string, status: 'success' | 'cancelled') {
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }
};

export const profileApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Profile[];
  }
};

export const couponApi = {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    } catch (err) {
      console.warn('Falling back to localStorage for coupons', err);
      const local = localStorage.getItem('local_coupons');
      return local ? JSON.parse(local) : [];
    }
  },

  async getByCode(code: string) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      const local = localStorage.getItem('local_coupons');
      const coupons = local ? JSON.parse(local) : [];
      const found = coupons.find((c: any) => c.code === code);
      if (found) return found;
      throw new Error('Coupon not found');
    }
  },

  async create(coupon: { code: string; discount_percentage: number }) {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([coupon])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (err) {
      const newCoupon = { 
        id: crypto.randomUUID(), 
        ...coupon, 
        created_at: new Date().toISOString() 
      };
      const local = localStorage.getItem('local_coupons');
      const coupons = local ? JSON.parse(local) : [];
      localStorage.setItem('local_coupons', JSON.stringify([newCoupon, ...coupons]));
      return newCoupon;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      const local = localStorage.getItem('local_coupons');
      if (local) {
        const coupons = JSON.parse(local).filter((c: any) => c.id !== id);
        localStorage.setItem('local_coupons', JSON.stringify(coupons));
      }
    }
  }
};

export const CATEGORIES = [
  'All',
  'PDF',
  'eBooks',
  'Software',
  'Video Courses',
  'Themes',
  'Templates'
];
