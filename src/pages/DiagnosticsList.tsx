import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Plus, Search, Smartphone, PenTool as Tool } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DiagnosticReportButton } from '../components/DiagnosticReport';
import { DiagnosticModal } from '../components/DiagnosticModal';
import type { DiagnosticData } from '../components/DiagnosticForm';

interface DiagnosticEntry {
  id: string;
  created_at: string;
  devices: {
    brand: string;
    model: string;
    serial_number: string | null;
  };
  diagnostics: DiagnosticData;
}

const DiagnosticsList = () => {
  const navigate = useNavigate();
  const [diagnostics, setDiagnostics] = useState<DiagnosticEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticEntry | null>(null);

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const fetchDiagnostics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('repairs')
        .select(`
          id,
          created_at,
          devices (
            brand,
            model,
            serial_number
          ),
          diagnostics
        `)
        .not('diagnostics', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiagnostics(data || []);
    } catch (err) {
      console.error('Error fetching diagnostics:', err);
      setError('Erreur lors du chargement des diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const handleEditDiagnostic = (diagnostic: DiagnosticEntry) => {
    setSelectedDiagnostic(diagnostic);
    setShowDiagnosticModal(true);
  };

  const handleDiagnosticChange = async (diagnosticData: DiagnosticData) => {
    if (!selectedDiagnostic) return;

    try {
      const { error } = await supabase
        .from('repairs')
        .update({ diagnostics: diagnosticData })
        .eq('id', selectedDiagnostic.id);

      if (error) throw error;

      await fetchDiagnostics();
      setShowDiagnosticModal(false);
      setSelectedDiagnostic(null);
    } catch (err) {
      console.error('Error updating diagnostic:', err);
      setError('Erreur lors de la mise à jour du diagnostic');
    }
  };

  const filteredDiagnostics = diagnostics.filter(diagnostic => {
    const searchString = searchTerm.toLowerCase();
    return (
      diagnostic.devices?.brand.toLowerCase().includes(searchString) ||
      diagnostic.devices?.model.toLowerCase().includes(searchString) ||
      diagnostic.devices?.serial_number?.toLowerCase().includes(searchString)
    );
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Historique des Diagnostics</h1>
        <button
          onClick={() => navigate('/repairs/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau Diagnostic
        </button>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un appareil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appareil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                État général
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDiagnostics.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Aucun diagnostic trouvé
                </td>
              </tr>
            ) : (
              filteredDiagnostics.map((diagnostic) => (
                <tr key={diagnostic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {diagnostic.devices?.brand} {diagnostic.devices?.model}
                        </div>
                        {diagnostic.devices?.serial_number && (
                          <div className="text-sm text-gray-500">
                            S/N: {diagnostic.devices.serial_number}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {diagnostic.diagnostics.startupState}
                    </div>
                    {diagnostic.diagnostics.screen?.glass?.includes('Se décolle du Bezel') && (
                      <div className="text-sm text-amber-600">
                        ⚠️ Décollement du bezel
                      </div>
                    )}
                    {diagnostic.diagnostics.chassis?.includes('Châssis déformé/tordu') && (
                      <div className="text-sm text-amber-600">
                        ⚠️ Châssis déformé
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(diagnostic.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <DiagnosticReportButton
                        diagnosticData={diagnostic.diagnostics}
                        deviceInfo={{
                          brand: diagnostic.devices?.brand || '',
                          model: diagnostic.devices?.model || '',
                          serial_number: diagnostic.devices?.serial_number || undefined
                        }}
                        createdAt={diagnostic.created_at}
                      />
                      <button
                        onClick={() => handleEditDiagnostic(diagnostic)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Tool className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDiagnosticModal && selectedDiagnostic && (
        <DiagnosticModal
          isOpen={showDiagnosticModal}
          onClose={() => {
            setShowDiagnosticModal(false);
            setSelectedDiagnostic(null);
          }}
          onChange={handleDiagnosticChange}
          initialValues={selectedDiagnostic.diagnostics}
        />
      )}
    </div>
  );
};

export default DiagnosticsList;