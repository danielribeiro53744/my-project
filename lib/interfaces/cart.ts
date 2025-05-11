import { Product } from "@/objects/products"

export interface CartItem {
  id?: string;
  product: Product
  quantity: number
  size: string
}

export type Cart = {
    items: CartItem[];
    total: number;
  };