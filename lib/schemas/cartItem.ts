import { z } from "zod";
import { productSchema } from "./product";

export const cartItemSchema = z.object({
  product: productSchema,
  quantity: z.number().int().positive(),
  size: z.string() // Could also use z.enum(['S', 'M', 'L', 'XL']) for specific sizes
});

  export const cartItemSchema1 = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  // Add other item properties as needed
});