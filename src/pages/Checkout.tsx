import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Truck, Shield, ArrowLeft, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface PaymentData {
  method: 'credit' | 'debit' | 'pix' | 'boleto';
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  installments: number;
}

const Checkout: React.FC = () => {
  const { items, getCartTotal, clearCart, getCheckoutUrl, cartId } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: 'credit',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    installments: 1
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleShippingChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentChange = (field: keyof PaymentData, value: string | number) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value as string);
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value as string);
    }
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
    return required.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '');
  };

  const validateStep2 = () => {
    if (paymentData.method === 'pix' || paymentData.method === 'boleto') {
      return true;
    }
    return paymentData.cardNumber.replace(/\s/g, '').length >= 16 &&
           paymentData.cardName.trim() !== '' &&
           paymentData.expiryDate.length === 5 &&
           paymentData.cvv.length >= 3;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else {
      toast.error('Por favor, preencha todos os campos obrigatórios');
    }
  };

  const handleFinishOrder = async () => {
    setLoading(true);
    try {
      if (!cartId) {
        toast.error('Carrinho não encontrado. Tente novamente.');
        return;
      }

      const url = await getCheckoutUrl();
      if (url) {
        setCheckoutUrl(url);
        toast.success('Redirecionando para o checkout...');
        // Redirecionar para o checkout do Shopify
        window.location.href = url;
      } else {
        toast.error('Erro ao gerar checkout. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar checkout:', error);
      toast.error('Erro ao processar checkout. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Carrinho vazio
          </h2>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao carrinho para continuar
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ir às Compras
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Carrinho
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finalizar Compra</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: 'Entrega', icon: Truck },
              { step: 2, title: 'Pagamento', icon: CreditCard },
              { step: 3, title: 'Confirmação', icon: Check }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {title}
                </span>
                {step < 3 && (
                  <div className={`ml-8 w-16 h-0.5 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Endereço de Entrega
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.firstName}
                      onChange={(e) => handleShippingChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sobrenome *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.lastName}
                      onChange={(e) => handleShippingChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={shippingAddress.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.number}
                      onChange={(e) => handleShippingChange('number', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.complement}
                      onChange={(e) => handleShippingChange('complement', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.neighborhood}
                      onChange={(e) => handleShippingChange('neighborhood', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="PR">Paraná</option>
                      <option value="SC">Santa Catarina</option>
                      {/* Adicionar outros estados */}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Forma de Pagamento
                </h2>
                
                {/* Payment Methods */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { id: 'credit', label: 'Cartão de Crédito' },
                    { id: 'debit', label: 'Cartão de Débito' },
                    { id: 'pix', label: 'PIX' },
                    { id: 'boleto', label: 'Boleto' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handlePaymentChange('method', method.id as any)}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        paymentData.method === method.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
                
                {/* Card Details */}
                {(paymentData.method === 'credit' || paymentData.method === 'debit') && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome no Cartão *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => handlePaymentChange('cardName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Validade *
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => handlePaymentChange('cvv', e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {paymentData.method === 'credit' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Parcelas
                        </label>
                        <select
                          value={paymentData.installments}
                          onChange={(e) => handlePaymentChange('installments', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              {num}x de {formatPrice(total / num)} {num === 1 ? 'à vista' : 'sem juros'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                )}
                
                {/* PIX Instructions */}
                {paymentData.method === 'pix' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Pagamento via PIX</h3>
                    <p className="text-blue-700 text-sm">
                      Após confirmar o pedido, você receberá o código PIX para pagamento.
                      O pagamento deve ser realizado em até 30 minutos.
                    </p>
                  </div>
                )}
                
                {/* Boleto Instructions */}
                {paymentData.method === 'boleto' && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-900 mb-2">Pagamento via Boleto</h3>
                    <p className="text-yellow-700 text-sm">
                      O boleto será gerado após a confirmação do pedido.
                      Prazo de vencimento: 3 dias úteis.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Confirmação do Pedido
                </h2>
                
                {/* Order Summary */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Endereço de Entrega</h3>
                    <div className="text-sm text-gray-600">
                      <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                      <p>{shippingAddress.address}, {shippingAddress.number}</p>
                      {shippingAddress.complement && <p>{shippingAddress.complement}</p>}
                      <p>{shippingAddress.neighborhood}, {shippingAddress.city} - {shippingAddress.state}</p>
                      <p>CEP: {shippingAddress.zipCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Forma de Pagamento</h3>
                    <div className="text-sm text-gray-600">
                      {paymentData.method === 'credit' && (
                        <p>Cartão de Crédito - {paymentData.installments}x de {formatPrice(total / paymentData.installments)}</p>
                      )}
                      {paymentData.method === 'debit' && <p>Cartão de Débito</p>}
                      {paymentData.method === 'pix' && <p>PIX</p>}
                      {paymentData.method === 'boleto' && <p>Boleto Bancário</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Continuar
                  </button>
                ) : (
                  <button
                    onClick={handleFinishOrder}
                    disabled={loading || !cartId}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gerando checkout...
                      </>
                    ) : (
                      <>
                        Ir para Checkout
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Resumo do Pedido
              </h2>
              
              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Totals */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">
                    {shipping === 0 ? 'Grátis' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Security Info */}
              <div className="mt-6 flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;