import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Save } from 'lucide-react';
import { useRepairStore } from '../stores/repairs';
import { useCustomerStore } from '../stores/customers';
import { Combobox } from '../components/Combobox';
import { DeviceSelector } from '../components/DeviceSelector';
import { PriceCalculator } from '../components/PriceCalculator';
import { DiagnosticModal, DiagnosticButton } from '../components/DiagnosticModal';
import type { DiagnosticData } from '../components/DiagnosticForm';

interface DeviceForm {
  brand: string;
  model: string;
  serial_number: string;
}

const RepairForm = () => {
  const navigate = useNavigate();
  const { addRepair, loading: repairLoading, error: repairError, successMessage, clearMessages } = useRepairStore();
  const { fetchCustomers, getCustomerOptions, loading: customerLoading } = useCustomerStore();

  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [devices, setDevices] = useState<DeviceForm[]>([{
    brand: '',
    model: '',
    serial_number: '',
  }]);

  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  const [repairData, setRepairData] = useState({
    description: '',
    estimatedCost: 0,
    marginPercent: 30,
  });

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCustomerChange = (value: string) => {
    setCustomerData(prev => ({ ...prev, name: value }));
  };

  const handleDeviceChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDevices(prev => prev.map((device, i) => 
      i === index ? { ...device, [name]: value } : device
    ));
  };

  const handlePriceCalculated = (prices: any) => {
    setRepairData(prev => ({
      ...prev,
      estimatedCost: prices.priceTTC
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    try {
      const device = devices[0];
      if (!device.brand || !device.model) {
        throw new Error('Veuillez sélectionner un appareil');
      }

      if (!customerData.name) {
        throw new Error('Veuillez entrer le nom du client');
      }

      const repairId = await addRepair({
        customer: customerData,
        device: {
          brand: device.brand,
          model: device.model,
          serial_number: device.serial_number
        },
        diagnostics: diagnosticData || undefined,
        description: repairData.description,
        estimated_cost: repairData.estimatedCost
      });

      navigate('/repairs', { state: { repairId } });
    } catch (err) {
      console.error('Error adding repair:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouvelle Réparation</h1>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => navigate('/repairs')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={repairLoading || customerLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {repairLoading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {repairError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{repairError}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Client</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <Combobox
                  value={customerData.name}
                  onChange={handleCustomerChange}
                  options={getCustomerOptions()}
                  placeholder="Sélectionner ou créer un client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={(e) => setCustomerData(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Appareil</h2>
              <div className="flex space-x-2">
                <DiagnosticButton
                  diagnosticData={diagnosticData}
                  onClick={() => setShowDiagnosticModal(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowDeviceSelector(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Sélectionner un modèle
                </button>
              </div>
            </div>

            {devices.map((device, index) => (
              <div key={index} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marque
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={device.brand}
                      onChange={(e) => handleDeviceChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Modèle
                    </label>
                    <input
                      type="text"
                      name="model"
                      value={device.model}
                      onChange={(e) => handleDeviceChange(index, e)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro de série
                  </label>
                  <input
                    type="text"
                    name="serial_number"
                    value={device.serial_number}
                    onChange={(e) => handleDeviceChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Description de la réparation</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description du problème
              </label>
              <textarea
                rows={4}
                value={repairData.description}
                onChange={(e) => setRepairData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Décrivez le problème..."
              />
            </div>
          </div>

          <PriceCalculator
            onPriceCalculated={handlePriceCalculated}
            initialValues={{
              marginPercent: repairData.marginPercent
            }}
          />
        </div>
      </div>

      <DeviceSelector
        isOpen={showDeviceSelector}
        onClose={() => setShowDeviceSelector(false)}
        onSelect={(brand, model) => {
          setDevices([{
            brand,
            model,
            serial_number: '',
          }]);
          setShowDeviceSelector(false);
        }}
      />

      <DiagnosticModal
        isOpen={showDiagnosticModal}
        onClose={() => setShowDiagnosticModal(false)}
        onChange={setDiagnosticData}
        initialValues={diagnosticData || undefined}
      />
    </div>
  );
};

export default RepairForm;