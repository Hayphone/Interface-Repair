import React from 'react';
import { FileText, Download, Image, FileJson } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { DiagnosticData } from './DiagnosticForm';

interface DiagnosticReportProps {
  diagnosticData: DiagnosticData;
  deviceInfo: {
    brand: string;
    model: string;
    serial_number?: string;
  };
  createdAt?: string;
}

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({
  diagnosticData,
  deviceInfo,
  createdAt
}) => {
  const reportRef = React.useRef<HTMLDivElement>(null);

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAsPNG = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current);
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `diagnostic-${deviceInfo.brand}-${deviceInfo.model}-${formatDateTime(createdAt).replace(/[/:]/g, '-')}.png`;
    link.click();
  };

  const exportAsPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`diagnostic-${deviceInfo.brand}-${deviceInfo.model}-${formatDateTime(createdAt).replace(/[/:]/g, '-')}.pdf`);
  };

  const exportAsText = () => {
    const content = generateTextReport();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `diagnostic-${deviceInfo.brand}-${deviceInfo.model}-${formatDateTime(createdAt).replace(/[/:]/g, '-')}.txt`;
    link.click();
  };

  const generateTextReport = () => {
    let report = `RAPPORT DE DIAGNOSTIC\n`;
    report += `===================\n\n`;
    report += `Date: ${formatDateTime(createdAt)}\n\n`;
    report += `Appareil: ${deviceInfo.brand} ${deviceInfo.model}\n`;
    if (deviceInfo.serial_number) {
      report += `Numéro de série: ${deviceInfo.serial_number}\n`;
    }
    report += `\n`;

    report += `État de démarrage: ${diagnosticData.startupState}\n\n`;

    report += `ÉCRAN\n`;
    report += `-----\n`;
    report += `Affichage: ${diagnosticData.screen.display.join(', ') || 'Non vérifié'}\n`;
    report += `Tactile: ${diagnosticData.screen.touch.join(', ') || 'Non vérifié'}\n`;
    report += `Vitre & Bezel: ${diagnosticData.screen.glass.join(', ') || 'Non vérifié'}\n\n`;

    report += `CHÂSSIS\n`;
    report += `-------\n`;
    report += `État: ${diagnosticData.chassis.join(', ') || 'Non vérifié'}\n\n`;

    report += `FONCTIONS PRINCIPALES\n`;
    report += `-------------------\n`;
    report += `Face ID: ${diagnosticData.mainFunctions.faceId || 'Non vérifié'}\n`;
    report += `Caméra FaceTime: ${diagnosticData.mainFunctions.frontCamera || 'Non vérifié'}\n`;
    report += `Caméra arrière: ${diagnosticData.mainFunctions.backCamera || 'Non vérifié'}\n`;
    report += `Micro: ${diagnosticData.mainFunctions.microphone || 'Non vérifié'}\n`;
    report += `Connecteur de charge: ${diagnosticData.mainFunctions.chargingPort || 'Non vérifié'}\n\n`;

    if (diagnosticData.unlockMethod.type) {
      report += `VERROUILLAGE\n`;
      report += `-----------\n`;
      report += `Type: ${diagnosticData.unlockMethod.type}\n`;
      if (diagnosticData.unlockMethod.type === 'pattern') {
        report += `Schéma: ${diagnosticData.unlockMethod.value}\n`;
      }
    }

    return report;
  };

  return (
    <div>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={exportAsPNG}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <Image className="h-4 w-4 mr-2" />
          PNG
        </button>
        <button
          onClick={exportAsPDF}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileText className="h-4 w-4 mr-2" />
          PDF
        </button>
        <button
          onClick={exportAsText}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          <FileJson className="h-4 w-4 mr-2" />
          TXT
        </button>
      </div>

      <div 
        ref={reportRef}
        className="bg-white p-6 rounded-lg shadow border border-gray-200"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {deviceInfo.brand} {deviceInfo.model}
            </h2>
            {deviceInfo.serial_number && (
              <p className="text-sm text-gray-500">S/N: {deviceInfo.serial_number}</p>
            )}
            {createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                Date: {formatDateTime(createdAt)}
              </p>
            )}
          </div>

          <div>
            <h3 className="font-medium text-gray-900">État de démarrage</h3>
            <p className="mt-1 text-gray-600">{diagnosticData.startupState}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">État de l'écran</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Affichage:</span>{' '}
                {diagnosticData.screen.display.join(', ') || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Tactile:</span>{' '}
                {diagnosticData.screen.touch.join(', ') || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Vitre & Bezel:</span>{' '}
                {diagnosticData.screen.glass.join(', ') || 'Non vérifié'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">État du châssis</h3>
            <p className="mt-1 text-gray-600">
              {diagnosticData.chassis.join(', ') || 'Non vérifié'}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Fonctions principales</h3>
            <div className="mt-2 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Face ID:</span>{' '}
                {diagnosticData.mainFunctions.faceId || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Caméra FaceTime:</span>{' '}
                {diagnosticData.mainFunctions.frontCamera || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Caméra arrière:</span>{' '}
                {diagnosticData.mainFunctions.backCamera || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Micro:</span>{' '}
                {diagnosticData.mainFunctions.microphone || 'Non vérifié'}
              </p>
              <p className="text-sm">
                <span className="font-medium">Connecteur de charge:</span>{' '}
                {diagnosticData.mainFunctions.chargingPort || 'Non vérifié'}
              </p>
            </div>
          </div>

          {diagnosticData.unlockMethod.type && (
            <div>
              <h3 className="font-medium text-gray-900">Verrouillage</h3>
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-medium">Type:</span>{' '}
                  {diagnosticData.unlockMethod.type}
                </p>
                {diagnosticData.unlockMethod.type === 'pattern' && (
                  <p className="text-sm">
                    <span className="font-medium">Schéma:</span>{' '}
                    {diagnosticData.unlockMethod.value}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const DiagnosticReportButton: React.FC<{
  diagnosticData: DiagnosticData;
  deviceInfo: {
    brand: string;
    model: string;
    serial_number?: string;
  };
  createdAt?: string;
  className?: string;
}> = ({ diagnosticData, deviceInfo, createdAt, className }) => {
  const [showReport, setShowReport] = React.useState(false);

  if (!diagnosticData || Object.keys(diagnosticData).length === 0) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowReport(true)}
        className={`inline-flex items-center text-indigo-600 hover:text-indigo-900 ${className}`}
      >
        <Download className="h-4 w-4 mr-1" />
        Rapport
      </button>

      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Rapport de diagnostic</h2>
              <button
                onClick={() => setShowReport(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Fermer</span>
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <DiagnosticReport
                diagnosticData={diagnosticData}
                deviceInfo={deviceInfo}
                createdAt={createdAt}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};