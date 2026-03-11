/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock Data for the application
export const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Ultimate React Mastery Course',
    description: 'Learn React from scratch to advanced concepts. Includes 50+ hours of video content, projects, and source code.',
    price: 99.00,
    category: 'Video Courses',
    thumbnail: 'https://picsum.photos/seed/react/800/600',
    rating: 4.8,
    reviews: 124,
    sales: 1500,
    featured: true,
    trending: true,
  },
  {
    id: '2',
    title: 'Modern SaaS Dashboard UI Kit',
    description: 'A complete UI kit for modern SaaS applications. Includes 100+ components, 10+ pages, and dark mode support.',
    price: 49.00,
    category: 'Templates',
    thumbnail: 'https://picsum.photos/seed/dashboard/800/600',
    rating: 4.9,
    reviews: 89,
    sales: 850,
    featured: true,
    trending: false,
  },
  {
    id: '3',
    title: 'Advanced TypeScript Patterns',
    description: 'An eBook covering advanced TypeScript patterns, utility types, and best practices for large-scale applications.',
    price: 29.00,
    category: 'eBooks',
    thumbnail: 'https://picsum.photos/seed/typescript/800/600',
    rating: 4.7,
    reviews: 210,
    sales: 3200,
    featured: false,
    trending: true,
  },
  {
    id: '4',
    title: 'Notion Life Planner Template',
    description: 'Organize your entire life with this comprehensive Notion template. Includes habit tracker, finance manager, and goal setting.',
    price: 19.00,
    category: 'Templates',
    thumbnail: 'https://picsum.photos/seed/notion/800/600',
    rating: 4.6,
    reviews: 45,
    sales: 400,
    featured: false,
    trending: false,
  },
  {
    id: '5',
    title: 'Fullstack Next.js Boilerplate',
    description: 'Start your next project in minutes with this production-ready Next.js boilerplate. Includes auth, db, and payments.',
    price: 149.00,
    category: 'Software',
    thumbnail: 'https://picsum.photos/seed/nextjs/800/600',
    rating: 5.0,
    reviews: 32,
    sales: 150,
    featured: true,
    trending: true,
  },
  {
    id: '6',
    title: 'Digital Marketing Playbook PDF',
    description: 'A step-by-step guide to growing your online business using proven digital marketing strategies.',
    price: 24.00,
    category: 'PDF',
    thumbnail: 'https://picsum.photos/seed/marketing/800/600',
    rating: 4.5,
    reviews: 112,
    sales: 900,
    featured: false,
    trending: false,
  }
];

export const CATEGORIES = [
  'All',
  'PDF',
  'eBooks',
  'Software',
  'Video Courses',
  'Themes',
  'Templates'
];
