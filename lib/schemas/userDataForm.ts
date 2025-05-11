import { z } from "zod";

export const formDataUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  image: z.string().optional().nullable()
});



