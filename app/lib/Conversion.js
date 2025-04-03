// app/lib/conversion.js
import pdf2json from 'pdf2json';
import { json2xml } from 'xml-js';

export async function convertPdfToXml(fileBuffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new pdf2json();
    
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve(json2xml(pdfData, { compact: true, spaces: 2 }));
    });

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(error);
    });

    pdfParser.parseBuffer(fileBuffer);
  });
}
