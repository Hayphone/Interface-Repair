import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

interface PriceCalculatorProps {
  onPriceCalculated?: (prices: {
    costHT: number;
    costTTC: number;
    priceHT: number;
    priceTTC: number;
    marginPercent: number;
    marginHT: number;
    marginTTC: number;
    shippingCost: number;
    totalAmount: number;
  }) => void;
  initialValues?: {
    costHT?: number;
    marginPercent?: number;
    shippingCost?: number;
  };
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onPriceCalculated,
  initialValues = {}
}) => {
  const [tvaRate, setTvaRate] = useState(20);
  const [costHT, setCostHT] = useState(initialValues.costHT || 0);
  const [costTTC, setCostTTC] = useState(0);
  const [priceHT, setPriceHT] = useState(0);
  const [priceTTC, setPriceTTC] = useState(0);
  const [marginPercent, setMarginPercent] = useState(initialValues.marginPercent || 0);
  const [marginHT, setMarginHT] = useState(0);
  const [marginTTC, setMarginTTC] = useState(0);
  const [shippingCost, setShippingCost] = useState(initialValues.shippingCost || 10);
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);

  const tvaRates = [20, 10, 8.5, 5.5, 2.1, 0];

  const round = (value: number) => Math.round(value * 100) / 100;

  const calculateFromCostHT = (value: number) => {
    const costTTC = round(value * (1 + tvaRate / 100));
    const priceHT = round(value * (1 + marginPercent / 100));
    const priceTTC = round(priceHT * (1 + tvaRate / 100));
    const marginHT = round(priceHT - value);
    const marginTTC = round(priceTTC - costTTC);
    const total = round(priceTTC + shippingCost);

    return { costTTC, priceHT, priceTTC, marginHT, marginTTC, total };
  };

  const calculateFromCostTTC = (value: number) => {
    const costHT = round(value / (1 + tvaRate / 100));
    const priceHT = round(costHT * (1 + marginPercent / 100));
    const priceTTC = round(priceHT * (1 + tvaRate / 100));
    const marginHT = round(priceHT - costHT);
    const marginTTC = round(priceTTC - value);
    const total = round(priceTTC + shippingCost);

    return { costHT, priceHT, priceTTC, marginHT, marginTTC, total };
  };

  const calculateFromPriceHT = (value: number) => {
    const priceTTC = round(value * (1 + tvaRate / 100));
    const costHT = round(value / (1 + marginPercent / 100));
    const costTTC = round(costHT * (1 + tvaRate / 100));
    const marginHT = round(value - costHT);
    const marginTTC = round(priceTTC - costTTC);
    const total = round(priceTTC + shippingCost);

    return { costHT, costTTC, priceTTC, marginHT, marginTTC, total };
  };

  const calculateFromPriceTTC = (value: number) => {
    const priceHT = round(value / (1 + tvaRate / 100));
    const costHT = round(priceHT / (1 + marginPercent / 100));
    const costTTC = round(costHT * (1 + tvaRate / 100));
    const marginHT = round(priceHT - costHT);
    const marginTTC = round(value - costTTC);
    const total = round(value + shippingCost);

    return { costHT, costTTC, priceHT, marginHT, marginTTC, total };
  };

  const calculateFromMarginPercent = (value: number) => {
    const priceHT = round(costHT * (1 + value / 100));
    const priceTTC = round(priceHT * (1 + tvaRate / 100));
    const marginHT = round(priceHT - costHT);
    const marginTTC = round(priceTTC - costTTC);
    const total = round(priceTTC + shippingCost);

    return { priceHT, priceTTC, marginHT, marginTTC, total };
  };

  const calculateFromMarginHT = (value: number) => {
    const priceHT = round(costHT + value);
    const priceTTC = round(priceHT * (1 + tvaRate / 100));
    const marginPercent = round((value / costHT) * 100);
    const marginTTC = round(priceTTC - costTTC);
    const total = round(priceTTC + shippingCost);

    return { priceHT, priceTTC, marginPercent, marginTTC, total };
  };

  const calculateFromMarginTTC = (value: number) => {
    const priceTTC = round(costTTC + value);
    const priceHT = round(priceTTC / (1 + tvaRate / 100));
    const marginHT = round(priceHT - costHT);
    const marginPercent = round((marginHT / costHT) * 100);
    const total = round(priceTTC + shippingCost);

    return { priceHT, priceTTC, marginHT, marginPercent, total };
  };

  useEffect(() => {
    if (activeField !== 'costHT' && costHT > 0) {
      const result = calculateFromCostHT(costHT);
      setCostTTC(result.costTTC);
      setPriceHT(result.priceHT);
      setPriceTTC(result.priceTTC);
      setMarginHT(result.marginHT);
      setMarginTTC(result.marginTTC);
      setTotalAmount(result.total);
    }
  }, [costHT, tvaRate, marginPercent, shippingCost]);

  useEffect(() => {
    if (onPriceCalculated) {
      onPriceCalculated({
        costHT,
        costTTC,
        priceHT,
        priceTTC,
        marginPercent,
        marginHT,
        marginTTC,
        shippingCost,
        totalAmount
      });
    }
  }, [costHT, costTTC, priceHT, priceTTC, marginPercent, marginHT, marginTTC, shippingCost, totalAmount]);

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setActiveField(field);

    switch (field) {
      case 'costHT':
        setCostHT(numValue);
        if (numValue > 0) {
          const result = calculateFromCostHT(numValue);
          setCostTTC(result.costTTC);
          setPriceHT(result.priceHT);
          setPriceTTC(result.priceTTC);
          setMarginHT(result.marginHT);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'costTTC':
        setCostTTC(numValue);
        if (numValue > 0) {
          const result = calculateFromCostTTC(numValue);
          setCostHT(result.costHT);
          setPriceHT(result.priceHT);
          setPriceTTC(result.priceTTC);
          setMarginHT(result.marginHT);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'priceHT':
        setPriceHT(numValue);
        if (numValue > 0) {
          const result = calculateFromPriceHT(numValue);
          setCostHT(result.costHT);
          setCostTTC(result.costTTC);
          setPriceTTC(result.priceTTC);
          setMarginHT(result.marginHT);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'priceTTC':
        setPriceTTC(numValue);
        if (numValue > 0) {
          const result = calculateFromPriceTTC(numValue);
          setCostHT(result.costHT);
          setCostTTC(result.costTTC);
          setPriceHT(result.priceHT);
          setMarginHT(result.marginHT);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'marginPercent':
        setMarginPercent(numValue);
        if (costHT > 0) {
          const result = calculateFromMarginPercent(numValue);
          setPriceHT(result.priceHT);
          setPriceTTC(result.priceTTC);
          setMarginHT(result.marginHT);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'marginHT':
        setMarginHT(numValue);
        if (costHT > 0) {
          const result = calculateFromMarginHT(numValue);
          setPriceHT(result.priceHT);
          setPriceTTC(result.priceTTC);
          setMarginPercent(result.marginPercent);
          setMarginTTC(result.marginTTC);
          setTotalAmount(result.total);
        }
        break;

      case 'marginTTC':
        setMarginTTC(numValue);
        if (costTTC > 0) {
          const result = calculateFromMarginTTC(numValue);
          setPriceHT(result.priceHT);
          setPriceTTC(result.priceTTC);
          setMarginHT(result.marginHT);
          setMarginPercent(result.marginPercent);
          setTotalAmount(result.total);
        }
        break;

      case 'shippingCost':
        setShippingCost(numValue);
        setTotalAmount(round(priceTTC + numValue));
        break;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Calculator className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Calculateur de prix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TVA (%)
            </label>
            <select
              value={tvaRate}
              onChange={(e) => setTvaRate(parseFloat(e.target.value))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {tvaRates.map(rate => (
                <option key={rate} value={rate}>{rate}%</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coût de revient HT
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={costHT || ''}
              onChange={(e) => handleInputChange('costHT', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coût de revient TTC
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={costTTC || ''}
              onChange={(e) => handleInputChange('costTTC', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix de vente HT
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceHT || ''}
              onChange={(e) => handleInputChange('priceHT', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prix de vente TTC
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={priceTTC || ''}
              onChange={(e) => handleInputChange('priceTTC', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marge (%)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={marginPercent || ''}
              onChange={(e) => handleInputChange('marginPercent', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marge HT
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={marginHT || ''}
              onChange={(e) => handleInputChange('marginHT', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marge TTC
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={marginTTC || ''}
              onChange={(e) => handleInputChange('marginTTC', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t pt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Frais de port
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={shippingCost || ''}
            onChange={(e) => handleInputChange('shippingCost', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-900">Montant total à encaisser :</span>
            <span className="text-2xl font-bold text-indigo-600">{totalAmount.toFixed(2)} €</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            (Prix TTC + Frais de port)
          </p>
        </div>
      </div>
    </div>
  );
};