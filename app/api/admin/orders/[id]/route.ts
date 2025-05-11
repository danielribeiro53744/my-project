import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/orders.json');

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    const order = orders.find((o: any) => o.id === params.id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const orders = JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
    
    const orderIndex = orders.findIndex((o: any) => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      status
    };
    
    await fs.writeFile(DB_PATH, JSON.stringify(orders, null, 2));
    
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}