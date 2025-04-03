// app/api/history/route.js
import { NextResponse } from 'next/server';
import { Conversion } from '../../lib/db';  // Use relative path

export async function GET() {
  try {
    const history = await Conversion.find().sort({ createdAt: -1 });
    return NextResponse.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
