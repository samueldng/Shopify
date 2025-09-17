import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Heart, ShoppingCart, Star, Eye, RotateCcw, ZoomIn, Share2, Truck, Shield, Award } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';
import { toast } from 'sonner';
import '../styles/quick-view.css';

// Interface Product importada do arquivo de tipos centralizados

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedImage(0);
      setQuantity(1);
      setIsImageZoomed(false);
      setActiveTab('description');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error('Faça login para adicionar à lista de desejos');
      return;
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removido da lista de desejos');
    } else {
      addToWishlist(product);
      toast.success('Adicionado à lista de desejos!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Enhanced Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Enhanced Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 border border-gray-100">
        {/* Enhanced Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white/95 hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-90 border border-gray-200"
        >
          <X className="h-6 w-6 text-gray-700" />
        </button>
        
        {/* Share Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copiado!');
          }}
          className="absolute top-6 right-20 z-20 p-3 bg-white/95 hover:bg-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
        >
          <Share2 className="h-5 w-5 text-gray-700" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Enhanced Product Images */}
          <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="space-y-6">
              {/* Main Image with Zoom */}
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-all duration-500 cursor-zoom-in ${
                    isImageZoomed ? 'scale-150' : 'group-hover:scale-110'
                  }`}
                  onClick={() => setIsImageZoomed(!isImageZoomed)}
                />
                
                {/* Zoom Indicator */}
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="h-4 w-4 inline mr-1" />
                  {isImageZoomed ? 'Clique para diminuir' : 'Clique para ampliar'}
                </div>
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <RotateCcw className="h-5 w-5 text-gray-700 rotate-90" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage < product.images.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                    >
                      <RotateCcw className="h-5 w-5 text-gray-700 -rotate-90" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Enhanced Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 transform hover:scale-105 ${
                        selectedImage === index
                          ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 shadow-md'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-200">
                  <Shield className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Garantia</div>
                  <div className="text-xs text-gray-500">2 Anos</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-200">
                  <Truck className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Entrega</div>
                  <div className="text-xs text-gray-500">Grátis</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center border border-gray-200">
                  <Award className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-xs font-medium text-gray-700">Original</div>
                  <div className="text-xs text-gray-500">100%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Info */}
          <div className="p-8 overflow-y-auto">
            <div className="space-y-6">
              {/* Enhanced Brand & Category */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.brand}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
                {product.stockCount && product.stockCount <= 10 && (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                    Apenas {product.stockCount} restantes!
                  </div>
                )}
              </div>

              {/* Enhanced Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>

              {/* Enhanced Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 transition-colors duration-200 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-sm text-gray-600">({product.reviews} avaliações)</span>
                </div>
              </div>

              {/* Enhanced Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          Economize {formatPrice(product.originalPrice - product.price)}
                        </span>
                      </div>
                    )}
                  </div>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  product.inStock ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  product.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {product.inStock ? 'Em estoque' : 'Fora de estoque'}
                </span>
                {product.stockCount && product.stockCount <= 10 && (
                  <span className="text-sm text-orange-600">
                    (Apenas {product.stockCount} restantes)
                  </span>
                )}
              </div>

              {/* Enhanced Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['description', 'features', 'specs'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab === 'description' && 'Descrição'}
                      {tab === 'features' && 'Características'}
                      {tab === 'specs' && 'Especificações'}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="min-h-[120px]">
                {activeTab === 'description' && (
                  <div className="animate-in fade-in duration-300">
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}
                
                {activeTab === 'features' && product.features && (
                  <div className="animate-in fade-in duration-300">
                    <ul className="space-y-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-700">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {activeTab === 'specs' && product.specifications && (
                  <div className="animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                          <span className="font-medium text-gray-700">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Quantity & Actions */}
              {product.inStock && (
                <div className="space-y-6 bg-gray-50 p-6 rounded-2xl">
                  {/* Enhanced Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Quantidade:</span>
                    <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-l-xl disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-5 w-5" />
                      </button>
                      <span className="px-6 py-3 min-w-[4rem] text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-r-xl"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:via-blue-600 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <ShoppingCart className="h-6 w-6" />
                      Adicionar ao Carrinho
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={handleWishlistToggle}
                        className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 transition-all duration-300 font-semibold ${
                          isInWishlist(product.id)
                            ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                            : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${
                          isInWishlist(product.id) ? 'fill-current' : ''
                        }`} />
                        {isInWishlist(product.id) ? 'Na Lista' : 'Favoritar'}
                      </button>
                      
                      <button
                        onClick={() => {
                          onClose();
                          window.location.href = `/products/${product.id}`;
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                      >
                        <Eye className="h-5 w-5" />
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;