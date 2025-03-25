import React, { useState } from 'react';
import { PatternLock } from './PatternLock';

export interface DiagnosticData {
  startupState: string;
  screen: {
    display: string[];
    touch: string[];
    glass: string[];
  };
  chassis: string[];
  mainFunctions: {
    faceId: string;
    frontCamera: string;
    backCamera: string;
    microphone: string;
    chargingPort: string;
  };
  unlockMethod: {
    type: 'code' | 'password' | 'pattern' | '';
    value: string;
  };
}

interface DiagnosticFormProps {
  onChange: (data: DiagnosticData) => void;
  initialValues?: DiagnosticData;
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
  onChange,
  initialValues
}) => {
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>(
    initialValues || {
      startupState: '',
      screen: {
        display: [],
        touch: [],
        glass: []
      },
      chassis: [],
      mainFunctions: {
        faceId: '',
        frontCamera: '',
        backCamera: '',
        microphone: '',
        chargingPort: ''
      },
      unlockMethod: {
        type: '',
        value: ''
      }
    }
  );

  const handleChange = (update: Partial<DiagnosticData>) => {
    const newData = { ...diagnosticData, ...update };
    setDiagnosticData(newData);
    onChange(newData);
  };

  const handleArrayToggle = (field: keyof DiagnosticData, subfield: string | null, value: string) => {
    if (subfield) {
      const currentArray = (diagnosticData[field] as any)[subfield] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item: string) => item !== value)
        : [...currentArray, value];
      
      handleChange({
        [field]: {
          ...(diagnosticData[field] as any),
          [subfield]: newArray
        }
      } as any);
    } else {
      const currentArray = diagnosticData[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      handleChange({
        [field]: newArray
      } as any);
    }
  };

  return (
    <div className="space-y-8">
      {/* État de démarrage */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">État de démarrage</h3>
        <div className="space-y-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={diagnosticData.startupState === 'Démarre et fonctionnel'}
              onChange={() => handleChange({ startupState: 'Démarre et fonctionnel' })}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Démarre et fonctionnel</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={diagnosticData.startupState === 'Ne démarre pas'}
              onChange={() => handleChange({ startupState: 'Ne démarre pas' })}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Ne démarre pas</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              checked={diagnosticData.startupState === 'Démarre mais problèmes'}
              onChange={() => handleChange({ startupState: 'Démarre mais problèmes' })}
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Démarre mais problèmes</span>
          </label>
        </div>
      </div>

      {/* État de l'écran */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">État de l'écran</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Affichage</h4>
            <div className="space-y-2">
              {['Fonctionne normalement', 'Lignes/pixels morts', 'Pas d\'affichage', 'Rétroéclairage HS'].map(option => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={diagnosticData.screen.display.includes(option)}
                    onChange={() => handleArrayToggle('screen', 'display', option)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tactile</h4>
            <div className="space-y-2">
              {['Fonctionne normalement', 'Zones mortes', 'Ne répond pas', 'Fantômes'].map(option => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={diagnosticData.screen.touch.includes(option)}
                    onChange={() => handleArrayToggle('screen', 'touch', option)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Vitre & Bezel</h4>
            <div className="space-y-2">
              {['Intact', 'Rayures légères', 'Rayures profondes', 'Fissures', 'Se décolle du Bezel'].map(option => (
                <label key={option} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={diagnosticData.screen.glass.includes(option)}
                    onChange={() => handleArrayToggle('screen', 'glass', option)}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* État du châssis */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">État du châssis</h3>
        <div className="space-y-2">
          {[
            'Intact',
            'Rayures légères',
            'Rayures profondes',
            'Coins abîmés',
            'Châssis déformé/tordu',
            'Traces d\'oxydation'
          ].map(option => (
            <label key={option} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                checked={diagnosticData.chassis.includes(option)}
                onChange={() => handleArrayToggle('chassis', null, option)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Fonctions principales */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctions principales</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Face ID</label>
            <select
              value={diagnosticData.mainFunctions.faceId}
              onChange={(e) => handleChange({
                mainFunctions: { ...diagnosticData.mainFunctions, faceId: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un état</option>
              <option value="OK">OK</option>
              <option value="HS">HS</option>
              <option value="Non applicable">Non applicable</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caméra FaceTime</label>
            <select
              value={diagnosticData.mainFunctions.frontCamera}
              onChange={(e) => handleChange({
                mainFunctions: { ...diagnosticData.mainFunctions, frontCamera: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un état</option>
              <option value="OK">OK</option>
              <option value="Problème de mise au point">Problème de mise au point</option>
              <option value="Image floue">Image floue</option>
              <option value="HS">HS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caméra arrière</label>
            <select
              value={diagnosticData.mainFunctions.backCamera}
              onChange={(e) => handleChange({
                mainFunctions: { ...diagnosticData.mainFunctions, backCamera: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un état</option>
              <option value="OK">OK</option>
              <option value="Problème de mise au point">Problème de mise au point</option>
              <option value="Image floue">Image floue</option>
              <option value="HS">HS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Micro</label>
            <select
              value={diagnosticData.mainFunctions.microphone}
              onChange={(e) => handleChange({
                mainFunctions: { ...diagnosticData.mainFunctions, microphone: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un état</option>
              <option value="OK">OK</option>
              <option value="Grésillements">Grésillements</option>
              <option value="Son faible">Son faible</option>
              <option value="HS">HS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connecteur de charge</label>
            <select
              value={diagnosticData.mainFunctions.chargingPort}
              onChange={(e) => handleChange({
                mainFunctions: { ...diagnosticData.mainFunctions, chargingPort: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Sélectionner un état</option>
              <option value="OK">OK</option>
              <option value="Problème de charge ou de synchronisation">Problème de charge ou de synchronisation</option>
              <option value="HS">HS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Verrouillage de l'appareil */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Verrouillage de l'appareil</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de verrouillage</label>
            <div className="space-y-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={diagnosticData.unlockMethod.type === 'code'}
                  onChange={() => handleChange({
                    unlockMethod: { type: 'code', value: '' }
                  })}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Code simple (chiffres)</span>
              </label>
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  checked={diagnosticData.unlockMethod.type === 'password'}
                  onChange={() => handleChange({
                    unlockMethod: { type: 'password', value: '' }
                  })}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Mot de passe alphanumérique</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  checked={diagnosticData.unlockMethod.type === 'pattern'}
                  onChange={() => handleChange({
                    unlockMethod: { type: 'pattern', value: '' }
                  })}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="ml-2">Déverrouillage par pattern</span>
              </label>
            </div>
          </div>

          {diagnosticData.unlockMethod.type === 'code' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <input
                type="text"
                value={diagnosticData.unlockMethod.value}
                onChange={(e) => handleChange({
                  unlockMethod: { ...diagnosticData.unlockMethod, value: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez le code"
              />
            </div>
          )}

          {diagnosticData.unlockMethod.type === 'password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="text"
                value={diagnosticData.unlockMethod.value}
                onChange={(e) => handleChange({
                  unlockMethod: { ...diagnosticData.unlockMethod, value: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez le mot de passe"
              />
            </div>
          )}

          {diagnosticData.unlockMethod.type === 'pattern' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schéma de déverrouillage
              </label>
              <PatternLock
                onChange={(pattern) => handleChange({
                  unlockMethod: { ...diagnosticData.unlockMethod, value: pattern }
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};