export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  rating: number;
  reviews: number;
  sales: number;
  featured: boolean;
  trending: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'affiliate';
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}
