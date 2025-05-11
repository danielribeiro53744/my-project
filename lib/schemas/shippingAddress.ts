import { z } from "zod";

export const shippingAddressSchema = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string()
});
