import React, { useEffect, useState, useRef } from 'react';
import { Printer, Download, AlertCircle, Check, ExternalLink } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface LabelPrinterProps {
  data: {
    customerName: string;
    phone: string;
    deviceInfo: string;
    repairDescription: string;
    lockCode?: string;
    price?: number;
    repairId: string;
    date: string;
  };
}

const EMERGENCY_CONTACT = '06 71 72 87 70';

export const LabelPrinter: React.FC<LabelPrinterProps> = ({ data }) => {
  const [showOptions, setShowOptions] = useState(false);

  const generatePDF = () => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [32, 57] // Standard DYMO label size
      });

      // Set font
      doc.setFont('helvetica');

      // Customer info
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(data.customerName, 3, 5);
      doc.setFontSize(8);
      doc.text(data.phone, 3, 9);

      // Device info
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      const deviceLines = doc.splitTextToSize(data.deviceInfo, 51); // 57mm - 6mm margins
      doc.text(deviceLines, 3, 13);

      // Repair description
      const descriptionLines = doc.splitTextToSize(data.repairDescription, 51);
      doc.text(descriptionLines, 3, 17);

      // Details
      doc.setFont('helvetica', 'bold');
      doc.text(`Code: ${data.lockCode || 'N/A'}`, 3, 23);
      doc.text(`Prix: ${data.price ? `${data.price}€` : 'N/A'}`, 3, 27);

      // Footer
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(data.date, 3, 30);
      doc.text(`Contact: ${EMERGENCY_CONTACT}`, 30, 30);

      // Save the PDF
      doc.save(`reparation-${data.repairId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    }
  };

  const printRegular = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 4mm;
              width: 57mm;
              height: 32mm;
              font-family: Arial, sans-serif;
            }
            .label {
              border: 1px solid #000;
              padding: 2mm;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }
            .customer { font-size: 10pt; font-weight: bold; margin-bottom: 2mm; }
            .phone { font-size: 8pt; margin-bottom: 2mm; }
            .device { font-size: 8pt; margin-bottom: 2mm; }
            .details { font-size: 8pt; font-weight: bold; margin-bottom: 2mm; }
            .footer { font-size: 7pt; }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="customer">${data.customerName}</div>
            <div class="phone">${data.phone}</div>
            <div class="device">
              ${data.deviceInfo}<br>
              ${data.repairDescription}
            </div>
            <div class="details">
              Code: ${data.lockCode || 'N/A'}<br>
              Prix: ${data.price ? `${data.price}€` : 'N/A'}
            </div>
            <div class="footer">
              ${data.date}<br>
              Contact: ${EMERGENCY_CONTACT}
            </div>
          </div>
          <script>
            window.onload = () => window.print();
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="mt-4">
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Printer className="h-5 w-5 mr-2" />
          Imprimer étiquette
        </button>

        {showOptions && (
          <div className="absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              <button
                onClick={() => {
                  printRegular();
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Imprimer sur imprimante standard
              </button>
              <button
                onClick={() => {
                  generatePDF();
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger en PDF
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};