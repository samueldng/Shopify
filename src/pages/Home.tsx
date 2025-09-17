import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Heart, ShoppingCart, Eye, Truck, Shield, RotateCcw, Award, Sparkles } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { shopifyService } from '../lib/shopify';
import { Product, Category } from '../types';
import { supabase } from '../lib/supabase';
import '../styles/home.css';

// Interfaces importadas do arquivo de tipos centralizados

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleWishlistToggle = (productId: string) => {
    // Wishlist functionality will be implemented later
    console.log('Toggle wishlist for product:', productId);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar produtos em destaque
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          categories(name),
          brands(name)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .limit(8);

      if (productsError) throw productsError;
      setFeaturedProducts(productsData || []);

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .limit(6);

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden hero-mobile">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-rotate-slow" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3Ccircle cx='20' cy='60' r='1'/%3E%3Ccircle cx='60' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
        
        {/* Dynamic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40 animate-gradient"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-float delay-1000 opacity-40"></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-float delay-1500 opacity-30"></div>
          <div className="absolute top-2/3 right-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-float delay-800 opacity-50"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh] grid-mobile-1">
            <div className="space-y-10 lg:pr-8">
              {/* Premium Badge with Animation */}
              <div className="inline-flex items-center px-6 py-3 glass-card rounded-full text-yellow-300 text-sm font-medium mb-8 animate-fade-in-up animate-pulse-glow">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                <span className="hero-text-glow">Ótica Isis - Sua Visão em Primeiro Lugar</span>
                <Star className="w-4 h-4 ml-2 text-yellow-400" />
              </div>
              
              {/* Main Heading with Enhanced Animation */}
              <div className="space-y-6 text-mobile-center lg:text-left">
                <h1 className="text-5xl lg:text-7xl font-bold leading-[0.9] tracking-tight hero-title-mobile animate-fade-in-up delay-200">
                  <span className="block text-white animate-fade-in-up">Visão</span>
                  <span className="block bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent animate-fade-in-up delay-200 hero-text-glow animate-gradient">
                    Perfeita
                  </span>
                  <span className="block text-white text-4xl lg:text-5xl font-light mt-2 animate-fade-in-up delay-400 hero-subtitle-mobile">
                    para Cada Estilo
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-xl animate-fade-in-up delay-600 hero-description-mobile">
                  Na Ótica Isis, oferecemos óculos de qualidade superior com atendimento personalizado e as melhores marcas do mercado. 
                  <span className="block mt-2 text-lg text-amber-300 font-medium">✨ Exame de Vista Gratuito • Garantia Estendida • Atendimento Especializado</span>
                </p>
              </div>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-4 animate-fade-in-up delay-600">
                <Link
                  to="/products"
                  className="hero-cta-button group inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold rounded-xl hover:from-amber-400 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-2xl btn-mobile sm:w-auto"
                >
                  <span className="flex items-center justify-center">
                    <Eye className="mr-3 h-6 w-6" />
                    Explorar Coleção
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  to="/products?category=sunglasses"
                  className="hero-cta-button group inline-flex items-center justify-center px-10 py-4 glass-card-dark text-white border-2 border-white/20 hover:border-yellow-400/50 font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm btn-mobile sm:w-auto"
                >
                  <span className="flex items-center justify-center">
                    <Sparkles className="mr-3 h-5 w-5" />
                    Óculos de Sol
                  </span>
                </Link>
              </div>
              
              {/* Enhanced Trust Indicators */}
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 pt-8 border-t border-white/10 animate-fade-in-up delay-800">
                <div className="text-center group glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">Clientes Satisfeitos</div>
                </div>
                <div className="text-center group glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">15+</div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">Marcas Premium</div>
                </div>
                <div className="text-center group glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">2 Anos</div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">Garantia Total</div>
                </div>
                <div className="text-center group glass-card px-4 py-2 rounded-full hover:scale-105 transition-transform duration-300">
                  <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-400 transition-colors duration-300">24/7</div>
                  <div className="text-xs sm:text-sm text-gray-400 font-medium">Suporte Online</div>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-10 animate-pulse delay-500"></div>
                <div className="absolute top-1/4 -right-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-15 animate-pulse delay-1500"></div>
                
                {/* Main Image */}
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <img
                    src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20premium%20eyeglasses%20collection%20modern%20sophisticated%20optical%20display%20professional%20studio%20lighting%20elegant%20minimalist%20background&image_size=square_hd"
                    alt="Coleção Premium de Óculos"
                    className="w-full h-auto rounded-2xl shadow-xl"
                  />
                  
                  {/* Floating Product Cards */}
                  <div className="absolute -top-6 -right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 animate-float">
                    <div className="text-xs font-semibold text-gray-800">Novo</div>
                    <div className="text-sm text-gray-600">Ray-Ban Aviator</div>
                    <div className="text-lg font-bold text-gray-900">R$ 299</div>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-6 bg-black/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/10 animate-float delay-500">
                    <div className="text-xs font-semibold text-amber-400">Bestseller</div>
                    <div className="text-sm text-white">Oakley Sport</div>
                    <div className="text-lg font-bold text-white">R$ 459</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 scroll-indicator animate-fade-in-up delay-1500">
          <div className="w-8 h-12 border-2 border-white/40 rounded-full flex justify-center relative glass-card hover:border-yellow-400/60 transition-colors duration-300">
            <div className="w-2 h-4 bg-gradient-to-b from-yellow-400 to-white rounded-full mt-3 animate-pulse"></div>
          </div>
          <div className="text-white/60 text-xs mt-2 font-medium tracking-wider">SCROLL</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white section-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 grid-mobile-1 sm:grid-mobile-2">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Exame de Vista Gratuito</h3>
              <p className="text-gray-600">Consulta completa com nossos optometristas certificados</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Garantia de 2 Anos</h3>
              <p className="text-gray-600">Cobertura completa contra defeitos de fabricação</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">Receba em casa em até 3 dias úteis</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Marcas Premium</h3>
              <p className="text-gray-600">Produtos originais das melhores marcas mundiais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 section-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">
              <span className="text-luxury">Explore</span> Nossas Categorias
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-premium">
              Encontre o óculos <span className="text-accent">perfeito</span> para cada ocasião e estilo
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-mobile-1 sm:grid-mobile-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse card-mobile">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-mobile-1 sm:grid-mobile-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image_url || `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(category.name + ' eyewear category modern display')}&image_size=landscape_4_3`}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white section-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">
              <span className="text-luxury">Produtos</span> em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-premium">
              Selecionamos os <span className="text-accent">melhores produtos</span> para você
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 grid-mobile-1 sm:grid-mobile-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 grid-mobile-1 sm:grid-mobile-2">
              {featuredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onQuickView={handleQuickView}
                  // onWishlistToggle={handleWishlistToggle}
                  // isInWishlist={false}
                />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary btn-mobile sm:w-auto"
            >
              Ver Todos os Produtos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-900 text-white section-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="heading-2 mb-4">
              <span className="text-luxury">Fique por Dentro</span> das Novidades
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto text-premium">
              Receba <span className="text-accent">ofertas exclusivas</span>, lançamentos e dicas de cuidados com seus óculos
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary btn-mobile sm:w-auto"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* QuickView Modal */}
      {selectedProduct && (
        <QuickView
          product={selectedProduct}
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;