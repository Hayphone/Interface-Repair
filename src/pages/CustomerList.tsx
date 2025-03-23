import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Loader, Smartphone, Search, Trash2, CheckCircle, Square } from 'lucide-react';
import { useCustomerStore } from '../stores/customers';
import { ImportExportButtons } from '../components/ImportExportButtons';

const CustomerList = () => {
  const { customers, loading, error, fetchCustomers, deleteCustomer, addCustomer } = useCustomerStore();
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    status: '',
    device: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (field: keyof typeof searchFilters, value: string) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleDelete = async (customerId: string) => {
    try {
      await deleteCustomer(customerId);
      setShowDeleteConfirm(null);
      setSelectedCustomers([]);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const customerId of selectedCustomers) {
        await deleteCustomer(customerId);
      }
      setSelectedCustomers([]);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting customers:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(customer => customer.id));
    }
  };

  const toggleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const filteredCustomers = customers.filter(customer => {
    const matchName = customer.name.toLowerCase().includes(searchFilters.name.toLowerCase());
    const matchEmail = customer.email?.toLowerCase().includes(searchFilters.email.toLowerCase()) ?? false;
    const matchPhone = customer.phone?.toLowerCase().includes(searchFilters.phone.toLowerCase()) ?? false;
    const matchAddress = customer.address?.toLowerCase().includes(searchFilters.address.toLowerCase()) ?? false;
    const matchCity = customer.city?.toLowerCase().includes(searchFilters.city.toLowerCase()) ?? false;
    const matchPostalCode = customer.postal_code?.toLowerCase().includes(searchFilters.postal_code.toLowerCase()) ?? false;
    const matchCountry = customer.country?.toLowerCase().includes(searchFilters.country.toLowerCase()) ?? false;
    const matchStatus = customer.status?.toLowerCase().includes(searchFilters.status.toLowerCase()) ?? false;
    const matchDevice = customer.devices?.some(device => 
      `${device.brand} ${device.model}`.toLowerCase().includes(searchFilters.device.toLowerCase()) ||
      device.serial_number?.toLowerCase().includes(searchFilters.device.toLowerCase())
    ) ?? false;

    return (
      matchName && 
      (searchFilters.email === '' || matchEmail) &&
      (searchFilters.phone === '' || matchPhone) &&
      (searchFilters.address === '' || matchAddress) &&
      (searchFilters.city === '' || matchCity) &&
      (searchFilters.postal_code === '' || matchPostalCode) &&
      (searchFilters.country === '' || matchCountry) &&
      (searchFilters.status === '' || matchStatus) &&
      (searchFilters.device === '' || matchDevice)
    );
  });

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
        <h1 className="text-2xl font-bold text-gray-900">Liste des Clients</h1>
        <div className="flex space-x-4">
          <ImportExportButtons
            onImport={async (data) => {
              for (const row of data) {
                try {
                  await addCustomer({
                    name: row.name || row.Nom || '',
                    email: row.email || row.Email || '',
                    phone: row.phone || row.Téléphone || '',
                    address: row.address || row.Adresse || '',
                    city: row.city || row.Ville || '',
                    postal_code: row.postal_code || row['Code postal'] || '',
                    country: row.country || row.Pays || 'FR',
                    status: row.status || row.Statut || 'à jour'
                  }, []);
                } catch (error) {
                  console.error('Error importing customer:', error);
                }
              }
              await fetchCustomers();
            }}
            data={customers.map(customer => ({
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              postal_code: customer.postal_code,
              country: customer.country,
              status: customer.status,
              created_at: new Date(customer.created_at).toLocaleDateString('fr-FR')
            }))}
            filename="clients"
            headers={['Nom', 'Email', 'Téléphone', 'Adresse', 'Ville', 'Code postal', 'Pays', 'Statut', 'Date de création']}
          />
          {selectedCustomers.length > 0 && (
            <button
              onClick={() => setShowDeleteConfirm('multiple')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Supprimer ({selectedCustomers.length})
            </button>
          )}
          <Link
            to="/customers/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Nouveau Client
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilters.name}
                onChange={(e) => handleSearch('name', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rechercher par nom..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilters.email}
                onChange={(e) => handleSearch('email', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rechercher par email..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilters.phone}
                onChange={(e) => handleSearch('phone', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rechercher par téléphone..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilters.city}
                onChange={(e) => handleSearch('city', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rechercher par ville..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <div className="relative">
              <input
                type="text"
                value={searchFilters.status}
                onChange={(e) => handleSearch('status', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Rechercher par statut..."
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-6 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      {selectedCustomers.length === filteredCustomers.length ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ville
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code postal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pays
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appareils
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleSelectCustomer(customer.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        {selectedCustomers.includes(customer.id) ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.postal_code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{customer.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === 'à jour' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {customer.devices && customer.devices.length > 0 ? (
                        <div className="space-y-2">
                          {customer.devices.map((device) => (
                            <div key={device.id} className="flex items-center text-sm">
                              <Smartphone className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-gray-900">{device.brand} {device.model}</span>
                              {device.serial_number && (
                                <span className="ml-2 text-gray-500 text-xs">
                                  (S/N: {device.serial_number})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Aucun appareil</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {showDeleteConfirm === customer.id ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Confirmer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteConfirm(customer.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                      Aucun client trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showDeleteConfirm === 'multiple' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer les {selectedCustomers.length} clients sélectionnés ? Cette action est irréversible.
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

export default CustomerList;