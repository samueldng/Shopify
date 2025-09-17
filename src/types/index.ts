// Tipos centralizados para o projeto

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price?: number;
  originalPrice?: number;
  image_url: string;
  images?: string[];
  category_id: string;
  brand_id: string;
  brand?: string;
  category?: string;
  stock_quantity: number;
  stockCount?: number;
  is_featured: boolean;
  inStock?: boolean;
  frame_material?: string;
  lens_type?: string;
  frame_shape?: string;
  gender?: string;
  frame_width?: number;
  lens_width?: number;
  bridge_width?: number;
  temple_length?: number;
  categories?: { name: string };
  brands?: { name: string };
  handle?: string;
  slug?: string;
  sku?: string;
  rating?: number;
  reviews?: number;
  features?: string[];
  specifications?: { [key: string]: string };
  // Shopify specific fields
  shopify_id?: string;
  variant_id?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  variant_id?: string;
  shopify_line_id?: string;
}

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface Filters {
  categories?: string[];
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  onSale?: boolean;
  category?: string;
  brand?: string;
  priceRange?: [number, number];
  frameShape?: string;
  frameMaterial?: string;
  lensType?: string;
  gender?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand: string;
  inStock: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentData {
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}