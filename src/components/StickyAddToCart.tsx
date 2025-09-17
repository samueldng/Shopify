import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';
import { toast } from 'sonner';
import '../styles/sticky-add-to-cart.css';

// Interface Product importada do arquivo de tipos centralizados

interface StickyAddToCartProps {
  product: Product;
  isVisible: boolean;
  onCartOpen?: () => void;
}

const StickyAddToCart: React.FC<StickyAddToCartProps> = ({ product, isVisible, onCartOpen }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (product.stock_quantity < quantity) {
      toast.error('Quantidade não disponível em estoque');
      return;
    }

    addItem(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
    
    // Open cart popup after adding item
    if (onCartOpen) {
      setTimeout(() => {
        onCartOpen();
      }, 500);
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Faça login para adicionar à lista de desejos');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removido da lista de desejos');
    } else {
      addToWishlist(product);
      toast.success('Adicionado à lista de desejos');
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const currentPrice = product.sale_price || product.price;
  const originalPrice = product.sale_price ? product.price : null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      {/* Background Blur */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Product Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  R$ {currentPrice.toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    R$ {originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock_quantity}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isInWishlist(product.id)
                  ? 'border-red-500 bg-red-50 text-red-500'
                  : 'border-gray-300 hover:border-red-400 hover:text-red-500 text-gray-600'
              }`}
              title={isInWishlist(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="hidden sm:inline">
                {product.stock_quantity === 0 ? 'Esgotado' : 'Adicionar'}
              </span>
            </button>
          </div>
        </div>

        {/* Stock Warning */}
        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
          <div className="mt-2 text-center">
            <span className="text-sm text-orange-600 font-medium">
              ⚠️ Apenas {product.stock_quantity} unidades restantes!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyAddToCart;