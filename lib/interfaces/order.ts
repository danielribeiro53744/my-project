import { CartItem } from "./cart";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  paymentIntentId?: string;  //stripe
  createdAt: string;
}