import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, ShoppingCart, Check } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: any;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { addToCart, items } = useCart();
  const isInCart = items.some(item => item.id === product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-xl',
        className
      )}
    >
      <Link to={`/product/${product.id}`} className="block aspect-[4/3] overflow-hidden relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm">
            {product.category}
          </span>
          {product.featured && (
            <span className="rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          )}
        </div>
      </Link>
      
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-slate-700">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs">
            <Download className="h-3 w-3" />
            <span>{product.sales} sales</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-slate-900 line-clamp-1 mb-1 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          <Button 
            size="sm" 
            variant={isInCart ? "outline" : "gradient"} 
            className="gap-2"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            {isInCart ? (
              <>
                <Check className="h-4 w-4" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
