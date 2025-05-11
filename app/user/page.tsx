import { cartSchema } from "@/lib/schemas/cart";



export default async function User() {
  ///////////////////////CART///////////////////////
  const rawCart = {
    items: [
      { id: '1', name: 'Product A', quantity: 2, price: 19.99 },
      { id: '2', name: 'Product B', quantity: 1, price: 29.99 }
    ],
    total: 69.97
  };
  
  try {
    const validatedCart = cartSchema.parse(rawCart);
    console.log('Valid cart:', validatedCart);
  } catch (error) {
    console.error('Invalid cart:', error as Error);
  }
  //////////////////////////COOKIES/////////////////////////////
  

  return (
    <div>
      <h1>UTILIZADOR</h1>
    </div>
   )
}