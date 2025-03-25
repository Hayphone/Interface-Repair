import React from 'react';
import { Stethoscope, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { DiagnosticForm, DiagnosticData } from './DiagnosticForm';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChange: (diagnostics: DiagnosticData) => void;
  initialValues?: DiagnosticData;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onChange,
  initialValues
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">Diagnostic complet</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <DiagnosticForm
            onChange={onChange}
            initialValues={initialValues}
          />
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end">
          <button
            onClick={handleSubmit}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Valider
          </button>
        </div>
      </div>
    </div>
  );
};

export const DiagnosticButton: React.FC<{
  diagnosticData: DiagnosticData | null;
  onClick: () => void;
}> = ({ diagnosticData, onClick }) => {
  const isComplete = diagnosticData && Object.keys(diagnosticData).length > 0;
  const hasWarnings = diagnosticData && (
    (diagnosticData.screen?.glass || []).includes('Se décolle du Bezel') ||
    (diagnosticData.chassis || []).includes('Châssis déformé/tordu')
  );

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Stethoscope className="h-4 w-4 mr-2" />
      Diagnostic complet
      {isComplete && (
        <span className="ml-2">
          {hasWarnings ? (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-400" />
          )}
        </span>
      )}
    </button>
  );
};