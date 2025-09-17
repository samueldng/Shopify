import React, { useState, useEffect } from 'react';
import { X, Mail, Gift, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast.success('Obrigado! Você receberá ofertas exclusivas em breve!');
      
      // Store in localStorage to prevent showing again
      localStorage.setItem('newsletter_subscribed', 'true');
      localStorage.setItem('newsletter_email', email);
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setEmail('');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Store that user dismissed the popup
    localStorage.setItem('newsletter_dismissed', Date.now().toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-500 scale-100 animate-in slide-in-from-bottom-4">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full transform -translate-x-12 translate-y-12" />

        <div className="relative p-8">
          {!isSuccess ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Oferta Especial! 🎉
                </h2>
                
                <p className="text-gray-600 leading-relaxed">
                  Cadastre-se e ganhe <span className="font-bold text-blue-600">15% de desconto</span> na sua primeira compra + frete grátis!
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Ofertas exclusivas semanais</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Acesso antecipado a novos produtos</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700">Dicas de estilo e tendências</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor email"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Quero Meu Desconto!</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Não enviamos spam. Você pode cancelar a qualquer momento.
              </p>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Bem-vindo(a)! 🎉
              </h2>
              
              <p className="text-gray-600 mb-4">
                Seu cupom de <span className="font-bold text-green-600">15% OFF</span> foi enviado para:
              </p>
              
              <p className="font-semibold text-gray-900 bg-gray-100 px-4 py-2 rounded-lg">
                {email}
              </p>
              
              <p className="text-sm text-gray-500 mt-4">
                Verifique sua caixa de entrada (e spam) em alguns minutos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;