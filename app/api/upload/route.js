// app/api/upload/route.js
// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { convertPdfToXml } from '../../lib/Conversion';
import { Conversion } from '../../lib/db';
import jwt from 'jsonwebtoken';

export async function POST(req) {
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

    const formData = await req.formData();
    const file = formData.get('pdfFile');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert PDF to XML
    const xmlContent = await convertPdfToXml(buffer);

    // Save to database
    const newConversion = new Conversion({ email: email, pdfName: file.name, xmlContent });
    await newConversion.save();

    return NextResponse.json({ email: email, pdfName: file.name, xmlContent }, { status: 200 });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
