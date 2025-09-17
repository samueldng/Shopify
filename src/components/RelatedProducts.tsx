import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import { shopifyService } from '../lib/shopify';

interface RelatedProductsProps {
  currentProduct: Product;
  onQuickView?: (product: Product) => void;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProduct, onQuickView }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const shopifyProducts = await shopifyService.getProducts();
        
        // Filtrar produtos relacionados (mesma categoria ou marca, excluindo o produto atual)
        const related = shopifyProducts
          .filter(p => p.id !== currentProduct.id)
          .filter(p => 
            // Filtrar produtos relacionados (simplificado)
            true // Por enquanto, mostrar produtos aleatórios
          )
          .slice(0, 4)
          .map(shopifyProduct => {
            const variant = shopifyProduct.variants?.[0];
            return {
              id: shopifyProduct.id,
              name: shopifyProduct.title,
              description: shopifyProduct.description || '',
              price: variant ? parseFloat(variant.price.amount) : 0,
              sale_price: variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
              image_url: shopifyProduct.images?.[0]?.src || '/placeholder-product.jpg',
              images: shopifyProduct.images?.map(img => img.src) || ['/placeholder-product.jpg'],
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
              productType: shopifyProduct.productType,
              vendor: shopifyProduct.vendor
            };
          });
        
        setRelatedProducts(related);
      } catch (error) {
        console.error('Erro ao buscar produtos relacionados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Produtos Relacionados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;