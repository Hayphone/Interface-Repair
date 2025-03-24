import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Save, Calculator } from 'lucide-react';
import { useCustomerStore } from '../stores/customers';
import { Combobox } from '../components/Combobox';
import { DeviceSelector } from '../components/DeviceSelector';
import { PriceCalculator } from '../components/PriceCalculator';

interface DeviceForm {
  brand: string;
  model: string;
  serial_number: string;
  condition: string;
}

const RepairForm = () => {
  const navigate = useNavigate();
  const { addCustomer, loading, error } = useCustomerStore();

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
    condition: '',
  }]);

  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [showNewCustomerFields, setShowNewCustomerFields] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [repairData, setRepairData] = useState({
    description: '',
    estimatedCost: 0,
    marginPercent: 30, // Marge par défaut de 30%
  });

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeviceChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDevices(prev => prev.map((device, i) => 
      i === index ? { ...device, [name]: value } : device
    ));
  };

  const addDevice = () => {
    setDevices(prev => [...prev, {
      brand: '',
      model: '',
      serial_number: '',
      condition: '',
    }]);
  };

  const removeDevice = (index: number) => {
    setDevices(prev => prev.filter((_, i) => i !== index));
  };

  const handlePriceCalculated = (prices: any) => {
    setRepairData(prev => ({
      ...prev,
      estimatedCost: prices.priceTTC
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty devices
      const validDevices = devices.filter(device => device.brand && device.model);
      await addCustomer(customerData, validDevices);
      navigate('/customers');
    } catch (err) {
      console.error('Error adding customer:', err);
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
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
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
                  onChange={(value) => setCustomerData(prev => ({ ...prev, name: value }))}
                  options={[]}
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
                  onChange={handleCustomerChange}
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
                  onChange={handleCustomerChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Appareil</h2>
              <button
                type="button"
                onClick={() => setShowDeviceSelector(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Sélectionner un modèle
              </button>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    État
                  </label>
                  <select
                    name="condition"
                    value={device.condition}
                    onChange={(e) => handleDeviceChange(index, e)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Sélectionner un état</option>
                    <option value="working">Fonctionnel</option>
                    <option value="broken">En panne</option>
                    <option value="water_damage">Dégât des eaux</option>
                    <option value="screen_broken">Écran cassé</option>
                  </select>
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
            condition: ''
          }]);
          setShowDeviceSelector(false);
        }}
      />
    </div>
  );
};

export default RepairForm;