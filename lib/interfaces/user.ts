import { CartItem } from "./cart";


export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string | null;
  cart?: any[];
  createdAt: string;
  updatedAt: string;
  password?: string; // Adicionado para suportar autenticação
}