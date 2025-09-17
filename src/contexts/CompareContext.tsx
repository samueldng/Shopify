import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number;
  image_url: string;
  brand?: string;
  frame_material?: string;
  lens_type?: string;
  frame_shape?: string;
  gender?: string;
  frame_width?: number;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  stock_quantity?: number;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

interface CompareProviderProps {
  children: ReactNode;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 3) {
      toast.error('Você pode comparar no máximo 3 produtos');
      return;
    }

    if (isInCompare(product.id)) {
      toast.info('Este produto já está na comparação');
      return;
    }

    setCompareList(prev => [...prev, product]);
    toast.success(`${product.name} adicionado à comparação`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(product => product.id !== productId));
    toast.success('Produto removido da comparação');
  };

  const clearCompare = () => {
    setCompareList([]);
    toast.success('Comparação limpa');
  };

  const isInCompare = (productId: string) => {
    return compareList.some(product => product.id === productId);
  };

  const value: CompareContextType = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    isCompareOpen,
    setIsCompareOpen
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareContext;