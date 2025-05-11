import { z } from "zod";
import { cartItemSchema } from "./cartItem";
import { shippingAddressSchema } from "./shippingAddress";

export const orderSchema = z.object({
  userId: z.string(),//.uuid(),
  items: z.array(cartItemSchema),
  total: z.number().positive(),
  status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  shippingAddress: shippingAddressSchema,
  paymentIntentId: z.string().optional()
});