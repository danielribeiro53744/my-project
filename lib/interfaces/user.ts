import { CartItem } from "./cart";


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  cart?: CartItem[];
  image?: string; // URL or base64 string for profile image
}