import { z } from "zod";

export const productSchema = z.object({
  id: z.string(),//.uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string(),
  gender: z.enum(['men', 'women', 'unisex']),
  sizes: z.array(z.string()),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/) // hex color format validation
  })),
  images: z.array(z.string().url()),
  featured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean()
});

const productSchema1 = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    discountPrice: z.number().positive().optional(),
    category: z.string(),
    gender: z.enum(['men', 'women', 'unisex']),
    sizes: z.array(z.string()),
    colors: z.array(z.object({
      name: z.string(),
      hex: z.string().regex(/^#([0-9A-Fa-f]{3}){1,2}$/) // hex color format validation
    })),
    images: z.array(z.string().url()),
    featured: z.boolean(),
    isBestSeller: z.boolean(),
    isNewArrival: z.boolean()
  });