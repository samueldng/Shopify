import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Package, Heart, Settings, LogOut, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  inStock: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
}

const Account: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    birthDate: '',
    gender: ''
  });
  
  const [orders] = useState<Order[]>([
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.90,
      items: [
        {
          id: '1',
          name: 'Óculos de Sol Ray-Ban Aviador',
          image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=stylish%20aviator%20sunglasses%20rayban%20style%20gold%20frame%20dark%20lenses%20product%20photography%20white%20background&image_size=square',
          quantity: 1,
          price: 299.90
        }
      ]
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'processing',
      total: 189.90,
      items: [
        {
          id: '2',
          name: 'Óculos de Grau Oakley',
          image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20prescription%20glasses%20oakley%20style%20black%20frame%20clear%20lenses%20product%20photography%20white%20background&image_size=square',
          quantity: 1,
          price: 189.90
        }
      ]
    }
  ]);
  
  const [wishlist] = useState<WishlistItem[]>([
    {
      id: '3',
      name: 'Óculos de Sol Prada',
      price: 450.00,
      originalPrice: 520.00,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20prada%20sunglasses%20cat%20eye%20style%20black%20frame%20gradient%20lenses%20product%20photography%20white%20background&image_size=square',
      brand: 'Prada',
      inStock: true
    },
    {
      id: '4',
      name: 'Óculos de Grau Gucci',
      price: 380.00,
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=designer%20gucci%20prescription%20glasses%20round%20frame%20tortoiseshell%20pattern%20product%20photography%20white%20background&image_size=square',
      brand: 'Gucci',
      inStock: false
    }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return texts[status];
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simular salvamento do perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const removeFromWishlist = (itemId: string) => {
    // Implementar remoção da lista de desejos
    toast.success('Item removido da lista de desejos');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações e pedidos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {profile.firstName || 'Usuário'} {profile.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Perfil', icon: User },
                  { id: 'orders', label: 'Pedidos', icon: Package },
                  { id: 'wishlist', label: 'Lista de Desejos', icon: Heart },
                  { id: 'settings', label: 'Configurações', icon: Settings }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === id
                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </button>
                ))}
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Informações Pessoais</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Editar</span>
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Salvando...' : 'Salvar'}</span>
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.firstName || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sobrenome
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.lastName || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <p className="text-gray-900 py-2">{profile.email}</p>
                    <p className="text-xs text-gray-500">Para alterar o e-mail, entre em contato conosco</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{profile.phone || 'Não informado'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => handleProfileChange('birthDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profile.birthDate ? formatDate(profile.birthDate) : 'Não informado'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gênero
                    </label>
                    {isEditing ? (
                      <select
                        value={profile.gender}
                        onChange={(e) => handleProfileChange('gender', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        <option value="male">Masculino</option>
                        <option value="female">Feminino</option>
                        <option value="other">Outro</option>
                        <option value="prefer-not-to-say">Prefiro não dizer</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-2">
                        {profile.gender === 'male' && 'Masculino'}
                        {profile.gender === 'female' && 'Feminino'}
                        {profile.gender === 'other' && 'Outro'}
                        {profile.gender === 'prefer-not-to-say' && 'Prefiro não dizer'}
                        {!profile.gender && 'Não informado'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Meus Pedidos</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhum pedido encontrado
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Você ainda não fez nenhum pedido
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Começar a Comprar
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-gray-900">Pedido #{order.id}</h3>
                            <p className="text-sm text-gray-600">Realizado em {formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusColor(order.status)
                            }`}>
                              {getStatusText(order.status)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                              {formatPrice(order.total)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                              </div>
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            Ver Detalhes
                          </button>
                          {order.status === 'delivered' && (
                            <button className="text-blue-600 hover:text-blue-800 font-medium">
                              Comprar Novamente
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Lista de Desejos</h2>
                
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Sua lista de desejos está vazia
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Adicione produtos que você gostaria de comprar mais tarde
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                      Explorar Produtos
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="relative mb-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeFromWishlist(item.id)}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          >
                            <X className="h-4 w-4 text-gray-600" />
                          </button>
                          {!item.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium">Fora de Estoque</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-gray-900">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                          
                          <button
                            disabled={!item.inStock}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                              item.inStock
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            {item.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações</h2>
                
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notificações</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">E-mail de promoções</p>
                          <p className="text-sm text-gray-600">Receba ofertas especiais e novidades</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Atualizações de pedido</p>
                          <p className="text-sm text-gray-600">Notificações sobre status dos pedidos</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacidade</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Perfil público</p>
                          <p className="text-sm text-gray-600">Permitir que outros vejam suas avaliações</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Conta</h3>
                    <div className="space-y-4">
                      <Link
                        to="/forgot-password"
                        className="block text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Alterar senha
                      </Link>
                      <button className="block text-red-600 hover:text-red-800 font-medium">
                        Excluir conta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;