import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Star, Eye, ArrowLeftRight, Plus, Zap, Clock } from 'lucide-react'
import { Product } from '../types'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useWishlist } from '../contexts/WishlistContext'
import { toast } from 'sonner'
import StockCountdown from './StockCountdown'
import { useCompare } from '../contexts/CompareContext'
import '../styles/product-grid.css'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
  viewMode?: 'grid' | 'list'
}

export default function ProductCard({ product, onQuickView, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCart()
  const { user } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const isListView = viewMode === 'list'

  const handleAddToCart = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    setIsAddingToCart(true)
    
    try {
      addItem(product)
      
      toast.success('Produto adicionado ao carrinho!')
    } catch (error) {
      toast.error('Erro ao adicionar produto ao carrinho')
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Faça login para adicionar à lista de desejos')
      return
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Produto removido da lista de desejos')
    } else {
      addToWishlist(product)
      toast.success('Produto adicionado à lista de desejos')
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onQuickView) {
      onQuickView(product)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-6">
        <div className="flex gap-6">
          {/* Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <img
              src={product.image_url || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20eyeglasses%20product%20photo%20white%20background&image_size=square'}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {discountPercentage > 0 && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                -{discountPercentage}%
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating!)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(0)</span> {/* review_count não existe na interface Product */}
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 disabled:from-gray-300 disabled:to-gray-300 text-black font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock_quantity === 0 ? 'Esgotado' : 'Adicionar'}
              </button>
              
              <button
                onClick={handleQuickView}
                className="p-2 bg-white border-2 border-gray-300 hover:border-amber-500 hover:bg-amber-50 rounded-lg transition-all duration-300"
              >
                <Eye className="h-5 w-5 text-gray-600 hover:text-amber-600" />
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-lg border-2 transition-all duration-300 ${
                  isInWishlist(product.id)
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`product-card group relative ${isListView ? 'flex' : ''} ${isAddingToCart ? 'loading' : ''}`}>
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className={`product-image-container relative ${isListView ? 'w-48 h-48' : ''}`}>
          <Link to={`/products/${product.id}`}>
            <img
              src={product.image_url || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20eyeglasses%20product%20photo%20white%20background&image_size=square'}
              alt={product.name}
              className="product-image"
              loading="lazy"
            />
          </Link>
          
          {/* Enhanced gradient overlay */}
          <div className="image-overlay" />
          
          {/* Enhanced discount badge */}
          {discountPercentage > 0 && (
            <div className="discount-badge">
              <Zap className="w-3 h-3 mr-1" />
              -{discountPercentage}%
            </div>
          )}
          
          {/* Stock Status */}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transform group-hover:scale-105 transition-all duration-300">
              <Clock className="w-3 h-3 mr-1 inline" />
              Últimas {product.stock_quantity}
            </div>
          )}
          
          {product.stock_quantity === 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
              Esgotado
            </div>
          )}
          
          {/* Enhanced action buttons overlay */}
          <div className="action-overlay">
            <div className="action-buttons">
              <button
                onClick={handleQuickView}
                className="action-button"
                title="Visualização rápida"
              >
                <Eye className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || isAddingToCart}
                className="action-button disabled:opacity-50 disabled:cursor-not-allowed"
                title="Adicionar ao carrinho"
              >
                {isAddingToCart ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-700" />
                )}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`action-button ${isInWishlist(product.id) ? 'active wishlist' : ''}`}
                title={isInWishlist(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Enhanced wishlist indicator */}
          {isInWishlist(product.id) && (
            <div className="wishlist-indicator" />
          )}
        </div>

        {/* Product Info */}
        <div className={`product-info ${isListView ? 'flex-1' : ''}`}>
          {/* Enhanced stock countdown */}
          {product.stock_quantity <= 10 && product.stock_quantity > 0 && (
            <div className="stock-countdown">
              <StockCountdown 
                stock={product.stock_quantity || 0}
                lowStockThreshold={5}
                variant={product.stock_quantity === 0 ? 'urgent' : product.stock_quantity <= 5 ? 'low' : 'default'}
                showCountdown={product.stock_quantity <= 10}
                countdownEndTime={product.stock_quantity <= 5 ? new Date(Date.now() + 24 * 60 * 60 * 1000) : undefined}
                showProgress={false}
                maxStock={30}
                animated={true}
              />
            </div>
          )}
          
          {/* Enhanced brand */}
          {product.brands && (
            <div className="product-brand">
              {product.brands.name}
            </div>
          )}
          
          {/* Enhanced product name */}
          <Link to={`/products/${product.id}`} className="block group/title">
            <h3 className="product-title">
              {product.name}
            </h3>
          </Link>
          
          {/* Enhanced rating */}
          {product.rating && (
            <div className="rating-container">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`rating-star ${
                      i < Math.floor(product.rating!)
                        ? 'filled'
                        : 'empty'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">(0)</span> {/* review_count não existe na interface Product */}
            </div>
          )}
          
          {/* Enhanced price */}
          <div className="price-container">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="price-current">
                  {formatPrice(product.price)}
                </span>
                <span className="price-original">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="price-discount text-sm font-semibold">
                  Economize {formatPrice(product.originalPrice - product.price)}
                </span>
              </>
            ) : (
              <span className="price-current">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Category with icon */}
          {product.categories && (
            <div className="text-sm text-gray-600 mb-4 capitalize flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              {product.categories.name}
            </div>
          )}
        </div>
      </Link>
      
      {/* Enhanced add to cart button */}
      <div className="p-5 pt-0">
        <button
          onClick={handleAddToCart}
          disabled={product.stock_quantity === 0 || isAddingToCart}
          className="add-to-cart-btn"
        >
          {isAddingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Adicionando...</span>
            </>
          ) : product.stock_quantity === 0 ? (
            <span>Produto Esgotado</span>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
              <span>Adicionar ao Carrinho</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}