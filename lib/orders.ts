import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth } from '@/lib/auth';
import { CartItem } from './cart';

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

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrdersByUser: (userId: string) => Promise<void>;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      isLoading: false,
      error: null,

      fetchOrders: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/orders', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch orders');
          }

          const orders = await response.json();
          set({ orders, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      fetchOrdersByUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/orders/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user orders');
          }

          const userOrders = await response.json();
          set({ orders: userOrders, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      createOrder: async (orderData) => {
        set({ isLoading: true, error: null });
        try {
          console.log('createeeee')
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify(orderData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
          }

          const newOrder = await response.json();
          set((state) => ({ orders: [...state.orders, newOrder], isLoading: false }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`http://localhost:3000/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify({ status })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update order status');
          }

          const updatedOrder = await response.json();
          set((state) => ({
            orders: state.orders.map((order) => order.id === orderId ? updatedOrder : order),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      deleteOrder: async (orderId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete order');
          }

          set((state) => ({
            orders: state.orders.filter(order => order.id !== orderId),
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      }

    }),
    {
      name: 'order-storage'
    }
  )
);
