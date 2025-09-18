import Client from 'shopify-buy';

// Configuração do cliente Shopify
// IMPORTANTE: Configure suas credenciais no arquivo .env
const shopifyConfig = {
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '5b813100797e5a0bbce8bf21d862cdd4',
  domain: import.meta.env.VITE_SHOPIFY_DOMAIN || 'your-store.myshopify.com'
};

// Cliente Shopify para acessar a Storefront API
export const shopifyClient = Client.buildClient({
  storefrontAccessToken: shopifyConfig.storefrontAccessToken,
  domain: shopifyConfig.domain
});

// Tipos para produtos Shopify
export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    src: string;
    altText?: string;
  }[];
  variants: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    compareAtPrice?: {
      amount: string;
      currencyCode: string;
    };
    available: boolean;
  }[];
  tags: string[];
  productType: string;
  vendor: string;
}

// Tipos para carrinho Shopify
export interface ShopifyCart {
  id: string;
  webUrl: string;
  lineItems: {
    id: string;
    quantity: number;
    variant: {
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      product: {
        title: string;
        handle: string;
        images: {
          src: string;
        }[];
      };
    };
  }[];
  subtotalPrice: {
    amount: string;
    currencyCode: string;
  };
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
}

// Serviços para interagir com Shopify
export class ShopifyService {
  private client = shopifyClient;

  // Buscar todos os produtos
  async getProducts(first: number = 20): Promise<ShopifyProduct[]> {
    try {
      const products = await this.client.product.fetchAll(first);
      return products.map(this.transformProduct);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  // Buscar produto por handle
  async getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
    try {
      const product = await this.client.product.fetchByHandle(handle);
      return product ? this.transformProduct(product) : null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  }

  // Buscar produtos por query
  async searchProducts(query: string): Promise<ShopifyProduct[]> {
    try {
      const products = await this.client.product.fetchQuery({
        query: `title:*${query}* OR tag:*${query}* OR product_type:*${query}*`,
        first: 20
      });
      return products.map(this.transformProduct);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
    }
  }

  // Criar carrinho
  async createCart(): Promise<ShopifyCart | null> {
    try {
      const cart = await this.client.checkout.create();
      return this.transformCart(cart);
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      return null;
    }
  }

  // Adicionar item ao carrinho
  async addToCart(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart | null> {
    try {
      const lineItemsToAdd = [{
        variantId,
        quantity
      }];
      const cart = await this.client.checkout.addLineItems(cartId, lineItemsToAdd);
      return this.transformCart(cart);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      return null;
    }
  }

  // Atualizar quantidade no carrinho
  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<ShopifyCart | null> {
    try {
      const lineItemsToUpdate = [{
        id: lineItemId,
        quantity
      }];
      const cart = await this.client.checkout.updateLineItems(cartId, lineItemsToUpdate);
      return this.transformCart(cart);
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
      return null;
    }
  }

  // Remover item do carrinho
  async removeFromCart(cartId: string, lineItemId: string): Promise<ShopifyCart | null> {
    try {
      const cart = await this.client.checkout.removeLineItems(cartId, [lineItemId]);
      return this.transformCart(cart);
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      return null;
    }
  }

  // Buscar carrinho existente
  async getCart(cartId: string): Promise<ShopifyCart | null> {
    try {
      const cart = await this.client.checkout.fetch(cartId);
      return this.transformCart(cart);
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      return null;
    }
  }

  // Transformar produto Shopify para nosso formato
  private transformProduct(product: any): ShopifyProduct {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      handle: product.handle,
      images: product.images.map((img: any) => ({
        src: img.src,
        altText: img.altText
      })),
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        price: {
          amount: variant.price.amount,
          currencyCode: variant.price.currencyCode
        },
        compareAtPrice: variant.compareAtPrice ? {
          amount: variant.compareAtPrice.amount,
          currencyCode: variant.compareAtPrice.currencyCode
        } : undefined,
        available: variant.available
      })),
      tags: product.tags,
      productType: product.productType,
      vendor: product.vendor
    };
  }

  // Transformar carrinho Shopify para nosso formato
  private transformCart(cart: any): ShopifyCart {
    return {
      id: cart.id,
      webUrl: cart.webUrl,
      lineItems: cart.lineItems.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
        variant: {
          id: item.variant.id,
          title: item.variant.title,
          price: {
            amount: item.variant.price.amount,
            currencyCode: item.variant.price.currencyCode
          },
          product: {
            title: item.variant.product.title,
            handle: item.variant.product.handle,
            images: item.variant.product.images.map((img: any) => ({
              src: img.src
            }))
          }
        }
      })),
      subtotalPrice: {
        amount: cart.subtotalPrice.amount,
        currencyCode: cart.subtotalPrice.currencyCode
      },
      totalPrice: {
        amount: cart.totalPrice.amount,
        currencyCode: cart.totalPrice.currencyCode
      }
    };
  }
}

// Instância singleton do serviço
export const shopifyService = new ShopifyService();