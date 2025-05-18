// repository/order.ts
import { db } from '@vercel/postgres';
import { Order } from '../interfaces/order';



export const OrderRepository = {

  async createOrder(order: Order): Promise<string> {
    const client = await db.connect();
    try {
      const newOrder = {
        ...order,
      };

      const result = await client.sql`
        INSERT INTO orders (data)
        VALUES (${JSON.stringify(newOrder)})
        RETURNING id
      `;
      
      return result.rows[0].id;
    } finally {
      client.release();
    }
  },


 async getAllOrders(): Promise<Order[]> {
    const client = await db.connect();
    try {
      const result = await client.sql`
        SELECT id, data 
        FROM orders 
        ORDER BY data->>'createdAt' DESC
      `;
      
      return result.rows.map(row => ({
        id: row.id,
        ...row.data,
      }));
    } finally {
      client.release();
    }
  },

  async getOrderById(id: string): Promise<Order | null> {
    const client = await db.connect();
    try {
      const result = await client.sql`
        SELECT id, data 
        FROM orders
        WHERE id = ${id}
        LIMIT 1
      `;

      if (result.rows.length === 0) {
        return null;
      }

      return {
        id: result.rows[0].id,
        ...result.rows[0].data,
      };
    } finally {
      client.release();
    }
  },

  async deleteOrder(id: string): Promise<Order | null> {
    const client = await db.connect();
    try {
      const result = await client.sql`
        DELETE FROM orders
        WHERE id = ${id}
        RETURNING id, data
      `;

      if (result.rows.length === 0) {
        return null;
      }

      return {
        id: result.rows[0].id,
        ...result.rows[0].data,
      };
    } finally {
      client.release();
    }
  },

    async updateOrderStatus(id: string, status: string): Promise<Order> {
    const client = await db.connect();
    try {
      const order = await this.getOrderById(id);
      if (!order) {
        throw new Error('Order not found');
      }
       // Update the order's status
        const updatedOrder = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
        };
      await client.sql`
        UPDATE orders
        SET data = ${JSON.stringify(updatedOrder)}
        WHERE id = ${id}
      `;

      return order;
    } finally {
      client.release();
    }
  }
};