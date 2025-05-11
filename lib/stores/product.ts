import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuth } from '@/lib/stores/auth';
import { Product } from '@/objects/products';

interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  isLoading: boolean;
  error: string | null;
  currentProduct: Product | null;
  
  // Fetch methods
  fetchAllProducts: () => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  fetchProductsByGender: (gender: 'men' | 'women' | 'unisex') => Promise<void>;
  searchProducts: (query: string) => Promise<void>;
  
  // CRUD methods
  createProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      featuredProducts: [],
      bestSellers: [],
      newArrivals: [],
      isLoading: false,
      error: null,
      currentProduct: null,

      // Fetch all products
      fetchAllProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch products');
          }

          const products = await response.json();
          set({ products, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch featured products
      fetchFeaturedProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products?featured=true', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch featured products');
          }

          const featuredProducts = await response.json();
          set({ featuredProducts, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch best sellers
      fetchBestSellers: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products?bestSellers=true', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch best sellers');
          }

          const bestSellers = await response.json();
          set({ bestSellers, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch new arrivals
      fetchNewArrivals: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products?newArrivals=true', {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch new arrivals');
          }

          const newArrivals = await response.json();
          set({ newArrivals, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch single product by ID
      fetchProductById: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/products?id=${id}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch product');
          }

          const product = await response.json();
          set({ currentProduct: product, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false, currentProduct: null });
          throw new Error(errorMessage);
        }
      },

      // Fetch products by category
      fetchProductsByCategory: async (category) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch products by category');
          }

          const products = await response.json();
          set({ products, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Fetch products by gender
      fetchProductsByGender: async (gender) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/products?gender=${gender}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch products by gender');
          }

          const products = await response.json();
          set({ products, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Search products
      searchProducts: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`, {
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to search products');
          }

          const products = await response.json();
          set({ products, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Create product
      createProduct: async (productData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify(productData)
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create product');
          }

          const newProduct = await response.json();
          set((state) => ({ 
            products: [...state.products, newProduct],
            isLoading: false 
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Update product
      updateProduct: async (id, productData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch('/api/products', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${useAuth.getState().token}`
            },
            body: JSON.stringify({ id, ...productData })
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update product');
          }

          const updatedProduct = await response.json();
          set((state) => ({
            products: state.products.map((product) => 
              product.id === id ? updatedProduct : product
            ),
            featuredProducts: state.featuredProducts.map((product) => 
              product.id === id ? updatedProduct : product
            ),
            bestSellers: state.bestSellers.map((product) => 
              product.id === id ? updatedProduct : product
            ),
            newArrivals: state.newArrivals.map((product) => 
              product.id === id ? updatedProduct : product
            ),
            currentProduct: state.currentProduct?.id === id ? updatedProduct : state.currentProduct,
            isLoading: false
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Delete product
      deleteProduct: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/products?id=${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${useAuth.getState().token}`
            }
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete product');
          }

          set((state) => ({
            products: state.products.filter(product => product.id !== id),
            featuredProducts: state.featuredProducts.filter(product => product.id !== id),
            bestSellers: state.bestSellers.filter(product => product.id !== id),
            newArrivals: state.newArrivals.filter(product => product.id !== id),
            currentProduct: state.currentProduct?.id === id ? null : state.currentProduct,
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
      name: 'product-storage',
      partialize: (state) => ({
        products: state.products,
        featuredProducts: state.featuredProducts,
        bestSellers: state.bestSellers,
        newArrivals: state.newArrivals
      })
    }
  )
);