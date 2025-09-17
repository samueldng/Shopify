import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getCartTotal, getItemCount } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      toast.success('Produto removido do carrinho');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast.success('Produto removido do carrinho');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-8" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Seu carrinho está vazio
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Adicione alguns produtos incríveis ao seu carrinho
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Carrinho de Compras
          </h1>
          <p className="text-gray-600">
            {getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'} no seu carrinho
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Produtos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Imagem do Produto */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Informações do Produto */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Preço unitário: {formatPrice(item.product.price)}
                        </p>
                      </div>
                      
                      {/* Controles de Quantidade */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-900 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Preço Total do Item */}
                        <div className="text-right min-w-0">
                          <p className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                        
                        {/* Botão Remover */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          title="Remover produto"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Botão Continuar Comprando */}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continuar Comprando
              </Link>
            </div>
          </div>
          
          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>
              
              <div className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getItemCount()} {getItemCount() === 1 ? 'item' : 'itens'})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                {/* Frete */}
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Grátis</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                
                {/* Informação sobre frete grátis */}
                {subtotal < 200 && (
                  <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                    Adicione mais {formatPrice(200 - subtotal)} para ganhar frete grátis!
                  </div>
                )}
                
                {/* Linha divisória */}
                <hr className="border-gray-200" />
                
                {/* Total */}
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Botões de Ação */}
              <div className="mt-8 space-y-4">
                <Link
                  to="/checkout"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-center block"
                >
                  Finalizar Compra
                </Link>
                
                <button className="w-full bg-yellow-500 text-yellow-900 py-3 px-4 rounded-lg font-semibold hover:bg-yellow-400 transition-colors duration-200">
                  Comprar com PayPal
                </button>
              </div>
              
              {/* Informações de Segurança */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Compra 100% segura</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Garantia de 2 anos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Troca em até 30 dias</span>
                </div>
              </div>
            </div>
            
            {/* Cupom de Desconto */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cupom de Desconto
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Digite seu cupom"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Produtos Recomendados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Você também pode gostar
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 text-center">
              Carregando produtos recomendados...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;