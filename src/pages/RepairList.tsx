import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Loader, PenTool as Tool, Trash2, CheckCircle } from 'lucide-react';
import { useRepairStore, REPAIR_STATUS, REPAIR_STATUS_LABELS, REPAIR_STATUS_COLORS } from '../stores/repairs';
import { ImportExportButtons } from '../components/ImportExportButtons';
import { StatusSelector } from '../components/StatusSelector';

const RepairList = () => {
  const { repairs, loading, error, fetchRepairs, deleteRepair, addRepair, updateRepairStatus } = useRepairStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedStatusRepair, setSelectedStatusRepair] = useState<string | null>(null);

  useEffect(() => {
    fetchRepairs();
  }, [fetchRepairs]);

  const handleDelete = async (repairId: string) => {
    try {
      await deleteRepair(repairId);
      setShowDeleteConfirm(null);
      setSelectedRepairs([]);
    } catch (error) {
      console.error('Error deleting repair:', error);
    }
  };

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    try {
      await updateRepairStatus(repairId, newStatus);
      setSelectedStatusRepair(null);
    } catch (error) {
      console.error('Error updating repair status:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const repairId of selectedRepairs) {
        await deleteRepair(repairId);
      }
      setSelectedRepairs([]);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting repairs:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRepairs.length === filteredRepairs.length) {
      setSelectedRepairs([]);
    } else {
      setSelectedRepairs(filteredRepairs.map(repair => repair.id));
    }
  };

  const toggleSelectRepair = (repairId: string) => {
    setSelectedRepairs(prev => 
      prev.includes(repairId)
        ? prev.filter(id => id !== repairId)
        : [...prev, repairId]
    );
  };

  const filteredRepairs = repairs.filter(repair => 
    statusFilter === 'all' || repair.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">Erreur: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Réparations</h1>
        <div className="flex space-x-4">
          <ImportExportButtons
            onImport={async (data) => {
              for (const row of data) {
                try {
                  await addRepair({
                    device_id: row.device_id || '',
                    description: row.description || row.Description || '',
                    estimated_cost: parseFloat(row.estimated_cost || row['Coût estimé'] || '0'),
                    status: row.status || REPAIR_STATUS.PENDING
                  });
                } catch (error) {
                  console.error('Error importing repair:', error);
                }
              }
              await fetchRepairs();
            }}
            data={repairs.map(repair => ({
              device: `${repair.devices?.brand} ${repair.devices?.model}`,
              serial_number: repair.devices?.serial_number,
              status: REPAIR_STATUS_LABELS[repair.status as keyof typeof REPAIR_STATUS_LABELS],
              estimated_cost: repair.estimated_cost,
              created_at: new Date(repair.created_at).toLocaleDateString('fr-FR')
            }))}
            filename="reparations"
            headers={['Appareil', 'Numéro de série', 'Statut', 'Coût estimé', 'Date de création']}
          />
          {selectedRepairs.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm('multiple')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Supprimer ({selectedRepairs.length})
            </button>
          )}
          <Link
            to="/repairs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Nouvelle Réparation
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusFilter === 'all'
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {Object.entries(REPAIR_STATUS_LABELS).map(([status, label]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                statusFilter === status
                  ? REPAIR_STATUS_COLORS[status as keyof typeof REPAIR_STATUS_COLORS]
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3 text-left">
                <button
                  onClick={toggleSelectAll}
                  className="text-gray-400 hover:text-gray-500"
                >
                  {selectedRepairs.length === filteredRepairs.length ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <div className="h-5 w-5 border-2 border-gray-300 rounded-md" />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appareil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coût Estimé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de création
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRepairs.map((repair) => (
              <tr key={repair.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => toggleSelectRepair(repair.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    {selectedRepairs.includes(repair.id) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-md" />
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tool className="h-5 w-5 text-gray-400 mr-2" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {repair.devices?.brand} {repair.devices?.model}
                      </div>
                      <div className="text-sm text-gray-500">
                        {repair.devices?.serial_number}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{repair.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap relative">
                  <button
                    onClick={() => setSelectedStatusRepair(repair.id)}
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      REPAIR_STATUS_COLORS[repair.status as keyof typeof REPAIR_STATUS_COLORS]
                    }`}
                  >
                    {REPAIR_STATUS_LABELS[repair.status as keyof typeof REPAIR_STATUS_LABELS]}
                  </button>
                  {selectedStatusRepair === repair.id && (
                    <StatusSelector
                      currentStatus={repair.status}
                      onChange={(newStatus) => handleStatusChange(repair.id, newStatus)}
                      onClose={() => setSelectedStatusRepair(null)}
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {repair.estimated_cost ? `${repair.estimated_cost} €` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(repair.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/repairs/${repair.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Détails
                    </Link>
                    {showDeleteConfirm === repair.id ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={() => handleDelete(repair.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Confirmer
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(repair.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRepairs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  Aucune réparation trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm === 'multiple' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer les {selectedRepairs.length} réparations sélectionnées ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairList;