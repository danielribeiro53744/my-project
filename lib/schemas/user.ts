import { z } from "zod";
import { cartItemSchema } from "./cartItem";


export const userSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    image: z.string().optional().nullable(),
    role: z.enum(['user', 'admin']).default('user'),
    cart: z.array(cartItemSchema).optional().default([])
  });