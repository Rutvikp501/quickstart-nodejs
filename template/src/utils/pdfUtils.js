import PdfPrinter from 'pdfmake';
import fs from 'fs';
import path from 'path';

// Define font configuration
const fonts = {
    Roboto: {
        normal: 'node_modules/roboto-font/fonts/Roboto/roboto-regular-webfont.ttf',
        bold: 'node_modules/roboto-font/fonts/Roboto/roboto-bold-webfont.ttf',
        italics: 'node_modules/roboto-font/fonts/Roboto/roboto-italic-webfont.ttf',
        bolditalics: 'node_modules/roboto-font/fonts/Roboto/roboto-bolditalic-webfont.ttf'
    }
};

const printer = new PdfPrinter(fonts);

export const generatePdf = async (data) => {
  try {
    
    

    const docDefinition = {
      content: [
        { text: data.title, style: 'header' },
        { text: data.content, style: 'body' },
        {
          table: {
            widths: ['*', '*'],
            body: [
              ['Item', 'Price'],
              ['Service A', '₹500'],
              ['Service B', '₹700'],
            ]
          }}
      ],
      
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        body: {
          fontSize: 12
        }
      }
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];
    pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => null);
        pdfDoc.end();

        return new Promise((resolve, reject) => {
            pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
            pdfDoc.on('error', reject);
    });

    pdfDoc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
            throw new Error('Error generating PDF');
  }
};
