
import { NextResponse } from "next/server";
import { z } from "zod";
import { UserRepository } from "@/lib/repositorys/user";

const syncSchema = z.object({
  userId: z.string(),
  localCart: z.array(z.object({
    product: z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      discountPrice: z.number().optional(),
      images: z.array(z.string()),
      category: z.string()
    }),
    size: z.string(),
    quantity: z.number().min(1)
  }))
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, localCart } = syncSchema.parse(body);

    const { user, client } = await UserRepository.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = { ...user, cart: localCart };
    await UserRepository.updatedCart(client, userId, updatedUser);

    client.release();

    return NextResponse.json({ cart: localCart });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: error instanceof z.ZodError ? error.errors : "Internal server error" },
      { status: 500 }
    );
  }
}
