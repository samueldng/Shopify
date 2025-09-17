import React from 'react';
import { X, ArrowRight, ShoppingCart, Heart, Star } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import '../styles/product-compare.css';

const ProductCompare: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useCompare();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  const specifications = [
    { key: 'brand', label: 'Marca' },
    { key: 'frame_material', label: 'Material da Armação' },
    { key: 'lens_type', label: 'Tipo de Lente' },
    { key: 'frame_shape', label: 'Formato' },
    { key: 'gender', label: 'Gênero' },
    { key: 'frame_width', label: 'Largura da Armação', unit: 'mm' },
    { key: 'lens_width', label: 'Largura da Lente', unit: 'mm' },
    { key: 'bridge_width', label: 'Largura da Ponte', unit: 'mm' },
    { key: 'temple_length', label: 'Comprimento da Haste', unit: 'mm' }
  ];

  if (!isCompareOpen) return null;

  return (
    <div className="product-compare-overlay">
      <div className="product-compare-container">
        <div className="min-h-screen p-4">
          <div className="product-compare-modal">
            {/* Header */}
            <div className="product-compare-header">
              <div>
                <h2 className="product-compare-title">Comparar Produtos</h2>
                <p className="product-compare-subtitle">
                  {compareList.length} de 3 produtos selecionados
                </p>
              </div>
              <div className="product-compare-actions">
                {compareList.length > 0 && (
                  <button
                    onClick={clearCompare}
                    className="clear-all-btn"
                  >
                    Limpar Tudo
                  </button>
                )}
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="close-btn"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {compareList.length === 0 ? (
              /* Empty State */
              <div className="empty-state">
                <div className="empty-state-icon">
                  <ArrowRight className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="empty-state-title">
                  Nenhum produto para comparar
                </h3>
                <p className="empty-state-description">
                  Adicione produtos à comparação para ver as diferenças lado a lado
                </p>
                <button
                  onClick={() => setIsCompareOpen(false)}
                  className="continue-shopping-btn"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              /* Comparison Table */
              <div className="overflow-x-auto">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <td className="p-6 w-48">
                        <div className="text-lg font-semibold text-gray-900">Produtos</div>
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="product-header-cell">
                          <button
                            onClick={() => removeFromCompare(product.id)}
                            className="remove-product-btn"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="space-y-4">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="product-image"
                            />
                            <div>
                              <h3 className="product-name">
                                {product.name}
                              </h3>
                              <div className="space-y-2">
                                <div className="price-container">
                                  {product.sale_price ? (
                                    <>
                                      <span className="sale-price">
                                        {formatPrice(product.sale_price)}
                                      </span>
                                      <span className="original-price">
                                        {formatPrice(product.price)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="regular-price">
                                      {formatPrice(product.price)}
                                    </span>
                                  )}
                                </div>
                                <div className="product-actions">
                                  <button
                                    onClick={() => handleAddToCart(product)}
                                    className="buy-btn"
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Comprar</span>
                                  </button>
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="details-link"
                                  >
                                    Ver Detalhes
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map((spec) => {
                      // Check if values differ to highlight differences
                      const values = compareList.map(product => (product as any)[spec.key]);
                      const hasDifferences = new Set(values.filter(v => v)).size > 1;
                      
                      return (
                        <tr key={spec.key} className={`spec-row ${hasDifferences ? 'spec-highlight' : ''}`}>
                          <td className="spec-label">
                            {spec.label}
                          </td>
                          {compareList.map((product) => {
                            const value = (product as any)[spec.key];
                            return (
                              <td key={product.id} className="spec-value">
                                {value ? (
                                  <span>
                                    {value}
                                    {spec.unit && ` ${spec.unit}`}
                                  </span>
                                ) : (
                                  <span className="spec-value-missing">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    
                    {/* Stock Status */}
                    <tr className="spec-row">
                      <td className="spec-label">
                        Estoque
                      </td>
                      {compareList.map((product) => (
                        <td key={product.id} className="spec-value">
                          {product.stock_quantity !== undefined ? (
                            <span className={`stock-badge ${
                              product.stock_quantity === 0
                                ? 'stock-out'
                                : product.stock_quantity <= 5
                                ? 'stock-low'
                                : 'stock-available'
                            }`}>
                              {product.stock_quantity === 0
                                ? 'Esgotado'
                                : product.stock_quantity <= 5
                                ? `Apenas ${product.stock_quantity}`
                                : 'Em estoque'
                              }
                            </span>
                          ) : (
                            <span className="spec-value-missing">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCompare;