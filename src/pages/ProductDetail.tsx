import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye, Share2, ArrowLeft, Plus, Minus, Check, Truck, Shield, RotateCcw, ExternalLink, ArrowLeftRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import ProductTabs from '../components/ProductTabs';
import RelatedProducts from '../components/RelatedProducts';
import StickyAddToCart from '../components/StickyAddToCart';
import CartPopup from '../components/CartPopup';
import StockCountdown from '../components/StockCountdown';
import { shopifyService, ShopifyProduct } from '../lib/shopify';
import { Product, Review } from '../types';
import { toast } from 'sonner';
import '../styles/product-detail.css';

// Interfaces importadas do arquivo de tipos centralizados

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToCompare, isInCompare } = useCompare();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [showStickyCart, setShowStickyCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      // Show sticky cart after scrolling 50% of viewport height
      setShowStickyCart(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      
      // Tentar buscar por handle primeiro (mais comum no Shopify)
      let shopifyProduct: ShopifyProduct | null = null;
      
      if (id) {
        // Se o ID parece ser um handle (contém letras), buscar por handle
        if (isNaN(Number(id))) {
          shopifyProduct = await shopifyService.getProductByHandle(id);
        } else {
          // Caso contrário, buscar todos os produtos e filtrar por ID
          const allProducts = await shopifyService.getProducts(100);
          shopifyProduct = allProducts.find(p => p.id === id) || null;
        }
      }
      
      if (shopifyProduct) {
        // Converter produto Shopify para formato compatível
        const variant = shopifyProduct.variants[0];
        const price = parseFloat(variant?.price?.amount || '0');
        const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined;
        
        const convertedProduct: Product = {
          id: shopifyProduct.id,
          name: shopifyProduct.title,
          description: shopifyProduct.description,
          price: comparePrice || price,
          sale_price: comparePrice ? price : undefined,
          image_url: shopifyProduct.images[0]?.src || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20eyeglasses%20product%20photo%20white%20background&image_size=square',
          category_id: shopifyProduct.productType || 'eyewear',
          brand_id: shopifyProduct.vendor || 'brand',
          stock_quantity: variant?.available ? 10 : 0,
          is_featured: shopifyProduct.tags?.includes('featured') || false,
          frame_material: shopifyProduct.tags?.find(tag => tag.includes('material:'))?.replace('material:', '') || 'Acetato',
          lens_type: shopifyProduct.tags?.find(tag => tag.includes('lens:'))?.replace('lens:', '') || 'Antirreflexo',
          frame_shape: shopifyProduct.tags?.find(tag => tag.includes('shape:'))?.replace('shape:', '') || 'Retangular',
          gender: shopifyProduct.tags?.find(tag => tag.includes('gender:'))?.replace('gender:', '') || 'Unissex',
          frame_width: 140,
          lens_width: 52,
          bridge_width: 18,
          temple_length: 145,
          categories: { name: shopifyProduct.productType || 'Óculos' },
          brands: { name: shopifyProduct.vendor || 'Ótica Isis' },
          handle: shopifyProduct.handle,
          // tags: shopifyProduct.tags, // Removido pois não existe na interface Product
          // productType: shopifyProduct.productType, // Removido pois não existe na interface Product
          // vendor: shopifyProduct.vendor, // Removido pois não existe na interface Product
          // variants: shopifyProduct.variants, // Removido pois não existe na interface Product
          images: shopifyProduct.images.map(img => img.src)
        };
        
        setProduct(convertedProduct);
      } else {
        // Fallback para produto mockado se não encontrar no Shopify
        const mockProduct: Product = {
          id: id || 'mock-1',
          name: 'Óculos de Sol Aviador Clássico',
          description: 'Óculos de sol aviador com lentes polarizadas e proteção UV 100%. Design atemporal e elegante perfeito para qualquer ocasião.',
          price: 299.90,
          sale_price: 199.90,
          image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=aviator%20sunglasses%20classic%20style%20product%20photo%20white%20background&image_size=square',
          category_id: 'sunglasses',
          brand_id: 'otica-isis',
          stock_quantity: 15,
          is_featured: true,
          frame_material: 'Metal',
          lens_type: 'Polarizada',
          frame_shape: 'Aviador',
          gender: 'Unissex',
          frame_width: 140,
          lens_width: 58,
          bridge_width: 14,
          temple_length: 135,
          categories: { name: 'Óculos de Sol' },
          brands: { name: 'Ótica Isis' },
          images: [
            'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=aviator%20sunglasses%20classic%20style%20product%20photo%20white%20background&image_size=square',
            'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=aviator%20sunglasses%20side%20view%20product%20photo%20white%20background&image_size=square',
            'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=aviator%20sunglasses%20detail%20view%20product%20photo%20white%20background&image_size=square'
          ]
        };
        setProduct(mockProduct);
      }
    } catch (error) {
      console.error('Erro ao carregar produto do Shopify:', error);
      toast.error('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Por enquanto, usar avaliações mockadas até implementar sistema de reviews
      const mockReviews: Review[] = [
        {
          id: '1',
          user_name: 'Maria Silva',
          rating: 5,
          comment: 'Excelente qualidade! Muito satisfeita com a compra.',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          user_name: 'João Santos',
          rating: 4,
          comment: 'Produto muito bom, entrega rápida. Recomendo!',
          created_at: '2024-01-10T14:20:00Z'
        },
        {
          id: '3',
          user_name: 'Ana Costa',
          rating: 5,
          comment: 'Perfeito! Exatamente como esperava.',
          created_at: '2024-01-08T16:45:00Z'
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success('Produto adicionado ao carrinho!');
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removido da lista de desejos' : 'Adicionado à lista de desejos');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const productImages = [
    product?.image_url || '',
    ...(product?.images || []),
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-700">Início</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-gray-700">Produtos</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Botão Voltar */}
        <Link
          to="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao catálogo
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={productImages[selectedImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-600' : 'border-gray-200'
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
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600">{product.brands?.name}</p>
              
              {/* Avaliações */}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-gray-600">
                  ({reviews.length} avaliações)
                </span>
              </div>
            </div>

            {/* Preço */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.sale_price || product.price)}
                </span>
                {product.sale_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {product.sale_price && (
                <div className="inline-block bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  Economize {formatPrice(product.price - product.sale_price)}
                </div>
              )}
            </div>

            {/* Descrição */}
            <div>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            {product.stock_quantity !== undefined && (
              <div className="mb-6">
                <StockCountdown 
                  stock={product.stock_quantity}
                  lowStockThreshold={10}
                  showCountdown={product.stock_quantity <= 5}
                  countdownEndTime={product.stock_quantity <= 5 ? new Date(Date.now() + 48 * 60 * 60 * 1000) : undefined}
                  variant={product.stock_quantity <= 3 ? 'urgent' : product.stock_quantity <= 8 ? 'low' : 'default'}
                  showProgress={true}
                  maxStock={50}
                  animated={true}
                />
              </div>
            )}

            {/* Especificações Rápidas */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-lg">
              {product.frame_material && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Material:</span>
                  <p className="text-sm text-gray-900">{product.frame_material}</p>
                </div>
              )}
              {product.frame_shape && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Formato:</span>
                  <p className="text-sm text-gray-900">{product.frame_shape}</p>
                </div>
              )}
              {product.gender && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Gênero:</span>
                  <p className="text-sm text-gray-900">{product.gender}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-600">Estoque:</span>
                <p className="text-sm text-gray-900">{product.stock_quantity} unidades</p>
              </div>
            </div>

            {/* Quantidade e Ações */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantidade:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock_quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                    isWishlisted
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => addToCompare(product)}
                  className={`px-4 py-3 border-2 rounded-lg transition-colors ${
                    isInCompare(product.id)
                      ? 'border-blue-500 text-blue-500 bg-blue-50'
                      : 'border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500'
                  }`}
                >
                  <ArrowLeftRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">Frete grátis acima de R$ 200</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-700">Garantia de 2 anos</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-700">Troca em 30 dias</span>
              </div>
              <div className="flex items-center space-x-3">
                <Eye className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-700">Exame de vista gratuito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <ProductTabs 
            product={{
              id: product.id,
              name: product.name,
              brand: product.brands?.name || '',
              description: product.description,
              specifications: {
                frame_material: product.frame_material,
                lens_material: product.lens_type,
                frame_width: product.frame_width ? `${product.frame_width}mm` : undefined,
                lens_width: product.lens_width ? `${product.lens_width}mm` : undefined,
                bridge_width: product.bridge_width ? `${product.bridge_width}mm` : undefined,
                temple_length: product.temple_length ? `${product.temple_length}mm` : undefined,
                gender: product.gender,
                style: product.frame_shape,
                prescription_ready: true,
                uv_protection: '100% UV400',
                weight: '28g'
              }
            }}
          />
        </div>
      </div>

      {/* Sticky Add to Cart */}
      {product && (
        <StickyAddToCart
          product={product}
          isVisible={showStickyCart}
          onCartOpen={() => setIsCartOpen(true)}
        />
      )}

      {/* Cart Popup */}
      <CartPopup isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default ProductDetail;