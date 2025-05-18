import { db } from "@vercel/postgres";
import { User } from "../interfaces/user";
import { hash } from "bcryptjs";

export const UserRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const client = await db.connect();
    try {
      const { rows } = await client.sql`
        SELECT data FROM users 
        WHERE data->>'email' = ${email}
        LIMIT 1
      `;
      return rows[0]?.data || null;
    } finally {
      client.release();
    }
  },

  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    cart?: any[];
  }): Promise<Omit<User, 'password'>> {
    const client = await db.connect();
    try {
      const hashedPassword = await hash(userData.password, 12);

      const newUser = {
        id: crypto.randomUUID(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        cart: userData.cart || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await client.sql`
        INSERT INTO users (data)
        VALUES (${JSON.stringify(newUser)})
      `;

      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword as User;
    } finally {
      client.release();
    }
  },

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const client = await db.connect();
    try {
      const { rows } = await client.sql`
        SELECT data FROM users
      `;
      return rows.map(row => {
        const { password, ...userData } = row.data;
        return userData;
      });
    } finally {
      client.release();
    }
  },

  async getUserWithCart(userId: string): Promise<Omit<User, 'password'> | null> {
    const client = await db.connect();
    try {
      const userRes = await client.sql`
        SELECT data FROM users 
        WHERE data->>'id' = ${userId} 
        LIMIT 1
      `;

      if (userRes.rows.length === 0) return null;

      const user = userRes.rows[0].data;

      const enrichedCart = await Promise.all(
        (user.cart || []).map(async (cartItem: any) => {
          try {
            const productRes = await client.sql`
              SELECT * FROM products 
              WHERE id = ${cartItem.productId}
              LIMIT 1
            `;
            return {
              ...cartItem,
              product: productRes.rows[0] || null
            };
          } catch {
            return cartItem;
          }
        })
      );

      const { ...safeUser } = {
        ...user,
        cart: enrichedCart
      };

      return safeUser;
    } finally {
      client.release();
    }
  },

  async updateUser(
    userId: string,
    updateData: Partial<Omit<User, 'id' | 'password' | 'createdAt'>>
  ): Promise<Omit<User, 'password'> | null> {
    const client = await db.connect();
    try {
      const { rows } = await client.sql`
        SELECT data FROM users 
        WHERE data->>'id' = ${userId} 
        LIMIT 1
      `;

      if (rows.length === 0) return null;

      const existingUser = rows[0].data;

      const updatedUser = {
        ...existingUser,
        ...updateData,
        cart: updateData.cart ?? existingUser.cart ?? [],
        updatedAt: new Date().toISOString(),
        id: existingUser.id,
        createdAt: existingUser.createdAt,
        password: existingUser.password
      };

      await client.sql`
        UPDATE users
        SET data = ${JSON.stringify(updatedUser)}
        WHERE data->>'id' = ${userId}
      `;

      const { password, ...safeUser } = updatedUser;
      return safeUser;
    } finally {
      client.release();
    }
  },

  // ✅ NEW METHOD: Check if product exists
  async checkProductExists(productId: string): Promise<boolean> {
    const client = await db.connect();
    try {
      const result = await client.sql`
        SELECT * FROM products
        WHERE id = ${productId}
      `;
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  },

  // ✅ NEW METHOD: Get user + client (for use in transaction-style operations)
  async getUserById(userId: string): Promise<{ user: User | null, client: any }> {
    const client = await db.connect();
    const result = await client.sql`
      SELECT data FROM users
      WHERE data->>'id' = ${userId}
      LIMIT 1
    `;
    const user = result.rows.length > 0 ? result.rows[0].data : null;
    return { user, client };
  },

  // ✅ NEW METHOD: Update user cart (assumes you already have the client from getUserByIdWithClient)
  async updatedCart(client: any, userId: string, updatedUser: User): Promise<void> {
    await client.sql`
      UPDATE users
      SET data = ${JSON.stringify(updatedUser)}
      WHERE data->>'id' = ${userId}
    `;
  }
};
