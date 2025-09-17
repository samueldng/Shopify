import React, { createContext, useContext, useEffect, useState } from 'react'
import { shopifyService, ShopifyProduct } from '../lib/shopify'
import { useAuth } from './AuthContext'
import { Product, CartItem } from '../types'
import { toast } from 'sonner'

// Interfaces importadas do arquivo de tipos centralizados

interface CartContextType {
  items: CartItem[]
  loading: boolean
  totalItems: number
  totalPrice: number
  cartId: string | null
  checkoutUrl: string | null
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  getCheckoutUrl: () => string | null
  getItemCount: () => number
  getCartTotal: () => number
  addToCart: (product: Product, quantity?: number) => Promise<void> // Alias para compatibilidade
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: React.ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [cartId, setCartId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = item.product.sale_price || item.product.price
    return sum + (price * item.quantity)
  }, 0)

  // Load cart items when component mounts or user changes
  useEffect(() => {
    initializeCart()
  }, [user])

  const initializeCart = async () => {
    // Verificar se já existe um cart ID no localStorage
    const savedCartId = localStorage.getItem('shopify_cart_id')
    
    if (savedCartId) {
      setCartId(savedCartId)
      await refreshCart(savedCartId)
    } else {
      // Criar novo carrinho
      await createNewCart()
    }
  }

  const createNewCart = async () => {
    try {
      const cart = await shopifyService.createCart()
      setCartId(cart.id)
      setCheckoutUrl(cart.webUrl)
      localStorage.setItem('shopify_cart_id', cart.id)
      setItems([])
    } catch (error) {
      console.error('Erro ao criar carrinho:', error)
      // Fallback para carrinho local
      setItems([])
    }
  }

  const refreshCart = async (currentCartId?: string) => {
    const targetCartId = currentCartId || cartId
    if (!targetCartId) return

    setLoading(true)
    try {
      const cart = await shopifyService.getCart(targetCartId)
      
      if (cart && cart.lineItems) {
        // Converter linhas do carrinho Shopify para formato compatível
        const cartItems: CartItem[] = await Promise.all(
          cart.lineItems.map(async (line: any) => {
            // Buscar detalhes do produto
            let product: Product
            
            try {
              const shopifyProduct = await shopifyService.getProductByHandle(line.merchandise.product.handle)
              
              if (shopifyProduct) {
                const variant = shopifyProduct.variants.find(v => v.id === line.merchandise.id) || shopifyProduct.variants[0]
                const price = parseFloat(variant?.price?.amount || '0')
                const comparePrice = variant?.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined
                
                product = {
                  id: shopifyProduct.id,
                  name: shopifyProduct.title,
                  description: shopifyProduct.description,
                  price: comparePrice || price,
                  sale_price: comparePrice ? price : undefined,
                  image_url: shopifyProduct.images[0]?.src || '',
                  category_id: shopifyProduct.productType || 'eyewear',
                  brand_id: shopifyProduct.vendor || 'brand',
                  stock_quantity: variant?.available ? 10 : 0,
                  is_featured: false,
                  categories: { name: shopifyProduct.productType || 'Óculos' },
                  brands: { name: shopifyProduct.vendor || 'Ótica Isis' },
                  handle: shopifyProduct.handle,
                  // variants: shopifyProduct.variants // Removido pois não existe na interface Product
                }
              } else {
                // Produto mockado como fallback
                product = {
                  id: line.merchandise.product.id,
                  name: line.merchandise.product.title,
                  description: 'Produto da Ótica Isis',
                  price: parseFloat(line.merchandise.price.amount),
                  image_url: line.merchandise.image?.url || '',
                  category_id: 'eyewear',
                  brand_id: 'otica-isis',
                  stock_quantity: 10,
                  is_featured: false,
                  categories: { name: 'Óculos' },
                  brands: { name: 'Ótica Isis' }
                }
              }
            } catch (error) {
              console.error('Erro ao buscar produto:', error)
              // Fallback básico
              product = {
                id: line.merchandise.product.id,
                name: line.merchandise.product.title,
                description: 'Produto da Ótica Isis',
                price: parseFloat(line.merchandise.price.amount),
                image_url: line.merchandise.image?.url || '',
                category_id: 'eyewear',
                brand_id: 'otica-isis',
                stock_quantity: 10,
                is_featured: false,
                categories: { name: 'Óculos' },
                brands: { name: 'Ótica Isis' }
              }
            }
            
            return {
              id: line.id,
              product_id: line.merchandise.product.id,
              quantity: line.quantity,
              product,
              variant_id: line.merchandise.id,
              shopify_line_id: line.id
            }
          })
        )
        
        setItems(cartItems)
        setCheckoutUrl(cart.webUrl)
      } else {
        setItems([])
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho do Shopify:', error)
      // Manter itens atuais em caso de erro
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (product: Product, quantity = 1) => {
    try {
      // Garantir que temos um carrinho
      let currentCartId = cartId
      if (!currentCartId) {
        await createNewCart()
        currentCartId = cartId
      }

      if (!currentCartId) {
        toast.error('Erro ao criar carrinho')
        return
      }

      // Verificar se o produto já existe no carrinho
      const existingItem = items.find(item => item.product_id === product.id)

      if (existingItem) {
        // Atualizar quantidade
        await updateQuantity(product.id, existingItem.quantity + quantity)
      } else {
        // Adicionar novo item
        // Buscar variant ID do produto
        // Usar o primeiro variant disponível do produto Shopify
         const shopifyProduct = await shopifyService.getProductByHandle(product.handle)
         let variantId = shopifyProduct?.variants?.[0]?.id
        
        if (!variantId && product.handle) {
          try {
            const shopifyProduct = await shopifyService.getProductByHandle(product.handle)
            variantId = shopifyProduct?.variants[0]?.id
          } catch (error) {
            console.error('Erro ao buscar variant:', error)
          }
        }

        if (!variantId) {
          toast.error('Produto não disponível para compra')
          return
        }

        const updatedCart = await shopifyService.addToCart(currentCartId, variantId, quantity)

        if (updatedCart) {
          setCheckoutUrl(updatedCart.webUrl)
          toast.success('Produto adicionado ao carrinho!')
          await refreshCart(currentCartId)
        } else {
          toast.error('Erro ao adicionar produto ao carrinho')
        }
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error)
      toast.error('Erro ao adicionar produto ao carrinho')
    }
  }

  const removeItem = async (productId: string) => {
    if (!cartId) return

    try {
      const item = items.find(item => item.product_id === productId)
      if (!item || !item.shopify_line_id) {
        toast.error('Item não encontrado no carrinho')
        return
      }

      const updatedCart = await shopifyService.removeFromCart(cartId, item.shopify_line_id)
      
      if (updatedCart) {
        setCheckoutUrl(updatedCart.webUrl)
        toast.success('Produto removido do carrinho')
        await refreshCart(cartId)
      } else {
        toast.error('Erro ao remover produto do carrinho')
      }
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error)
      toast.error('Erro ao remover produto do carrinho')
    }
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!cartId) return

    if (quantity <= 0) {
      await removeItem(productId)
      return
    }

    try {
      const item = items.find(item => item.product_id === productId)
      if (!item || !item.shopify_line_id) {
        toast.error('Item não encontrado no carrinho')
        return
      }

      const updatedCart = await shopifyService.updateCartItem(cartId, item.shopify_line_id, quantity)

      if (updatedCart) {
        setCheckoutUrl(updatedCart.webUrl)
        await refreshCart(cartId)
      } else {
        toast.error('Erro ao atualizar quantidade')
      }
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error)
      toast.error('Erro ao atualizar quantidade')
    }
  }

  const clearCart = async () => {
    try {
      // Criar novo carrinho (efetivamente limpa o atual)
      await createNewCart()
      toast.success('Carrinho limpo')
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error)
      toast.error('Erro ao limpar carrinho')
    }
  }

  const getCheckoutUrl = () => {
    return checkoutUrl
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const value = {
    items,
    loading,
    totalItems,
    totalPrice,
    cartId,
    checkoutUrl,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    refreshCart,
    getCheckoutUrl,
    getItemCount,
    getCartTotal,
    addToCart: addItem // Alias para compatibilidade
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}