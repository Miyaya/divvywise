import { getTripInfo } from '@/lib/db';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    const tripInfo = await getTripInfo();
    return NextResponse.json(tripInfo);
  } catch (error) {
    console.error('Error in trip API:', error);
    return NextResponse.json({ error: 'Failed to fetch trip info' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { tripId } = await request.json();

    if (!tripId) {
      return NextResponse.json({ error: 'Trip ID is required' }, { status: 400 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql('SELECT name FROM trip WHERE uuid = $1', [tripId]);

    if (result.length === 0) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ tripName: result[0].name });
  } catch (error) {
    console.error('Error in trip name API:', error);
    return NextResponse.json({ error: 'Failed to fetch trip name' }, { status: 500 });
  }
} 