import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../stores/inventory';

const LOW_STOCK_THRESHOLD = 5;

export const LowStockAlert = () => {
  const { inventory } = useInventoryStore();
  const lowStockItems = inventory.filter(item => item.quantity <= LOW_STOCK_THRESHOLD);

  if (lowStockItems.length === 0) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Stock faible détecté
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <ul className="list-disc list-inside space-y-1">
              {lowStockItems.map(item => (
                <li key={item.id}>
                  {item.name} - {item.quantity} unité(s) restante(s)
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};