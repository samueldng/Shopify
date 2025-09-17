import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ChevronDown, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCompare } from '../contexts/CompareContext';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import QuickView from '../components/QuickView';
import { shopifyService, ShopifyProduct } from '../lib/shopify';
import { Product, Filters } from '../types';
import '../styles/products.css';

// Interfaces importadas do arquivo de tipos centralizados

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: '',
    brand: '',
    priceRange: [0, 1000],
    frameShape: '',
    frameMaterial: '',
    lensType: '',
    gender: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, filters, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const shopifyProducts = await shopifyService.getProducts(50);
      
      // Converter produtos Shopify para formato compatível
      const convertedProducts: Product[] = shopifyProducts.map((shopifyProduct: ShopifyProduct) => {
        const variant = shopifyProduct.variants[0]; // Usar primeira variante
        const price = parseFloat(variant?.price?.amount || '0');
        const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined;
        
        return {
          id: shopifyProduct.id,
          name: shopifyProduct.title,
          description: shopifyProduct.description,
          price: comparePrice || price, // Preço original
          sale_price: comparePrice ? price : undefined, // Preço promocional se houver compareAtPrice
          image_url: shopifyProduct.images[0]?.src || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20eyeglasses%20product%20photo%20white%20background&image_size=square',
          category_id: shopifyProduct.productType || 'eyewear',
          brand_id: shopifyProduct.vendor || 'brand',
          stock_quantity: variant?.available ? 10 : 0, // Shopify não retorna quantidade exata
          is_featured: shopifyProduct.tags?.includes('featured') || false,
          frame_material: shopifyProduct.tags?.find(tag => tag.includes('material:'))?.replace('material:', '') || 'Acetato',
          lens_type: shopifyProduct.tags?.find(tag => tag.includes('lens:'))?.replace('lens:', '') || 'Antirreflexo',
          frame_shape: shopifyProduct.tags?.find(tag => tag.includes('shape:'))?.replace('shape:', '') || 'Retangular',
          gender: shopifyProduct.tags?.find(tag => tag.includes('gender:'))?.replace('gender:', '') || 'Unissex',
          categories: { name: shopifyProduct.productType || 'Óculos' },
          brands: { name: shopifyProduct.vendor || 'Ótica Isis' },
          handle: shopifyProduct.handle,
          tags: shopifyProduct.tags,
          productType: shopifyProduct.productType,
          vendor: shopifyProduct.vendor
        };
      });
      
      setProducts(convertedProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos do Shopify:', error);
      // Fallback para dados mockados se Shopify falhar
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  // Função de fallback com dados mockados
  const getMockProducts = (): Product[] => {
    return [
      {
        id: 'mock-1',
        name: 'Óculos de Sol Aviador Clássico',
        description: 'Óculos de sol aviador com lentes polarizadas e proteção UV 100%. Design atemporal e elegante.',
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
        categories: { name: 'Óculos de Sol' },
        brands: { name: 'Ótica Isis' }
      },
      {
        id: 'mock-2',
        name: 'Óculos de Grau Feminino Cat Eye',
        description: 'Armação feminina em acetato com formato cat eye moderno. Ideal para uso diário.',
        price: 189.90,
        image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=cat%20eye%20glasses%20feminine%20acetate%20frame%20product%20photo%20white%20background&image_size=square',
        category_id: 'prescription',
        brand_id: 'otica-isis',
        stock_quantity: 8,
        is_featured: false,
        frame_material: 'Acetato',
        lens_type: 'Antirreflexo',
        frame_shape: 'Cat Eye',
        gender: 'Feminino',
        categories: { name: 'Óculos de Grau' },
        brands: { name: 'Ótica Isis' }
      },
      {
        id: 'mock-3',
        name: 'Óculos Esportivo Masculino',
        description: 'Óculos esportivo com armação resistente e lentes antirreflexo. Perfeito para atividades físicas.',
        price: 159.90,
        image_url: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=sport%20glasses%20masculine%20resistant%20frame%20product%20photo%20white%20background&image_size=square',
        category_id: 'sport',
        brand_id: 'otica-isis',
        stock_quantity: 12,
        is_featured: true,
        frame_material: 'TR90',
        lens_type: 'Antirreflexo',
        frame_shape: 'Retangular',
        gender: 'Masculino',
        categories: { name: 'Óculos Esportivos' },
        brands: { name: 'Ótica Isis' }
      }
    ];
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brands?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtros específicos
    if (filters.category) {
      filtered = filtered.filter(product => product.category_id === filters.category);
    }

    if (filters.brand) {
      filtered = filtered.filter(product => product.brand_id === filters.brand);
    }

    if (filters.frameShape) {
      filtered = filtered.filter(product => product.frame_shape === filters.frameShape);
    }

    if (filters.frameMaterial) {
      filtered = filtered.filter(product => product.frame_material === filters.frameMaterial);
    }

    if (filters.lensType) {
      filtered = filtered.filter(product => product.lens_type === filters.lensType);
    }

    if (filters.gender) {
      filtered = filtered.filter(product => product.gender === filters.gender);
    }

    // Filtro de preço
    filtered = filtered.filter(product => {
      const price = product.sale_price || product.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.sale_price || a.price;
          bValue = b.sale_price || b.price;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'brand':
          aValue = a.brands?.name || '';
          bValue = b.brands?.name || '';
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 1000],
      frameShape: '',
      frameMaterial: '',
      lensType: '',
      gender: ''
    });
    setSearchTerm('');
  };

  // Paginação
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleQuickView = (product: Product) => {
    // Converter o produto para o formato esperado pelo QuickView
    const quickViewProduct = {
      id: product.id,
      name: product.name,
      price: product.sale_price || product.price,
      originalPrice: product.sale_price ? product.price : undefined,
      images: [product.image_url || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20eyeglasses%20product%20photo%20white%20background&image_size=square'],
      brand: product.brands?.name || 'Marca',
      category: product.categories?.name || 'Categoria',
      description: product.description,
      rating: 4.5, // Valor padrão até implementar sistema de avaliações
      reviews: 0,
      inStock: product.stock_quantity > 0,
      stockCount: product.stock_quantity,
      features: [
        'Proteção UV 100%',
        'Lentes antirreflexo',
        'Armação resistente',
        'Design moderno'
      ],
      specifications: {
        'Material da Armação': product.frame_material || 'Não especificado',
        'Tipo de Lente': product.lens_type || 'Não especificado',
        'Formato': product.frame_shape || 'Não especificado',
        'Gênero': product.gender || 'Unissex'
      }
    };
    
    setSelectedProduct(quickViewProduct as any);
    setIsQuickViewOpen(true);
  };

  const handleWishlistToggle = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Função para busca no Shopify
  const handleShopifySearch = async (query: string) => {
    try {
      const searchResults = await shopifyService.searchProducts(query);
      const convertedResults: Product[] = searchResults.map((shopifyProduct: ShopifyProduct) => {
        const variant = shopifyProduct.variants[0];
        const price = parseFloat(variant?.price?.amount || '0');
        const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined;
        
        return {
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
          categories: { name: shopifyProduct.productType || 'Óculos' },
          brands: { name: shopifyProduct.vendor || 'Ótica Isis' },
          handle: shopifyProduct.handle,
          tags: shopifyProduct.tags,
          productType: shopifyProduct.productType,
          vendor: shopifyProduct.vendor
        };
      });
      
      setProducts(convertedResults);
    } catch (error) {
      console.error('Erro na busca Shopify:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Catálogo de Produtos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubra nossa coleção exclusiva de óculos com designs modernos e qualidade premium
            </p>
          </div>
          
          {/* Barra de busca e controles */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            {/* Busca */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar produtos, marcas ou categorias..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Busca em tempo real no Shopify se conectado
                  if (e.target.value.length > 2) {
                    handleShopifySearch(e.target.value);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Controles */}
            <div className="flex items-center gap-3">
              {/* Filtros mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filtros</span>
              </button>

              {/* Ordenação */}
              <div className="relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 font-medium text-gray-700"
                >
                  <option value="name-asc">Nome A-Z</option>
                  <option value="name-desc">Nome Z-A</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="brand-asc">Marca A-Z</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Modo de visualização */}
              <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filtros laterais */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-72 flex-shrink-0`}>
            <div className="sticky top-8">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
                onClearFilters={clearFilters}
                isOpen={showFilters}
                onToggle={() => setShowFilters(!showFilters)}
              />
            </div>
          </div>

          {/* Lista de produtos */}
          <div className="flex-1 min-w-0">
            {/* Resultados */}
            <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'Produto' : 'Produtos'} Encontrados
                  </h2>
                  <p className="text-gray-600">
                    Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} produtos
                  </p>
                </div>
                {filteredProducts.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Página {currentPage} de {totalPages}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grid/Lista de produtos */}
            {currentProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8'
                : 'space-y-6'
              }>
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onQuickView={() => handleQuickView(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-500 mb-6">Tente ajustar seus filtros ou termos de busca</p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            )}

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Anterior
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 7) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 4) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNumber = totalPages - 6 + i;
                    } else {
                      pageNumber = currentPage - 3 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => paginate(pageNumber)}
                        className={`min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNumber
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Próximo
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickView
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
};

export default Products;