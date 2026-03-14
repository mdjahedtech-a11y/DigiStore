export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'PDF' | 'eBooks' | 'Software' | 'Video Courses' | 'Themes' | 'Templates';
  thumbnail: string;
  rating: number;
  reviews: number;
  sales: number;
  featured: boolean;
  trending: boolean;
  download_url?: string; // Hidden until payment (legacy)
  download_urls?: { title: string; url: string }[]; // Multiple download links
  preview_url?: string; // Google Drive preview link or similar
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
  status: 'pending' | 'success' | 'cancelled';
  payment_method: 'bKash' | 'Nagad' | 'Binance';
  sender_number: string;
  transaction_id: string;
  user_name: string;
  created_at: string;
  updated_at?: string;
  product?: Product; // Joined data
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}
