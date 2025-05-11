import { z } from "zod";

// Validate the request body
export const statusSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled']),
});