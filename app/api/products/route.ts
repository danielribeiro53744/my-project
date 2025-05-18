import { ProductRepository } from "@/lib/repositorys/product";
import { db } from "@vercel/postgres";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for product validation
const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  category: z.string().min(1),
  gender: z.enum(['men', 'women', 'unisex']),
  sizes: z.array(z.string()),
  colors: z.array(z.object({
    name: z.string(),
    hex: z.string()
  })),
  images: z.array(z.string().url()),
  featured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional()
});


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Handle different query parameters
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');
    const featured = searchParams.get('featured');
    const newArrivals = searchParams.get('newArrivals');
    const bestSellers = searchParams.get('bestSellers');
    const search = searchParams.get('search');

    if (id) {
      const product = await ProductRepository.getProductById(id);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }

    const products = await ProductRepository.getProducts({
      category: category || undefined,
      gender: gender || undefined,
      featured: featured === 'true',
      newArrivals: newArrivals === 'true',
      bestSellers: bestSellers === 'true',
      search: search || undefined
    });
    
    return NextResponse.json(products);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // const validatedData = productSchema.parse(body);

    const newProduct = await ProductRepository.createProduct(body);
    
    return NextResponse.json(newProduct, { status: 201 });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    // const validatedData = productSchema.parse(body);

    // if (!validatedData.id) {
    //   return NextResponse.json(
    //     { error: 'Product ID is required for update' },
    //     { status: 400 }
    //   );
    // }

    const updatedProduct = await ProductRepository.updateProduct(body);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedProduct);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const result = await ProductRepository.deleteProduct(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Failed to delete product' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: result.message },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Operations related to product management
 * 
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get products
 *     description: Retrieve products with optional filtering
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Get a single product by ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [men, women, unisex]
 *         description: Filter by gender
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Get featured products
 *       - in: query
 *         name: newArrivals
 *         schema:
 *           type: boolean
 *         description: Get new arrivals
 *       - in: query
 *         name: bestSellers
 *         schema:
 *           type: boolean
 *         description: Get best sellers
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name, description or category
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found (when querying by ID)
 *       500:
 *         description: Internal server error
 * 
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input data or missing ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Missing product ID
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 * 
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the product
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product
 *         discount_price:
 *           type: number
 *           format: float
 *           description: Discounted price if available
 *         category:
 *           type: string
 *           description: Product category
 *         gender:
 *           type: string
 *           enum: [men, women, unisex]
 *           description: Target gender for the product
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Available sizes
 *         colors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Color name
 *               hex:
 *                 type: string
 *                 description: Hex color code
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Product image URLs
 *         featured:
 *           type: boolean
 *           description: Whether the product is featured
 *         is_best_seller:
 *           type: boolean
 *           description: Whether the product is a best seller
 *         is_new_arrival:
 *           type: boolean
 *           description: Whether the product is a new arrival
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 * 
 *     ProductInput:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the product (optional for create)
 *         name:
 *           type: string
 *           description: Name of the product
 *         description:
 *           type: string
 *           description: Detailed description of the product
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the product
 *         discountPrice:
 *           type: number
 *           format: float
 *           description: Discounted price if available
 *         category:
 *           type: string
 *           description: Product category
 *         gender:
 *           type: string
 *           enum: [men, women, unisex]
 *           description: Target gender for the product
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Available sizes
 *         colors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Color name
 *               hex:
 *                 type: string
 *                 description: Hex color code
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           description: Product image URLs
 *         featured:
 *           type: boolean
 *           description: Whether the product is featured
 *         isBestSeller:
 *           type: boolean
 *           description: Whether the product is a best seller
 *         isNewArrival:
 *           type: boolean
 *           description: Whether the product is a new arrival
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - gender
 *         - sizes
 *         - colors
 *         - images
 */