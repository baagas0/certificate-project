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

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

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

          const gridColsValue = template.gridCols || 12;
          const gridRowsValue = template.gridRows || 12;
          const cellWidth = (100 / gridColsValue).toFixed(2);
          const cellHeight = (297 / gridRowsValue).toFixed(2); // A4 height in mm

          const left = (component.layout.x * parseFloat(cellWidth)).toFixed(2);
          const top = (component.layout.y * parseFloat(cellHeight)).toFixed(2);
          const width = (component.layout.w * parseFloat(cellWidth)).toFixed(2);
          const height = (component.layout.h * parseFloat(cellHeight)).toFixed(2);

          const baseStyle = `
            position: absolute;
            left: ${left}%;
            top: ${top}mm;
            width: ${width}%;
            height: ${height}mm;
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
        ? `background-image: url('${page.backgroundImage}'); background-size: cover; background-position: center;`
        : 'background-color: #ffffff;';

      return `
        <div style="
          position: relative;
          width: 210mm;
          height: 297mm;
          margin: 0;
          padding: 0;
          ${backgroundStyle}
          page-break-after: always;
          box-sizing: border-box;
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
