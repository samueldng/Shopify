import React from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import { useCompare } from '../contexts/CompareContext';

const CompareFloatingButton: React.FC = () => {
  const { compareList, setIsCompareOpen, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Comparar</span>
          </div>
          <button
            onClick={clearCompare}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Limpar comparação"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 mb-4">
          {compareList.map((product, index) => (
            <div key={product.id} className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-12 h-12 object-cover rounded-lg border-2 border-gray-200"
              />
              {index < compareList.length - 1 && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: 3 - compareList.length }).map((_, index) => (
            <div key={`empty-${index}`} className="relative">
              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-xs">+</span>
              </div>
              {index < 3 - compareList.length - 1 && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-0.5 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {compareList.length} de 3 produtos selecionados
          </div>
          
          <button
            onClick={() => setIsCompareOpen(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Comparar Produtos
          </button>
          
          {compareList.length < 3 && (
            <div className="text-xs text-gray-500 text-center">
              Adicione mais produtos para comparar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompareFloatingButton;