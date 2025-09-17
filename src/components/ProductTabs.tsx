import React, { useState, useEffect } from 'react';
import { Package, Shield, Truck, Eye, Star, Users, Award, CheckCircle, Clock, Zap } from 'lucide-react';
import '../styles/product-tabs.css';

interface ProductTabsProps {
  product: {
    id: string;
    name: string;
    brand: string;
    description: string;
    specifications?: {
      frame_material?: string;
      lens_material?: string;
      frame_width?: string;
      lens_width?: string;
      bridge_width?: string;
      temple_length?: string;
      weight?: string;
      uv_protection?: string;
      prescription_ready?: boolean;
      gender?: string;
      style?: string;
      color?: string;
    };
  };
}

const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    {
      id: 'description',
      label: 'Descrição',
      icon: Package,
      color: 'blue',
      count: null
    },
    {
      id: 'specifications',
      label: 'Especificações',
      icon: Eye,
      color: 'purple',
      count: null
    },
    {
      id: 'care',
      label: 'Cuidados',
      icon: Shield,
      color: 'green',
      count: null
    },
    {
      id: 'shipping',
      label: 'Entrega',
      icon: Truck,
      color: 'orange',
      count: null
    },
    {
      id: 'warranty',
      label: 'Garantia',
      icon: Award,
      color: 'indigo',
      count: null
    },
    {
      id: 'reviews',
      label: 'Avaliações',
      icon: Star,
      color: 'yellow',
      count: 127
    },
  ];

  const handleTabChange = (tabId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsLoading(false);
    }, 150);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              {product.description || 'Descrição detalhada do produto não disponível.'}
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-center">
                <Eye className="h-5 w-5 text-blue-400 mr-2" />
                <p className="text-sm text-blue-700">
                  <strong>Dica:</strong> Este produto é ideal para uso diário e oferece máximo conforto e estilo.
                </p>
              </div>
            </div>
          </div>
        );

      case 'care':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <h4 className="font-bold text-green-800 text-lg">Cuidados e Manutenção</h4>
                  <p className="text-green-600">Mantenha seus óculos sempre em perfeito estado</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2">
                  Limpeza Diária
                </h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Use água morna e sabão neutro</p>
                      <p className="text-sm text-gray-600">Evite produtos químicos agressivos</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Seque com pano de microfibra</p>
                      <p className="text-sm text-gray-600">Movimentos circulares suaves</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Limpe as plaquetas nasais</p>
                      <p className="text-sm text-gray-600">Use escova macia para remover oleosidade</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-800 text-lg border-b border-gray-200 pb-2">
                  Armazenamento
                </h5>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Sempre use o estojo</p>
                      <p className="text-sm text-gray-600">Protege contra riscos e quedas</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Evite locais quentes</p>
                      <p className="text-sm text-gray-600">Calor pode deformar a armação</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Apoie com as duas hastes</p>
                      <p className="text-sm text-gray-600">Nunca deixe apoiado nas lentes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-semibold text-red-800 mb-2">⚠️ O que evitar:</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
                <ul className="space-y-1">
                  <li>• Papel higiênico ou tecidos ásperos</li>
                  <li>• Produtos de limpeza doméstica</li>
                  <li>• Água muito quente</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Deixar no painel do carro</li>
                  <li>• Usar a camiseta para limpar</li>
                  <li>• Apertar demais ao limpar</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Eye className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-800 mb-1">Dica Profissional</h5>
                  <p className="text-sm text-blue-700">
                    Faça uma revisão semestral em nossa loja. Ajustamos a armação e verificamos se está tudo em ordem, 
                    garantindo máximo conforto e durabilidade.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'specifications':
        const specs = product.specifications || {};
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                  Dimensões da Armação
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Largura da Armação:</span>
                    <span className="font-medium text-gray-900">{specs.frame_width || '140mm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Largura da Lente:</span>
                    <span className="font-medium text-gray-900">{specs.lens_width || '52mm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ponte:</span>
                    <span className="font-medium text-gray-900">{specs.bridge_width || '18mm'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Comprimento da Haste:</span>
                    <span className="font-medium text-gray-900">{specs.temple_length || '145mm'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg border-b border-gray-200 pb-2">
                  Materiais e Características
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Material da Armação:</span>
                    <span className="font-medium text-gray-900">{specs.frame_material || 'Acetato Premium'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Material da Lente:</span>
                    <span className="font-medium text-gray-900">{specs.lens_material || 'Policarbonato'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Peso:</span>
                    <span className="font-medium text-gray-900">{specs.weight || '28g'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Proteção UV:</span>
                    <span className="font-medium text-gray-900">{specs.uv_protection || '100% UV400'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Aceita Grau:</span>
                    <span className="font-medium text-gray-900">
                      {specs.prescription_ready !== false ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="spec-card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 text-center group">
                <div className="floating">
                  <Eye className="h-10 w-10 text-blue-600 mx-auto mb-3 group-hover:text-blue-700 transition-colors" />
                </div>
                <h5 className="font-bold text-blue-800 mb-2 text-lg">Gênero</h5>
                <p className="text-blue-700 font-medium">{specs.gender || 'Unissex'}</p>
              </div>
              <div className="spec-card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 text-center group">
                <div className="floating" style={{animationDelay: '0.5s'}}>
                  <Package className="h-10 w-10 text-purple-600 mx-auto mb-3 group-hover:text-purple-700 transition-colors" />
                </div>
                <h5 className="font-bold text-purple-800 mb-2 text-lg">Estilo</h5>
                <p className="text-purple-700 font-medium">{specs.style || 'Clássico'}</p>
              </div>
              <div className="spec-card bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6 text-center group">
                <div className="floating" style={{animationDelay: '1s'}}>
                  <Star className="h-10 w-10 text-green-600 mx-auto mb-3 group-hover:text-green-700 transition-colors" />
                </div>
                <h5 className="font-bold text-green-800 mb-2 text-lg">Cor</h5>
                <p className="text-green-700 font-medium">{specs.color || 'Preto'}</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <Eye className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-amber-800 mb-1">Informações Importantes</h5>
                  <p className="text-sm text-amber-700">
                    Todas as medidas são aproximadas. Para um ajuste perfeito, recomendamos uma consulta com nossos especialistas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Truck className="h-6 w-6 text-green-600 mr-3" />
                  <h4 className="font-semibold text-green-800">Entrega Expressa</h4>
                </div>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Entrega em 1-2 dias úteis</li>
                  <li>• Frete grátis acima de R$ 299</li>
                  <li>• Rastreamento em tempo real</li>
                  <li>• Seguro incluso</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Package className="h-6 w-6 text-blue-600 mr-3" />
                  <h4 className="font-semibold text-blue-800">Entrega Padrão</h4>
                </div>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Entrega em 3-5 dias úteis</li>
                  <li>• Frete a partir de R$ 15</li>
                  <li>• Rastreamento disponível</li>
                  <li>• Embalagem sustentável</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4">Informações de Entrega</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="mb-2"><strong>Horário de Entrega:</strong> 8h às 18h</p>
                  <p className="mb-2"><strong>Tentativas:</strong> Até 3 tentativas</p>
                </div>
                <div>
                  <p className="mb-2"><strong>Retirada:</strong> Disponível em lojas físicas</p>
                  <p className="mb-2"><strong>Prazo:</strong> Calculado no checkout</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'warranty':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-bold text-blue-800 text-lg">Garantia Premium de 2 Anos</h4>
                  <p className="text-blue-600">Cobertura completa contra defeitos de fabricação</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-3">O que está coberto:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Defeitos de fabricação
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Problemas nas dobradiças
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Descamação do revestimento
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Quebra espontânea das lentes
                  </li>
                </ul>
              </div>

              <div>
                <h5 className="font-semibold text-gray-800 mb-3">O que não está coberto:</h5>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Danos por mau uso
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Riscos nas lentes
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Perda ou roubo
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    Desgaste natural
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-700">
                <strong>Como acionar a garantia:</strong> Entre em contato conosco através do chat, e-mail ou telefone. 
                Tenha em mãos o número do pedido e fotos do produto.
              </p>
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border border-yellow-200 rounded-xl p-6 pulse-glow">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="star-rating mr-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div>
                    <div className="text-3xl font-bold gradient-text">4.8</div>
                    <div className="text-sm text-gray-600">baseado em 127 avaliações</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-gray-700">98% dos clientes</span>
                  </div>
                  <div className="text-sm text-gray-600">recomendam este produto</div>
                </div>
              </div>
              
              {/* Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[5,4,3,2,1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <div className="flex-1 rating-bar">
                      <div 
                        className="rating-fill" 
                        style={{width: rating === 5 ? '85%' : rating === 4 ? '12%' : '3%'}}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {rating === 5 ? '108' : rating === 4 ? '15' : '4'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  name: 'Maria Silva',
                  rating: 5,
                  date: '15 de Janeiro, 2024',
                  comment: 'Óculos de excelente qualidade! Muito confortável e o design é lindo. Recomendo!',
                  verified: true,
                  helpful: 12,
                  avatar: 'MS'
                },
                {
                  name: 'João Santos',
                  rating: 5,
                  date: '10 de Janeiro, 2024',
                  comment: 'Superou minhas expectativas. Material premium e acabamento perfeito.',
                  verified: true,
                  helpful: 8,
                  avatar: 'JS'
                },
                {
                  name: 'Ana Costa',
                  rating: 4,
                  date: '5 de Janeiro, 2024',
                  comment: 'Muito bom produto, apenas achei que poderia vir com uma case melhor.',
                  verified: true,
                  helpful: 5,
                  avatar: 'AC'
                }
              ].map((review, index) => (
                <div key={index} className="review-card bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 shadow-lg">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                        <div className="flex items-center space-x-3">
                          <div className="star-rating">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`star h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="flex items-center text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Compra Verificada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">{review.date}</div>
                      <div className="flex items-center text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        há 2 semanas
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <Zap className="h-4 w-4 mr-1" />
                      Útil ({review.helpful})
                    </button>
                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      Responder
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Users className="h-5 w-5 mr-2" />
                Ver Todas as Avaliações
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="tab-nav-container border-b border-gray-200 mb-8">
        <nav className="flex space-x-2 overflow-x-auto custom-scrollbar pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`tab-button ${isActive ? 'active' : ''} flex items-center py-4 px-6 rounded-t-lg font-semibold text-sm whitespace-nowrap transition-all duration-300 relative group`}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, var(--${tab.color}-50), var(--${tab.color}-100))` 
                    : 'transparent',
                  color: isActive 
                    ? `var(--${tab.color}-700)` 
                    : '#6b7280',
                  borderBottom: isActive 
                    ? `3px solid var(--${tab.color}-500)` 
                    : '3px solid transparent'
                }}
              >
                <Icon className={`tab-icon h-5 w-5 mr-2 transition-all duration-300`} />
                <span className="mr-2">{tab.label}</span>
                {tab.count && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    isActive ? 'bg-white text-gray-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                
                {/* Hover indicator */}
                <div className={`absolute inset-0 rounded-t-lg transition-opacity duration-300 ${
                  isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-10'
                }`} style={{background: `var(--${tab.color}-500)`}}></div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px] relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        ) : (
          <div className="tab-content">
            {renderTabContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;