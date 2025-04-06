import { getPurchases } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const purchases = await getPurchases();
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error in purchases API:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
} 