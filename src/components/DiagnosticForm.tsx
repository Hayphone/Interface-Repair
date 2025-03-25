import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { PatternLock } from './PatternLock';

interface DiagnosticFormProps {
  onChange: (diagnostics: DiagnosticData) => void;
  initialValues?: DiagnosticData;
}

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
    type: 'pin' | 'password' | 'pattern' | null;
    value: string;
  };
}

export const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
  onChange,
  initialValues
}) => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData>(initialValues || {
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
      type: null,
      value: ''
    }
  });

  const handleChange = (newData: Partial<DiagnosticData>) => {
    const updated = { ...diagnostics, ...newData };
    setDiagnostics(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* État de démarrage */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">État de démarrage</h3>
        <div className="space-y-2">
          {['Démarre et fonctionnel', 'Redémarre sur logo', 'Ne démarre pas'].map((state) => (
            <label key={state} className="flex items-center">
              <input
                type="radio"
                name="startupState"
                value={state}
                checked={diagnostics.startupState === state}
                onChange={(e) => handleChange({ startupState: e.target.value })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">{state}</span>
            </label>
          ))}
        </div>
      </div>

      {/* État de l'écran */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">État de l'écran</h3>
        
        <div className="space-y-6">
          {/* Affichage */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Affichage</h4>
            <div className="space-y-2">
              {['OK', 'Tâche noire', 'Tâche jaune/blanche', 'Bande couleur', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={diagnostics.screen.display.includes(option)}
                    onChange={(e) => {
                      const newDisplay = e.target.checked
                        ? [...diagnostics.screen.display, option]
                        : diagnostics.screen.display.filter(item => item !== option);
                      handleChange({
                        screen: { ...diagnostics.screen, display: newDisplay }
                      });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tactile */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Tactile</h4>
            <div className="space-y-2">
              {['OK', 'Clique tout seul', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={diagnostics.screen.touch.includes(option)}
                    onChange={(e) => {
                      const newTouch = e.target.checked
                        ? [...diagnostics.screen.touch, option]
                        : diagnostics.screen.touch.filter(item => item !== option);
                      handleChange({
                        screen: { ...diagnostics.screen, touch: newTouch }
                      });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Vitre & Bezel */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Vitre & Bezel</h4>
            <div className="space-y-2">
              {[
                'OK',
                'Fissure vitre',
                { label: 'Se décolle du Bezel', warning: 'Risque prévenir client' }
              ].map((option) => (
                <label key={typeof option === 'string' ? option : option.label} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={diagnostics.screen.glass.includes(typeof option === 'string' ? option : option.label)}
                    onChange={(e) => {
                      const value = typeof option === 'string' ? option : option.label;
                      const newGlass = e.target.checked
                        ? [...diagnostics.screen.glass, value]
                        : diagnostics.screen.glass.filter(item => item !== value);
                      handleChange({
                        screen: { ...diagnostics.screen, glass: newGlass }
                      });
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    {typeof option === 'string' ? option : option.label}
                    {typeof option !== 'string' && option.warning && (
                      <span className="ml-2 text-amber-600 text-sm flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {option.warning}
                      </span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* État du smartphone */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">État du smartphone</h3>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Châssis & Vitre arrière</h4>
          <div className="space-y-2">
            {[
              'Tout OK',
              { label: 'Châssis déformé/tordu', warning: 'Risque prévenir client' },
              'Vitre arrière fissurée',
              'Châssis OK',
              'Vitre arrière OK'
            ].map((option) => (
              <label key={typeof option === 'string' ? option : option.label} className="flex items-center">
                <input
                  type="checkbox"
                  checked={diagnostics.chassis.includes(typeof option === 'string' ? option : option.label)}
                  onChange={(e) => {
                    const value = typeof option === 'string' ? option : option.label;
                    const newChassis = e.target.checked
                      ? [...diagnostics.chassis, value]
                      : diagnostics.chassis.filter(item => item !== value);
                    handleChange({ chassis: newChassis });
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-gray-700">
                  {typeof option === 'string' ? option : option.label}
                  {typeof option !== 'string' && option.warning && (
                    <span className="ml-2 text-amber-600 text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {option.warning}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Fonctions principales */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Fonctions principales</h3>
        <div className="space-y-6">
          {/* Face ID */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Face ID</h4>
            <div className="space-y-2">
              {['OK', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="faceId"
                    value={option}
                    checked={diagnostics.mainFunctions.faceId === option}
                    onChange={(e) => handleChange({
                      mainFunctions: { ...diagnostics.mainFunctions, faceId: e.target.value }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Caméra FaceTime */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Caméra FaceTime</h4>
            <div className="space-y-2">
              {['OK', 'Flou / saleté', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="frontCamera"
                    value={option}
                    checked={diagnostics.mainFunctions.frontCamera === option}
                    onChange={(e) => handleChange({
                      mainFunctions: { ...diagnostics.mainFunctions, frontCamera: e.target.value }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Caméra arrière */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Caméra arrière</h4>
            <div className="space-y-2">
              {['OK', 'Flou / saleté', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="backCamera"
                    value={option}
                    checked={diagnostics.mainFunctions.backCamera === option}
                    onChange={(e) => handleChange({
                      mainFunctions: { ...diagnostics.mainFunctions, backCamera: e.target.value }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Micro Dictaphone */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Micro Dictaphone</h4>
            <div className="space-y-2">
              {['OK', 'Grésille / son faible', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="microphone"
                    value={option}
                    checked={diagnostics.mainFunctions.microphone === option}
                    onChange={(e) => handleChange({
                      mainFunctions: { ...diagnostics.mainFunctions, microphone: e.target.value }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Connecteur de charge */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Connecteur de charge</h4>
            <div className="space-y-2">
              {['OK', 'Problème de charge ou de synchronisation', 'HS'].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name="chargingPort"
                    value={option}
                    checked={diagnostics.mainFunctions.chargingPort === option}
                    onChange={(e) => handleChange({
                      mainFunctions: { ...diagnostics.mainFunctions, chargingPort: e.target.value }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Verrouillage de l'appareil */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Verrouillage de l'appareil</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de verrouillage
            </label>
            <div className="space-y-2">
              {[
                { id: 'pin', label: 'Code simple (chiffres)' },
                { id: 'password', label: 'Mot de passe alphanumérique' },
                { id: 'pattern', label: 'Déverrouillage par pattern' }
              ].map((option) => (
                <label key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    name="unlockType"
                    value={option.id}
                    checked={diagnostics.unlockMethod.type === option.id}
                    onChange={(e) => handleChange({
                      unlockMethod: { type: e.target.value as 'pin' | 'password' | 'pattern', value: '' }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {diagnostics.unlockMethod.type === 'pin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code PIN
              </label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={6}
                value={diagnostics.unlockMethod.value}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  handleChange({
                    unlockMethod: { ...diagnostics.unlockMethod, value }
                  });
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez le code PIN"
              />
            </div>
          )}

          {diagnostics.unlockMethod.type === 'password' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="text"
                value={diagnostics.unlockMethod.value}
                onChange={(e) => handleChange({
                  unlockMethod: { ...diagnostics.unlockMethod, value: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Entrez le mot de passe"
              />
            </div>
          )}

          {diagnostics.unlockMethod.type === 'pattern' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schéma de déverrouillage
              </label>
              <PatternLock
                onChange={(pattern) => handleChange({
                  unlockMethod: { ...diagnostics.unlockMethod, value: pattern }
                })}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};