import { z } from "zod";
import { cartItemSchema1 } from "./cartItem";

export const cartSchema = z.object({
  items: z.array(cartItemSchema1),
  total: z.number().nonnegative(),
  // Optional: add metadata like createdAt, updatedAt, etc.
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});