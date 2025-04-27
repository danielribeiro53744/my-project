// types.ts
export type CartItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
  };
  
  export type Cart = {
    items: CartItem[];
    total: number;
  };