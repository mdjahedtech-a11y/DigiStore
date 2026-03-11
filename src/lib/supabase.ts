/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { type Product } from '../types';

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
