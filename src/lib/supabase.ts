/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { type Product, type Order } from '../types';

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
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, product: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
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
    const { data, error } = await supabase
      .from('orders')
      .insert([{ ...order, status: 'pending' }])
      .select()
      .single();
    if (error) throw error;
    return data as Order;
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

export const CATEGORIES = [
  'All',
  'PDF',
  'eBooks',
  'Software',
  'Video Courses',
  'Themes',
  'Templates'
];
