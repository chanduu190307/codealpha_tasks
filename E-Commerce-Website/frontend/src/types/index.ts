// TypeScript type definitions for the e-commerce platform

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  category_id?: string | null;
  category?: Category | null;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  discount_price?: number | null;
  stock: number;
  sku?: string | null;
  images: string[];
  rating: number;
  review_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: Product | null;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  product: Product | null;
  added_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  items: WishlistItem[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  zip: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  subtotal?: number;
  discount_amount?: number;
  shipping_amount?: number;
  tax_amount?: number;
  coupon_code?: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  shipping_address: ShippingAddress;
  notes?: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment?: string | null;
  user?: Pick<User, 'id' | 'name' | 'avatar'> | null;
  is_verified_buyer?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount?: number | null;
  usage_limit?: number | null;
  times_used: number;
  expires_at?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  details?: any;
  ip_address?: string | null;
  created_at: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  total?: number;
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  category_slug?: string;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  in_stock?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  lowStock: number;
  recentOrders: Order[];
  salesChart: { date: string; revenue: number; orders: number }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
