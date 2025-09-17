import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lybalfzprfsfkxwqftnk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5YmFsZnpwcmZzZmt4d3FmdG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjA3MjgsImV4cCI6MjA3MzY5NjcyOH0.aSc1D26MDnRdVhsR2nWaihdIQTtHNxbTyHrRdv2_Z6A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  category_id: string
  brand_id: string
  images: string[]
  specifications: Record<string, any>
  features: string[]
  is_featured: boolean
  is_active: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
  category?: Category
  brand?: Brand
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total_amount: number
  shipping_address: Record<string, any>
  billing_address: Record<string, any>
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  rating: number
  title: string
  comment: string
  is_verified: boolean
  created_at: string
  updated_at: string
  user?: User
}