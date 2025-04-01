import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { DeviceModel, BrandCategory, samsungDevices, appleDevices, huaweiDevices, oppoDevices } from '../lib/deviceData';

interface DeviceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (brand: string, deviceName: string) => void;
}

// Définition des marques avec leurs catégories d'appareils
const brands: BrandCategory[] = [
  {
    name: 'Apple',
    categories: appleDevices
  },
  {
    name: 'Samsung',
    categories: samsungDevices
  },
  {
    name: 'Huawei',
    categories: huaweiDevices
  },
  {
    name: 'Oppo',
    categories: oppoDevices
  },
  {
    name: 'Xiaomi',
    categories: [
      {
        title: 'Redmi Note',
        devices: [
          { id: 'redminote13pro', name: 'Redmi Note 13 Pro' },
          { id: 'redminote13', name: 'Redmi Note 13' },
          { id: 'redminote12pro', name: 'Redmi Note 12 Pro' },
          { id: 'redminote12', name: 'Redmi Note 12' },
          { id: 'redminote11pro', name: 'Redmi Note 11 Pro' },
          { id: 'redminote11', name: 'Redmi Note 11' },
        ]
      },
      {
        title: 'Xiaomi',
        devices: [
          { id: 'xiaomi14ultra', name: 'Xiaomi 14 Ultra' },
          { id: 'xiaomi14pro', name: 'Xiaomi 14 Pro' },
          { id: 'xiaomi14', name: 'Xiaomi 14' },
          { id: 'xiaomi13ultra', name: 'Xiaomi 13 Ultra' },
          { id: 'xiaomi13pro', name: 'Xiaomi 13 Pro' },
          { id: 'xiaomi13', name: 'Xiaomi 13' },
        ]
      },
      {
        title: 'POCO',
        devices: [
          { id: 'pocox6pro', name: 'POCO X6 Pro' },
          { id: 'pocox6', name: 'POCO X6' },
          { id: 'pocox5pro', name: 'POCO X5 Pro' },
          { id: 'pocox5', name: 'POCO X5' },
          { id: 'pocof5pro', name: 'POCO F5 Pro' },
          { id: 'pocof5', name: 'POCO F5' },
        ]
      }
    ]
  },
  {
    name: 'Honor',
    categories: [
      {
        title: 'Honor',
        devices: [
          { id: 'honor90', name: 'Honor 90' },
          { id: 'honor80', name: 'Honor 80' },
          { id: 'honor70', name: 'Honor 70' },
          { id: 'honormagic6pro', name: 'Honor Magic 6 Pro' },
          { id: 'honormagic6', name: 'Honor Magic 6' },
          { id: 'honormagic5pro', name: 'Honor Magic 5 Pro' },
          { id: 'honormagic5', name: 'Honor Magic 5' },
        ]
      }
    ]
  }
];

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(brands[0].name);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setSelectedBrand(brands[0].name);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentBrand = brands.find(b => b.name === selectedBrand);
  const allDevices = brands.flatMap(brand => 
    brand.categories.flatMap(category => 
      category.devices.map(device => ({
        ...device,
        brand: brand.name,
        category: category.title
      }))
    )
  );

  // Fonction pour afficher le nom complet de l'appareil avec son numéro de modèle
  const getDisplayName = (device: DeviceModel): React.ReactNode => {
    if (!device.modelNumber) return device.name;
    
    return (
      <>
        {device.name}{' '}
        <span className="inline-block font-bold text-indigo-600 ml-1 transform translate-y-0.5">
          ({device.modelNumber})
        </span>
      </>
    );
  };

  // Filtrer les appareils en fonction du terme de recherche ou afficher les appareils de la marque sélectionnée
  const filteredDevices = searchTerm
    ? allDevices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (device.modelNumber && device.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : currentBrand?.categories.flatMap(category => 
        category.devices.map(device => ({
          ...device,
          brand: currentBrand.name,
          category: category.title
        }))
      ) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b">
          <h2 className="text-base font-medium text-gray-900">
            Sélectionner un appareil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-2 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 pl-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 min-h-0">
          {/* Brand tabs */}
          <div className="w-32 border-r bg-gray-50 flex flex-col overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => setSelectedBrand(brand.name)}
                className={`text-left px-3 py-1.5 text-sm transition-colors ${
                  selectedBrand === brand.name
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>

          {/* Device list */}
          <div className="flex-1 overflow-y-auto">
            {!searchTerm ? (
              // Affichage normal par catégories quand il n'y a pas de recherche
              <div className="grid grid-cols-3 gap-4 p-4">
                {currentBrand?.categories
                  .sort((a, b) => {
                    // Ordre personnalisé pour les catégories Apple
                    const order = ['iPhone', 'iPad Pro', 'iPad Air', 'iPad', 'iPad Mini', 'Apple Watch'];
                    return order.indexOf(a.title) - order.indexOf(b.title);
                  })
                  .map((category) => (
                    <div key={category.title} className="space-y-1">
                      <h3 className="text-xs font-medium text-gray-500 mb-1">
                        {category.title}
                      </h3>
                      <div className="space-y-0.5">
                        {category.devices.map((device) => (
                          <button
                            key={device.id}
                            onClick={() => {
                              onSelect(currentBrand.name, device.name);
                              onClose();
                            }}
                            className="w-full text-left px-1 py-0.5 text-sm rounded hover:bg-indigo-50 transition-colors"
                          >
                            {getDisplayName(device)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              // Affichage des résultats de recherche
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Résultats de recherche pour "{searchTerm}"
                </h3>
                <div className="space-y-1">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => {
                          onSelect(device.brand, device.name);
                          onClose();
                        }}
                        className="w-full text-left p-1.5 text-sm rounded hover:bg-indigo-50 transition-colors border-b border-gray-100"
                      >
                        <div className="font-medium">{getDisplayName(device)}</div>
                        <div className="text-xs text-gray-500">{device.brand} - {device.category}</div>
                      </button>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 p-2">Aucun résultat trouvé</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
