import React from 'react';
import { jsPDF } from 'jspdf';
import { FileText, Download } from 'lucide-react';
import type { DiagnosticData } from './DiagnosticForm';

interface DiagnosticCertificateProps {
  diagnosticData: DiagnosticData;
  deviceInfo: {
    brand: string;
    model: string;
    serial_number?: string;
  };
  customerInfo: {
    name: string;
    phone?: string;
    email?: string;
  };
  createdAt: string;
}

const COMPANY_LOGO = 'https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=150&h=150&fit=crop&auto=format'; // Placeholder logo

export const DiagnosticCertificate: React.FC<DiagnosticCertificateProps> = ({
  diagnosticData,
  deviceInfo,
  customerInfo,
  createdAt
}) => {
  const certificateRef = React.useRef<HTMLDivElement>(null);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
      case 'Fonctionne normalement':
      case 'Intact':
        return 'text-green-600 bg-green-50';
      case 'HS':
      case 'Ne répond pas':
      case 'Pas d\'affichage':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const generatePDF = async () => {
    if (!certificateRef.current) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add company logo
    pdf.addImage(COMPANY_LOGO, 'JPEG', 20, 10, 30, 30);

    // Add title
    pdf.setFontSize(24);
    pdf.setTextColor(30, 64, 175); // indigo-700
    pdf.text('Certificat de Diagnostic', 60, 30);

    // Add metadata
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Date: ${formatDate(createdAt)}`, 20, 50);
    pdf.text(`Référence: ${Math.random().toString(36).substring(7).toUpperCase()}`, 20, 55);

    // Add customer info
    pdf.setFontSize(14);
    pdf.text('Informations Client', 20, 70);
    pdf.setFontSize(12);
    pdf.text(`Nom: ${customerInfo.name}`, 25, 80);
    if (customerInfo.phone) pdf.text(`Téléphone: ${customerInfo.phone}`, 25, 85);
    if (customerInfo.email) pdf.text(`Email: ${customerInfo.email}`, 25, 90);

    // Add device info
    pdf.setFontSize(14);
    pdf.text('Informations Appareil', 20, 105);
    pdf.setFontSize(12);
    pdf.text(`Marque: ${deviceInfo.brand}`, 25, 115);
    pdf.text(`Modèle: ${deviceInfo.model}`, 25, 120);
    if (deviceInfo.serial_number) pdf.text(`Numéro de série: ${deviceInfo.serial_number}`, 25, 125);

    // Add diagnostic results
    pdf.setFontSize(14);
    pdf.text('Résultats du Diagnostic', 20, 140);
    pdf.setFontSize(12);
    pdf.text(`État de démarrage: ${diagnosticData.startupState}`, 25, 150);

    // Save the PDF
    pdf.save(`diagnostic-${deviceInfo.brand}-${deviceInfo.model}-${new Date().toISOString()}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 flex justify-end">
        <button
          onClick={generatePDF}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </button>
      </div>

      <div 
        ref={certificateRef}
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%239C92AC" fill-opacity="0.05" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")'
        }}
      >
        {/* En-tête */}
        <div className="border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={COMPANY_LOGO}
                alt="Logo"
                className="h-16 w-16 rounded-full bg-white p-2"
              />
              <div className="ml-4">
                <h1 className="text-2xl font-bold">Certificat de Diagnostic</h1>
                <p className="text-indigo-100">
                  {formatDate(createdAt)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-75">Référence</div>
              <div className="font-mono">
                {Math.random().toString(36).substring(7).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Informations client */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations Client
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Nom</div>
                  <div className="font-medium">{customerInfo.name}</div>
                </div>
                {customerInfo.phone && (
                  <div>
                    <div className="text-sm text-gray-500">Téléphone</div>
                    <div className="font-medium">{customerInfo.phone}</div>
                  </div>
                )}
                {customerInfo.email && (
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{customerInfo.email}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Informations appareil */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informations Appareil
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Marque</div>
                  <div className="font-medium">{deviceInfo.brand}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Modèle</div>
                  <div className="font-medium">{deviceInfo.model}</div>
                </div>
                {deviceInfo.serial_number && (
                  <div className="col-span-2">
                    <div className="text-sm text-gray-500">Numéro de série</div>
                    <div className="font-medium font-mono">{deviceInfo.serial_number}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Résultats du diagnostic */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Résultats du Diagnostic
            </h2>
            
            {/* État de démarrage */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                État de démarrage
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  diagnosticData.startupState === 'Démarre et fonctionnel'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {diagnosticData.startupState}
                </span>
              </div>
            </div>

            {/* État de l'écran */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                État de l'écran
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-2">Affichage</div>
                  <div className="flex flex-wrap gap-2">
                    {diagnosticData.screen.display.map((status, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Tactile</div>
                  <div className="flex flex-wrap gap-2">
                    {diagnosticData.screen.touch.map((status, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-2">Vitre & Bezel</div>
                  <div className="flex flex-wrap gap-2">
                    {diagnosticData.screen.glass.map((status, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}
                      >
                        {status}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern de verrouillage */}
            {diagnosticData.unlockMethod.type === 'pattern' && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Schéma de déverrouillage
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <PatternLock
                    size={200}
                    initialValue={diagnosticData.unlockMethod.value}
                    onChange={() => {}}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="text-sm text-gray-500 text-center">
            Ce certificat de diagnostic a été généré automatiquement le {formatDate(createdAt)}.<br />
            Pour toute question, veuillez nous contacter.
          </div>
        </div>
      </div>
    </div>
  );
};