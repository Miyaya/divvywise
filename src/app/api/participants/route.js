import { getParticipants } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const participants = await getParticipants();
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error in participants API:', error);
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
} 