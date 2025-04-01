import React, { useState } from 'react';
import { DeviceSelector } from './DeviceSelector';

export const TestDeviceSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('');

  const handleSelect = (brand: string, deviceName: string) => {
    setSelectedBrand(brand);
    setSelectedDevice(deviceName);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Device Selector</h1>
      
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Open Device Selector
      </button>
      
      {selectedBrand && selectedDevice && (
        <div className="mt-4 p-4 border rounded-md">
          <h2 className="text-lg font-semibold">Selected Device:</h2>
          <p>Brand: {selectedBrand}</p>
          <p>Device: {selectedDevice}</p>
        </div>
      )}
      
      <DeviceSelector 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onSelect={handleSelect}
      />
    </div>
  );
};
