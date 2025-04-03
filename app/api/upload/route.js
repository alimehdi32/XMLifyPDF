// app/api/upload/route.js
// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { convertPdfToXml } from '../../lib/Conversion';
import { Conversion } from '../../lib/db';

export async function POST(req) {
  try {
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
    const newConversion = new Conversion({ pdfName: file.name, xmlContent });
    await newConversion.save();

    return NextResponse.json({ pdfName: file.name, xmlContent });
  } catch (error) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
