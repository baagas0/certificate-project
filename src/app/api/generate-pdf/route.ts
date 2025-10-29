import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { CertificateTemplate, DynamicData } from '@/store/certificateStore';

export async function POST(request: NextRequest) {
  try {
    const { template, dynamicData } = await request.json() as {
      template: CertificateTemplate;
      dynamicData: DynamicData;
    };

    if (!template) {
      return NextResponse.json({ error: 'Template is required' }, { status: 400 });
    }

    // Generate HTML for certificate
    const html = generateCertificateHTML(template, dynamicData);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Check if first page has background image for custom page dimensions
    const firstPage = template.pages[0];
    let pdfOptions: any = {
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      printBackground: true,
    };

    // If there's a background image, use custom dimensions
    if (firstPage?.backgroundImage) {
      // Use standard high-quality dimensions that match most certificate templates
      const pageWidth = 800;
      const pageHeight = 600;

      pdfOptions = {
        width: `${pageWidth}px`,
        height: `${pageHeight}px`,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        printBackground: true,
        scale: 1.0,
      };

      // Add dimensions to first page for HTML generation
      (firstPage as any).pageWidth = pageWidth;
      (firstPage as any).pageHeight = pageHeight;
    }

    // Generate PDF
    const pdf = await page.pdf(pdfOptions);

    await browser.close();

    // Return PDF
    return new NextResponse(pdf as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${template.templateName}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: String(error) },
      { status: 500 }
    );
  }
}

function generateCertificateHTML(template: CertificateTemplate, dynamicData: DynamicData): string {
  const pagesHTML = template.pages
    .map((page) => {
      const componentsHTML = page.components
        .map((component) => {
          const content =
            component.dataKey && dynamicData[component.dataKey]
              ? String(dynamicData[component.dataKey])
              : component.content;

          // Support both free positioning and grid positioning
          let left, top, width, height;

          if (component.layout.positionMode === 'free') {
            // Use pixel-based positioning directly for custom PDF size
            left = `${component.layout.left || 50}px`;
            top = `${component.layout.top || 50}px`;
            width = `${component.layout.width || 150}px`;
            height = `${component.layout.height || 50}px`;
          } else {
            // Fallback to grid positioning
            const gridColsValue = template.gridCols || 12;
            const gridRowsValue = template.gridRows || 12;
            const cellWidth = (100 / gridColsValue).toFixed(2);
            const cellHeight = (297 / gridRowsValue).toFixed(2); // A4 height in mm

            left = (component.layout.x * parseFloat(cellWidth)).toFixed(2);
            top = (component.layout.y * parseFloat(cellHeight)).toFixed(2);
            width = (component.layout.w * parseFloat(cellWidth)).toFixed(2);
            height = (component.layout.h * parseFloat(cellHeight)).toFixed(2);
          }

          const baseStyle = `
            position: absolute;
            left: ${component.layout.positionMode === 'free' ? left : `${left}%`};
            top: ${component.layout.positionMode === 'free' ? top : `${top}mm`};
            width: ${component.layout.positionMode === 'free' ? width : `${width}%`};
            height: ${component.layout.positionMode === 'free' ? height : `${height}mm`};
            font-size: ${component.fontSize || 14}px;
            font-family: ${component.fontFamily || 'Arial'};
            color: ${component.color || '#000000'};
            text-align: ${component.alignment || 'left'};
            display: flex;
            align-items: center;
            justify-content: ${
              component.alignment === 'center' ? 'center' : component.alignment === 'right' ? 'flex-end' : 'flex-start'
            };
            padding: 8px;
            overflow: hidden;
            word-wrap: break-word;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 4px;
          `;

          let componentHTML = '';

          switch (component.type) {
            case 'text':
              componentHTML = `<div style="${baseStyle}">${content}</div>`;
              break;

            case 'signature':
              componentHTML = `
                <div style="${baseStyle} flex-direction: column; justify-content: flex-end;">
                  <div style="border-top: 2px solid #000; width: 100%; padding-top: 4px; text-align: center; font-size: ${(component.fontSize || 12) * 0.8}px;">
                    ${content}
                  </div>
                </div>
              `;
              break;

            case 'date':
              componentHTML = `<div style="${baseStyle}">${content}</div>`;
              break;

            case 'image':
              componentHTML = `
                <div style="${baseStyle} justify-content: center;">
                  <img src="${content}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                </div>
              `;
              break;

            case 'qrcode':
              componentHTML = `<div style="${baseStyle}">QR Code: ${content}</div>`;
              break;

            default:
              componentHTML = `<div style="${baseStyle}">Unknown component</div>`;
          }

          return componentHTML;
        })
        .join('');

      const backgroundStyle = page.backgroundImage
        ? `background-image: url('${page.backgroundImage}'); background-size: cover; background-position: center; background-repeat: no-repeat;`
        : 'background-color: #ffffff;';

      const pageWidth = page.backgroundImage ? 800 : 794; // 794px = 210mm at 96 DPI
    const pageHeight = page.backgroundImage ? 600 : 1123; // 1123px = 297mm at 96 DPI

    return `
        <div class="page" style="
          position: relative;
          width: ${pageWidth}px;
          height: ${pageHeight}px;
          margin: 0;
          padding: 0;
          ${backgroundStyle}
          page-break-after: always;
          box-sizing: border-box;
          overflow: hidden;
        ">
          ${componentsHTML}
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${template.templateName}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
        }
        @media print {
          body {
            background-color: white;
          }
          .page {
            page-break-after: always;
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${pagesHTML}
    </body>
    </html>
  `;
}
