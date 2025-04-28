// app/api/history/route.js
import { NextResponse } from 'next/server';
import { Conversion } from '../../lib/db';  // Use relative path

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const history = await Conversion.find({ email: email }).sort({ createdAt: -1 });
    console.log("History fetched:");
    return NextResponse.json({ history }, { status: 200 });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
