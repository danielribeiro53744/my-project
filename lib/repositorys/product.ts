import { db } from "@vercel/postgres";
import { Product } from "../interfaces/products";



export const ProductRepository = {
  async getProductById(id: string): Promise<Product | null> {
    const client = await db.connect();
    try {
      const { rows } = await client.sql`SELECT * FROM Products WHERE id = ${id} LIMIT 1`;
       // If no product found, return null
      if (!rows[0]) return null;
      
      // Convert database colors format if needed (assuming colors is stored as JSONB)
      const product = rows[0];
      if (product.colors && typeof product.colors === 'string') {
        product.colors = JSON.parse(product.colors);
      }
      
      return product as Product;
    } finally {
      client.release();
    }
  },

  async getProducts(filters: {
    category?: string;
    gender?: string;
    featured?: boolean;
    newArrivals?: boolean;
    bestSellers?: boolean;
    search?: string;
  }): Promise<Product[]> {
    const client = await db.connect();
    try {
      let query = 'SELECT * FROM Products WHERE 1=1';
      const params = [];

      if (filters.category) {
        query += ' AND category = $1';
        params.push(filters.category);
      }

      if (filters.gender) {
        query += ' AND (gender = $' + (params.length + 1) + ' OR gender = \'unisex\')';
        params.push(filters.gender);
      }

      if (filters.featured) {
        query += ' AND featured = true';
      }

      if (filters.newArrivals) {
        query += ' AND is_new_arrival = true';
      }

      if (filters.bestSellers) {
        query += ' AND is_best_seller = true';
      }

      if (filters.search) {
        query += ' AND (LOWER(name) LIKE $' + (params.length + 1) + 
                 ' OR LOWER(description) LIKE $' + (params.length + 1) + 
                 ' OR LOWER(category) LIKE $' + (params.length + 1) + ')';
        params.push(`%${filters.search.toLowerCase()}%`);
      }

      const { rows } = await client.query(query, params);
      return rows;
    } finally {
      client.release();
    }
  },

  
  async createProduct(productData: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const client = await db.connect();
    try {
      const productId = productData.id || crypto.randomUUID();
      const createdAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();

      const { rows } = await client.query<Product>(`
        INSERT INTO Products (
          id, name, description, price, discount_price, category, gender,
          sizes, colors, images, featured, is_best_seller, is_new_arrival,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7,
          $8, $9, $10, $11, $12, $13,
          $14, $15
        )
        RETURNING 
          id,
          name,
          description,
          price,
          discount_price as "discountPrice",
          category,
          gender,
          sizes,
          colors,
          images,
          featured,
          is_best_seller as "isBestSeller",
          is_new_arrival as "isNewArrival",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, [
        productId,
        productData.name,
        productData.description,
        productData.price,
        productData.discountPrice || null,
        productData.category,
        productData.gender,
        JSON.stringify(productData.sizes),
        JSON.stringify(productData.colors),
        JSON.stringify(productData.images),
        productData.featured || false,
        productData.isBestSeller || false,
        productData.isNewArrival || false,
        createdAt,
        updatedAt
      ]);

      return rows[0];
    } finally {
      client.release();
    }
  },

  async updateProduct(productData: Product): Promise<Product | null> {
    const client = await db.connect();
    try {
      // First check if product exists
      const existingProduct = await this.getProductById(productData.id);
      if (!existingProduct) {
        return null;
      }

      const updatedAt = new Date().toISOString();

      const { rows } = await client.query<Product>(`
        UPDATE Products SET
          name = $1,
          description = $2,
          price = $3,
          discount_price = $4,
          category = $5,
          gender = $6,
          sizes = $7,
          colors = $8,
          images = $9,
          featured = $10,
          is_best_seller = $11,
          is_new_arrival = $12,
          updated_at = $13
        WHERE id = $14
        RETURNING 
          id,
          name,
          description,
          price,
          discount_price as "discountPrice",
          category,
          gender,
          sizes,
          colors,
          images,
          featured,
          is_best_seller as "isBestSeller",
          is_new_arrival as "isNewArrival",
          created_at as "createdAt",
          updated_at as "updatedAt"
      `, [
        productData.name,
        productData.description,
        productData.price,
        productData.discountPrice || null,
        productData.category,
        productData.gender,
        JSON.stringify(productData.sizes),
        JSON.stringify(productData.colors),
        JSON.stringify(productData.images),
        productData.featured || false,
        productData.isBestSeller || false,
        productData.isNewArrival || false,
        updatedAt,
        productData.id
      ]);

      return rows[0];
    } finally {
      client.release();
    }
  },
  async deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    const client = await db.connect();
    try {
      // First check if product exists
      const existingProduct = await this.getProductById(id);
      if (!existingProduct) {
        return { success: false, message: 'Product not found' };
      }

      await client.query(`
        DELETE FROM Products 
        WHERE id = $1
      `, [id]);

      return { success: true, message: 'Product deleted successfully' };
    } finally {
      client.release();
    }
  }
};