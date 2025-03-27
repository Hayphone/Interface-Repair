import React, { useState, useEffect } from 'react';
import { Calculator, Info } from 'lucide-react';

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
    tvaAmount: number;
  }) => void;
  initialValues?: {
    costHT?: number;
    marginPercent?: number;
    shippingCost?: number;
  };
}

type TvaOption = {
  rate: number;
  label: string;
  isMarginBased?: boolean;
  tooltip?: string;
};

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onPriceCalculated,
  initialValues = {}
}) => {
  const [tvaOption, setTvaOption] = useState<TvaOption>({ rate: 20, label: '20%' });
  const [costHT, setCostHT] = useState(initialValues.costHT || 0);
  const [costTTC, setCostTTC] = useState(0);
  const [priceHT, setPriceHT] = useState(0);
  const [priceTTC, setPriceTTC] = useState(0);
  const [marginPercent, setMarginPercent] = useState(initialValues.marginPercent || 0);
  const [marginHT, setMarginHT] = useState(0);
  const [marginTTC, setMarginTTC] = useState(0);
  const [shippingCost, setShippingCost] = useState(initialValues.shippingCost || 10);
  const [totalAmount, setTotalAmount] = useState(0);
  const [tvaAmount, setTvaAmount] = useState(0);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const tvaOptions: TvaOption[] = [
    { rate: 20, label: '20%' },
    { rate: 10, label: '10%' },
    { rate: 8.5, label: '8.5%' },
    { rate: 5.5, label: '5.5%' },
    { rate: 2.1, label: '2.1%' },
    { 
      rate: 20, 
      label: 'TVA sur marge (France)', 
      isMarginBased: true,
      tooltip: 'Appliqué uniquement sur la marge bénéficiaire. Recommandé pour les produits d\'occasion (conformément à l\'article 297 A du CGI).'
    },
    { rate: 0, label: '0%' }
  ];

  const round = (value: number) => Math.round(value * 100) / 100;

  const calculateFromCostHT = (value: number) => {
    const costTTC = round(value * (1 + tvaOption.rate / 100));
    const priceHT = round(value * (1 + marginPercent / 100));
    const marginHT = round(priceHT - value);

    let calculatedTVA: number;
    let calculatedPriceTTC: number;

    if (tvaOption.isMarginBased) {
      // TVA sur marge: TVA uniquement sur la marge
      calculatedTVA = round(marginHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(value + marginHT + calculatedTVA);
    } else {
      // TVA classique: TVA sur le prix HT total
      calculatedTVA = round(priceHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(priceHT * (1 + tvaOption.rate / 100));
    }

    const marginTTC = round(calculatedPriceTTC - costTTC);
    const total = round(calculatedPriceTTC + shippingCost);

    return { 
      costTTC, 
      priceHT, 
      priceTTC: calculatedPriceTTC, 
      marginHT, 
      marginTTC, 
      total,
      tvaAmount: calculatedTVA 
    };
  };

  const calculateFromCostTTC = (value: number) => {
    const costHT = round(value / (1 + tvaOption.rate / 100));
    const priceHT = round(costHT * (1 + marginPercent / 100));
    const marginHT = round(priceHT - costHT);

    let calculatedTVA: number;
    let calculatedPriceTTC: number;

    if (tvaOption.isMarginBased) {
      calculatedTVA = round(marginHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(costHT + marginHT + calculatedTVA);
    } else {
      calculatedTVA = round(priceHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(priceHT * (1 + tvaOption.rate / 100));
    }

    const marginTTC = round(calculatedPriceTTC - value);
    const total = round(calculatedPriceTTC + shippingCost);

    return { 
      costHT, 
      priceHT, 
      priceTTC: calculatedPriceTTC, 
      marginHT, 
      marginTTC, 
      total,
      tvaAmount: calculatedTVA 
    };
  };

  const calculateFromPriceHT = (value: number) => {
    const costHT = round(value / (1 + marginPercent / 100));
    const costTTC = round(costHT * (1 + tvaOption.rate / 100));
    const marginHT = round(value - costHT);

    let calculatedTVA: number;
    let calculatedPriceTTC: number;

    if (tvaOption.isMarginBased) {
      calculatedTVA = round(marginHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(costHT + marginHT + calculatedTVA);
    } else {
      calculatedTVA = round(value * (tvaOption.rate / 100));
      calculatedPriceTTC = round(value * (1 + tvaOption.rate / 100));
    }

    const marginTTC = round(calculatedPriceTTC - costTTC);
    const total = round(calculatedPriceTTC + shippingCost);

    return { 
      costHT, 
      costTTC, 
      priceTTC: calculatedPriceTTC, 
      marginHT, 
      marginTTC, 
      total,
      tvaAmount: calculatedTVA 
    };
  };

  const calculateFromPriceTTC = (value: number) => {
    let priceHT: number;
    let costHT: number;
    let marginHT: number;
    let calculatedTVA: number;

    if (tvaOption.isMarginBased) {
      // Pour la TVA sur marge, on doit d'abord déterminer la marge HT
      const basePrice = value - shippingCost; // Prix TTC sans frais de port
      const tvaRate = tvaOption.rate / 100;
      
      // On résout l'équation: basePrice = costHT + marginHT + (marginHT * tvaRate)
      // Où marginHT = priceHT - costHT
      costHT = round(basePrice / (1 + marginPercent / 100 * (1 + tvaRate)));
      priceHT = round(costHT * (1 + marginPercent / 100));
      marginHT = round(priceHT - costHT);
      calculatedTVA = round(marginHT * tvaRate);
    } else {
      priceHT = round(value / (1 + tvaOption.rate / 100));
      costHT = round(priceHT / (1 + marginPercent / 100));
      marginHT = round(priceHT - costHT);
      calculatedTVA = round(priceHT * (tvaOption.rate / 100));
    }

    const costTTC = round(costHT * (1 + tvaOption.rate / 100));
    const marginTTC = round(value - costTTC);
    const total = round(value + shippingCost);

    return { 
      costHT, 
      costTTC, 
      priceHT, 
      marginHT, 
      marginTTC, 
      total,
      tvaAmount: calculatedTVA 
    };
  };

  const calculateFromMarginPercent = (value: number) => {
    const priceHT = round(costHT * (1 + value / 100));
    const marginHT = round(priceHT - costHT);

    let calculatedTVA: number;
    let calculatedPriceTTC: number;

    if (tvaOption.isMarginBased) {
      calculatedTVA = round(marginHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(costHT + marginHT + calculatedTVA);
    } else {
      calculatedTVA = round(priceHT * (tvaOption.rate / 100));
      calculatedPriceTTC = round(priceHT * (1 + tvaOption.rate / 100));
    }

    const marginTTC = round(calculatedPriceTTC - costTTC);
    const total = round(calculatedPriceTTC + shippingCost);

    return { 
      priceHT, 
      priceTTC: calculatedPriceTTC, 
      marginHT, 
      marginTTC, 
      total,
      tvaAmount: calculatedTVA 
    };
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
      setTvaAmount(result.tvaAmount);
    }
  }, [costHT, tvaOption, marginPercent, shippingCost]);

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
        totalAmount,
        tvaAmount
      });
    }
  }, [costHT, costTTC, priceHT, priceTTC, marginPercent, marginHT, marginTTC, shippingCost, totalAmount, tvaAmount]);

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
          setTvaAmount(result.tvaAmount);
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
          setTvaAmount(result.tvaAmount);
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
          setTvaAmount(result.tvaAmount);
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
          setTvaAmount(result.tvaAmount);
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
          setTvaAmount(result.tvaAmount);
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
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TVA (%)
            </label>
            <div className="flex items-center">
              <select
                value={tvaOptions.findIndex(opt => 
                  opt.rate === tvaOption.rate && opt.isMarginBased === tvaOption.isMarginBased
                )}
                onChange={(e) => setTvaOption(tvaOptions[parseInt(e.target.value)])}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {tvaOptions.map((opt, index) => (
                  <option key={index} value={index}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {tvaOption.tooltip && (
                <div className="relative ml-2">
                  <Info
                    className="h-5 w-5 text-gray-400 cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute z-10 w-72 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-sm -right-2 top-6">
                      {tvaOption.tooltip}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TVA (€)
            </label>
            <input
              type="text"
              value={tvaAmount.toFixed(2)}
              readOnly
              className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
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
              readOnly
              className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
              readOnly
              className="w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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