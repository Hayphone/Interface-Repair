import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface DeviceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (brand: string, deviceName: string) => void;
}

interface DeviceCategory {
  title: string;
  devices: Array<{
    id: string;
    name: string;
  }>;
}

interface BrandCategory {
  name: string;
  categories: DeviceCategory[];
}

const brands: BrandCategory[] = [
  {
    name: 'Apple',
    categories: [
      {
        title: 'iPhone',
        devices: [
          { id: 'iphone16', name: 'iPhone 16' },
          { id: 'iphone16plus', name: 'iPhone 16 Plus' },
          { id: 'iphone16pro', name: 'iPhone 16 Pro' },
          { id: 'iphone16promax', name: 'iPhone 16 Pro Max' },
          { id: 'iphone15', name: 'iPhone 15' },
          { id: 'iphone15plus', name: 'iPhone 15 Plus' },
          { id: 'iphone15pro', name: 'iPhone 15 Pro' },
          { id: 'iphone15promax', name: 'iPhone 15 Pro Max' },
          { id: 'iphone14', name: 'iPhone 14' },
          { id: 'iphone14plus', name: 'iPhone 14 Plus' },
          { id: 'iphone14pro', name: 'iPhone 14 Pro' },
          { id: 'iphone14promax', name: 'iPhone 14 Pro Max' },
          { id: 'iphone13', name: 'iPhone 13' },
          { id: 'iphone13mini', name: 'iPhone 13 Mini' },
          { id: 'iphone13pro', name: 'iPhone 13 Pro' },
          { id: 'iphone13promax', name: 'iPhone 13 Pro Max' },
          { id: 'iphone12', name: 'iPhone 12' },
          { id: 'iphone12mini', name: 'iPhone 12 Mini' },
          { id: 'iphone12pro', name: 'iPhone 12 Pro' },
          { id: 'iphone12promax', name: 'iPhone 12 Pro Max' },
          { id: 'iphone11', name: 'iPhone 11' },
          { id: 'iphone11pro', name: 'iPhone 11 Pro' },
          { id: 'iphone11promax', name: 'iPhone 11 Pro Max' },
          { id: 'iphonexs', name: 'iPhone XS' },
          { id: 'iphonexsmax', name: 'iPhone XS Max' },
          { id: 'iphonexr', name: 'iPhone XR' },
          { id: 'iphonex', name: 'iPhone X' },
          { id: 'iphone8', name: 'iPhone 8' },
          { id: 'iphone8plus', name: 'iPhone 8 Plus' },
          { id: 'iphonese3', name: 'iPhone SE (3ème génération)' },
          { id: 'iphonese2', name: 'iPhone SE (2ème génération)' },
        ]
      },
      {
        title: 'iPad',
        devices: [
          { id: 'ipad10', name: 'iPad 10 (2022)' },
          { id: 'ipad9', name: 'iPad 9 (2021)' },
          { id: 'ipad8', name: 'iPad 8 (2020)' },
          { id: 'ipad7', name: 'iPad 7 (2019)' },
          { id: 'ipad6', name: 'iPad 6 (2018)' },
          { id: 'ipad5', name: 'iPad 5 (2017)' },
        ]
      },
      {
        title: 'iPad Pro',
        devices: [
          { id: 'ipadpro13_7', name: 'iPad Pro 13" 7e Gén (2024)' },
          { id: 'ipadpro129_6', name: 'iPad Pro 12.9" 6e Gén (2022)' },
          { id: 'ipadpro129_5', name: 'iPad Pro 12.9" 5e Gén (2021)' },
          { id: 'ipadpro129_4', name: 'iPad Pro 12.9" 4e Gén (2020)' },
          { id: 'ipadpro129_3', name: 'iPad Pro 12.9" 3e Gén (2018)' },
          { id: 'ipadpro11_5', name: 'iPad Pro 11" 5e Gén (2024)' },
          { id: 'ipadpro11_4', name: 'iPad Pro 11" 4e Gén (2022)' },
          { id: 'ipadpro11_3', name: 'iPad Pro 11" 3e Gén (2021)' },
        ]
      },
      {
        title: 'iPad Air',
        devices: [
          { id: 'ipadair6_13', name: 'iPad Air 6 13" (2024)' },
          { id: 'ipadair6_11', name: 'iPad Air 6 11" (2024)' },
          { id: 'ipadair5', name: 'iPad Air 5 (2022)' },
          { id: 'ipadair4', name: 'iPad Air 4 (2020)' },
          { id: 'ipadair3', name: 'iPad Air 3 (2019)' },
        ]
      },
      {
        title: 'iPad mini',
        devices: [
          { id: 'ipadmini7', name: 'iPad mini 7' },
          { id: 'ipadmini6', name: 'iPad mini 6 (2021)' },
          { id: 'ipadmini5', name: 'iPad mini 5 (2019)' },
          { id: 'ipadmini4', name: 'iPad mini 4' },
        ]
      },
      {
        title: 'Apple Watch',
        devices: [
          { id: 'watch9_45', name: 'Series 9 (45mm)' },
          { id: 'watch9_41', name: 'Series 9 (41mm)' },
          { id: 'watch8_45', name: 'Series 8 (45mm)' },
          { id: 'watch8_41', name: 'Series 8 (41mm)' },
          { id: 'watch7_45', name: 'Series 7 (45mm)' },
          { id: 'watch7_41', name: 'Series 7 (41mm)' },
          { id: 'watchse2_44', name: 'Series SE2 (44mm)' },
          { id: 'watchse2_40', name: 'Series SE2 (40mm)' },
        ]
      }
    ]
  },
  {
    name: 'Samsung',
    categories: [
      {
        title: 'Galaxy S',
        devices: [
          { id: 'galaxys24ultra', name: 'Galaxy S24 Ultra' },
          { id: 'galaxys24plus', name: 'Galaxy S24+' },
          { id: 'galaxys24', name: 'Galaxy S24' },
          { id: 'galaxys23ultra', name: 'Galaxy S23 Ultra' },
          { id: 'galaxys23plus', name: 'Galaxy S23+' },
          { id: 'galaxys23', name: 'Galaxy S23' },
          { id: 'galaxys22ultra', name: 'Galaxy S22 Ultra' },
          { id: 'galaxys22plus', name: 'Galaxy S22+' },
          { id: 'galaxys22', name: 'Galaxy S22' },
          { id: 'galaxys21ultra', name: 'Galaxy S21 Ultra' },
          { id: 'galaxys21plus', name: 'Galaxy S21+' },
          { id: 'galaxys21', name: 'Galaxy S21' },
        ]
      },
      {
        title: 'Galaxy Z',
        devices: [
          { id: 'galaxyzfold5', name: 'Galaxy Z Fold 5' },
          { id: 'galaxyzflip5', name: 'Galaxy Z Flip 5' },
          { id: 'galaxyzfold4', name: 'Galaxy Z Fold 4' },
          { id: 'galaxyzflip4', name: 'Galaxy Z Flip 4' },
          { id: 'galaxyzfold3', name: 'Galaxy Z Fold 3' },
          { id: 'galaxyzflip3', name: 'Galaxy Z Flip 3' },
        ]
      },
      {
        title: 'Galaxy A',
        devices: [
          { id: 'galaxya54', name: 'Galaxy A54' },
          { id: 'galaxya53', name: 'Galaxy A53' },
          { id: 'galaxya34', name: 'Galaxy A34' },
          { id: 'galaxya33', name: 'Galaxy A33' },
          { id: 'galaxya14', name: 'Galaxy A14' },
          { id: 'galaxya13', name: 'Galaxy A13' },
        ]
      },
      {
        title: 'Galaxy Tab',
        devices: [
          { id: 'galaxytabs9ultra', name: 'Galaxy Tab S9 Ultra' },
          { id: 'galaxytabs9plus', name: 'Galaxy Tab S9+' },
          { id: 'galaxytabs9', name: 'Galaxy Tab S9' },
          { id: 'galaxytabs8ultra', name: 'Galaxy Tab S8 Ultra' },
          { id: 'galaxytabs8plus', name: 'Galaxy Tab S8+' },
          { id: 'galaxytabs8', name: 'Galaxy Tab S8' },
        ]
      }
    ]
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
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBrandClick = (brandName: string) => {
    setExpandedBrand(expandedBrand === brandName ? null : brandName);
    setExpandedCategory(null);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setExpandedCategory(expandedCategory === categoryTitle ? null : categoryTitle);
  };

  const filteredBrands = brands.map(brand => ({
    ...brand,
    categories: brand.categories.map(category => ({
      ...category,
      devices: category.devices.filter(device =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.devices.length > 0)
  })).filter(brand => brand.categories.length > 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Sélectionner un appareil
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {filteredBrands.map((brand) => (
              <div key={brand.name} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => handleBrandClick(brand.name)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-lg font-medium">{brand.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 transform transition-transform ${
                      expandedBrand === brand.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                {expandedBrand === brand.name && (
                  <div className="p-4 space-y-4">
                    {brand.categories.map((category) => (
                      <div key={category.title} className="border rounded-lg">
                        <button
                          onClick={() => handleCategoryClick(category.title)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium">{category.title}</span>
                          <ChevronDown
                            className={`h-4 w-4 transform transition-transform ${
                              expandedCategory === category.title ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {expandedCategory === category.title && (
                          <div className="p-2 space-y-1">
                            {category.devices.map((device) => (
                              <button
                                key={device.id}
                                onClick={() => {
                                  onSelect(brand.name, device.name);
                                  onClose();
                                }}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              >
                                {device.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};