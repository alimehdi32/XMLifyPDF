import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
    try {
      const token = request.cookies.get('token')?.value;
  
      if (!token) {
        return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
      }
  
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  
      return NextResponse.json({
        email: decoded.email,
        username: decoded.username,
        success: true,
      });
    } catch (error) {
      console.error("GET error:", error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  }