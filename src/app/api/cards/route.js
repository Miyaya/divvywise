import { getCards } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cards = await getCards();
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error in cards API:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
} 