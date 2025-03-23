import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle, User, Smartphone, ClipboardList } from 'lucide-react';
import { useRepairStore } from '../stores/repairs';
import { useCustomerStore } from '../stores/customers';
import { Combobox } from '../components/Combobox';
import { DeviceSelector } from '../components/DeviceSelector';

const RepairForm = () => {
  const navigate = useNavigate();
  const { addRepair, loading, error: repairError } = useRepairStore();
  const { customers, fetchCustomers, addCustomer, addDevice } = useCustomerStore();

  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedDeviceName, setSelectedDeviceName] = useState('');
  const [selectedDeviceBrand, setSelectedDeviceBrand] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showNewCustomerFields, setShowNewCustomerFields] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const validateForm = () => {
    if (!selectedDeviceId) {
      setError('Veuillez sélectionner un appareil');
      return false;
    }
    if (!description.trim()) {
      setError('Veuillez entrer une description');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const repairData = {
        device_id: selectedDeviceId,
        description: description.trim(),
        estimated_cost: parseFloat(estimatedCost) || 0,
        status: 'pending'
      };

      await addRepair(repairData);
      navigate('/repairs');
    } catch (err) {
      console.error('Error creating repair:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la création de la réparation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomerSelect = async (customerName: string) => {
    try {
      setError(null);
      const existingCustomer = customers.find(c => c.name === customerName);
      
      if (existingCustomer) {
        setSelectedCustomerId(existingCustomer.id);
        setSelectedDeviceId('');
        setSelectedDeviceName('');
        setSelectedDeviceBrand('');
        setShowNewCustomerFields(false);
      } else {
        setShowNewCustomerFields(true);
        setNewCustomerData(prev => ({ ...prev, name: customerName }));
        setSelectedCustomerId('');
        setSelectedDeviceId('');
        setSelectedDeviceName('');
        setSelectedDeviceBrand('');
      }
    } catch (err) {
      console.error('Error selecting customer:', err);
      setError('Erreur lors de la sélection du client');
    }
  };

  const handleCreateCustomer = async () => {
    try {
      const newCustomer = await addCustomer({ 
        name: newCustomerData.name, 
        email: newCustomerData.email, 
        phone: newCustomerData.phone, 
        address: '' 
      }, []);
      
      if (newCustomer?.id) {
        setSelectedCustomerId(newCustomer.id);
        setShowNewCustomerFields(false);
        setNewCustomerData({ name: '', email: '', phone: '' });
      } else {
        throw new Error('Impossible de créer le client');
      }
    } catch (err) {
      console.error('Error creating customer:', err);
      setError('Erreur lors de la création du client');
    }
  };

  const handleDeviceSelect = async (brand: string, deviceName: string) => {
    try {
      setError(null);
      if (!selectedCustomerId) {
        setError('Veuillez d\'abord sélectionner un client');
        return;
      }

      const device = await addDevice(selectedCustomerId, {
        brand,
        model: deviceName,
        serial_number: '',
        condition: 'unknown'
      });

      if (device?.id) {
        setSelectedDeviceId(device.id);
        setSelectedDeviceName(deviceName);
        setSelectedDeviceBrand(brand);
      } else {
        throw new Error('Impossible de créer l\'appareil');
      }
    } catch (err) {
      console.error('Error selecting device:', err);
      setError('Erreur lors de la sélection de l\'appareil');
    }
  };

  const customerOptions = customers.map(customer => ({
    id: customer.id,
    label: customer.name
  }));

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

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
            disabled={submitting || loading || !selectedDeviceId || !description.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {(error || repairError) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error || repairError}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Client */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Client</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du client <span className="text-red-500">*</span>
              </label>
              <Combobox
                value={newCustomerData.name || (selectedCustomer?.name || '')}
                onChange={handleCustomerSelect}
                options={customerOptions}
                placeholder="Sélectionner ou créer un client"
              />
            </div>

            {showNewCustomerFields && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCustomerData.email}
                    onChange={(e) => setNewCustomerData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={newCustomerData.phone}
                    onChange={(e) => setNewCustomerData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateCustomer}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Créer le client
                </button>
              </div>
            )}

            {selectedCustomer && !showNewCustomerFields && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Informations client</h3>
                {selectedCustomer.email && (
                  <p className="text-sm text-gray-600">
                    Email: {selectedCustomer.email}
                  </p>
                )}
                {selectedCustomer.phone && (
                  <p className="text-sm text-gray-600">
                    Téléphone: {selectedCustomer.phone}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Section Appareil */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Smartphone className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Appareil</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modèle <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedDeviceName ? `${selectedDeviceBrand} ${selectedDeviceName}` : ''}
                  readOnly
                  placeholder="Sélectionner un appareil"
                  className="w-full rounded-md border-gray-300 bg-gray-50 cursor-pointer shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  onClick={() => setShowDeviceSelector(true)}
                />
                <button
                  type="button"
                  onClick={() => setShowDeviceSelector(true)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-50 rounded-r-md border-l border-gray-300 hover:bg-gray-100"
                >
                  Choisir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Réparation */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ClipboardList className="h-5 w-5 text-gray-400 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Détails de la réparation</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description du problème <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Décrivez le problème..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coût estimé (€)
              </label>
              <input
                type="number"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      <DeviceSelector
        isOpen={showDeviceSelector}
        onClose={() => setShowDeviceSelector(false)}
        onSelect={handleDeviceSelect}
      />
    </div>
  );
};

export default RepairForm;