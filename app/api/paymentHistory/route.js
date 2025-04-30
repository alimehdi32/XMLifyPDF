import { NextResponse } from 'next/server';
import { Payment } from '../../lib/payment';  // Use relative path
import jwt from 'jsonwebtoken';

export async function GET(req) {
  try {
    // 1. Get token from cookies
    const token = req.cookies.get("token")?.value; // if using Next.js App Router
    if (!token) {
      return Response.json({ error: "Unauthorized. No token." }, { status: 401 });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    if (!decoded) {
      return Response.json({ error: "Unauthorized. Invalid token." }, { status: 401 });
    }

    const email = decoded.email; // 🛡️ now you have user's email securely

    const payments = await Payment.find({ email: email }).sort({ createdAt: -1 });
    console.log("Payment history fetched:", payments);
    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}