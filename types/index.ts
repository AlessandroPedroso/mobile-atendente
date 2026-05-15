export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  created_at: string;
}

export interface LoginResponse {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
  token: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  banner: string;
  disable: boolean;
  category_id: string;
  category?: Category;
  created_at: string;
}

export interface Item {
  id: string;
  amount: number;
  order_id: string;
  product_id: string;
  created_at: string;
  product: Product;
}

export interface CreateOrderRequest {
  table: string;
  name?: string;
}

export interface AddItemRequest {
  order_id: string;
  product_id: string;
  amount: number;
}

export interface SendOrderRequest {
  order_id: string;
}
