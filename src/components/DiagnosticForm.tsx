import React, { useState } from 'react';
import { PatternLock } from './PatternLock';
import { 
  Zap, 
  Smartphone,
  Lock, 
  Camera, 
  Mic, 
  BatteryCharging, 
  Battery, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  AlertOctagon,
  ChevronDown,
  Shield,
  Wifi,
  Volume2,
  Bluetooth
} from 'lucide-react';

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
    battery: string;
    wifi?: string;
    bluetooth?: string;
    speaker?: string;
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

const DiagnosticForm: React.FC<DiagnosticFormProps> = ({
  onChange,
  initialValues
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['startup']);
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
        chargingPort: '',
        battery: '',
        wifi: '',
        bluetooth: '',
        speaker: ''
      },
      unlockMethod: {
        type: '',
        value: ''
      }
    }
  );

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Lock':
        return <Lock className="h-5 w-5 text-gray-500" />;
      case 'Camera':
        return <Camera className="h-5 w-5 text-gray-500" />;
      case 'Volume2':
        return <Volume2 className="h-5 w-5 text-gray-500" />;
      case 'Wifi':
        return <Wifi className="h-5 w-5 text-gray-500" />;
      case 'Battery':
        return <Battery className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const sections = [
    {
      id: 'startup',
      title: 'État de démarrage',
      icon: <Zap className="h-6 w-6 text-indigo-600" />,
      options: ['Démarre et fonctionnel', 'Ne démarre pas', 'Reboot sur logo']
    },
    {
      id: 'screen',
      title: 'État de l\'écran',
      icon: <Smartphone className="h-6 w-6 text-indigo-600" />,
      subsections: [
        {
          title: 'Affichage',
          options: ['Fonctionne normalement', 'Lignes/pixels morts', 'Pas d\'affichage', 'Rétroéclairage HS', 'Fantômes']
        },
        {
          title: 'Tactile',
          options: ['Fonctionne normalement', 'Zones mortes', 'Ne répond pas']
        },
        {
          title: 'Vitre & Bezel',
          options: ['Intact', 'Rayures légères', 'Rayures profondes', 'Fissures', 'Se décolle du Bezel']
        }
      ]
    },
    {
      id: 'functions',
      title: 'Fonctions principales',
      icon: <Shield className="h-6 w-6 text-indigo-600" />,
      subsections: [
        {
          title: 'Face ID',
          iconName: 'Lock',
          options: ['OK', 'HS', 'Non applicable']
        },
        {
          title: 'Caméras',
          iconName: 'Camera',
          options: ['OK', 'Problème de mise au point', 'Image floue', 'HS']
        },
        {
          title: 'Audio',
          iconName: 'Volume2',
          options: ['OK', 'Grésillements', 'Son faible', 'HS']
        },
        {
          title: 'Connectivité',
          iconName: 'Wifi',
          options: ['OK', 'Signal faible', 'HS']
        },
        {
          title: 'Batterie',
          iconName: 'Battery',
          options: ['OK', 'Usé', 'Gonflé', 'HS']
        }
      ]
    },
    {
      id: 'unlock',
      title: 'Verrouillage',
      icon: <Lock className="h-6 w-6 text-indigo-600" />
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

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

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'OK':
      case 'Fonctionne normalement':
      case 'Intact':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'HS':
      case 'Ne répond pas':
      case 'Pas d\'affichage':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="space-y-4">
      {sections.map(section => (
        <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {section.icon}
              <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
            </div>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform ${
                openSections.includes(section.id) ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {openSections.includes(section.id) && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              {'options' in section ? (
                <div className="space-y-2">
                  {section.options.map(option => (
                    <label
                      key={option}
                      className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                        diagnosticData[section.id as keyof DiagnosticData] === option 
                          ? getStatusBackground(option)
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={diagnosticData[section.id as keyof DiagnosticData] === option}
                        onChange={() => handleChange({ [section.id]: option } as any)}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2">{option}</span>
                    </label>
                  ))}
                </div>
              ) : 'subsections' in section ? (
                <div className="space-y-6">
                  {section.subsections?.map((subsection, idx) => (
                    <div key={idx}>
                      <div className="flex items-center space-x-2 mb-3">
                        {subsection.iconName && renderIcon(subsection.iconName)}
                        <h4 className="font-medium text-gray-700">{subsection.title}</h4>
                      </div>
                      <div className="space-y-2">
                        {subsection.options.map(option => (
                          <label
                            key={option}
                            className={`flex items-center p-3 rounded-lg border transition-colors cursor-pointer ${
                              (diagnosticData.screen as any)[subsection.title.toLowerCase()]?.includes(option)
                                ? getStatusBackground(option)
                                : 'bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={(diagnosticData.screen as any)[subsection.title.toLowerCase()]?.includes(option)}
                              onChange={() => handleArrayToggle('screen', subsection.title.toLowerCase(), option)}
                              className="form-checkbox h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : section.id === 'unlock' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={diagnosticData.unlockMethod.type === 'code'}
                        onChange={() => handleChange({
                          unlockMethod: { type: 'code', value: '' }
                        })}
                        className="sr-only"
                      />
                      <Lock className={`h-8 w-8 ${
                        diagnosticData.unlockMethod.type === 'code' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <span className="mt-2 text-sm font-medium">Code simple</span>
                    </label>

                    <label className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={diagnosticData.unlockMethod.type === 'password'}
                        onChange={() => handleChange({
                          unlockMethod: { type: 'password', value: '' }
                        })}
                        className="sr-only"
                      />
                      <Shield className={`h-8 w-8 ${
                        diagnosticData.unlockMethod.type === 'password' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <span className="mt-2 text-sm font-medium">Mot de passe</span>
                    </label>

                    <label className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        checked={diagnosticData.unlockMethod.type === 'pattern'}
                        onChange={() => handleChange({
                          unlockMethod: { type: 'pattern', value: '' }
                        })}
                        className="sr-only"
                      />
                      <Lock className={`h-8 w-8 ${
                        diagnosticData.unlockMethod.type === 'pattern' ? 'text-indigo-600' : 'text-gray-400'
                      }`} />
                      <span className="mt-2 text-sm font-medium">Pattern</span>
                    </label>
                  </div>

                  {diagnosticData.unlockMethod.type === 'pattern' && (
                    <div className="mt-4">
                      <PatternLock
                        onChange={(pattern) => handleChange({
                          unlockMethod: { ...diagnosticData.unlockMethod, value: pattern }
                        })}
                        initialValue={diagnosticData.unlockMethod.value}
                      />
                    </div>
                  )}

                  {(diagnosticData.unlockMethod.type === 'code' || diagnosticData.unlockMethod.type === 'password') && (
                    <div className="mt-4">
                      <input
                        type={diagnosticData.unlockMethod.type === 'code' ? 'number' : 'text'}
                        value={diagnosticData.unlockMethod.value}
                        onChange={(e) => handleChange({
                          unlockMethod: { ...diagnosticData.unlockMethod, value: e.target.value }
                        })}
                        placeholder={diagnosticData.unlockMethod.type === 'code' ? 'Entrez le code' : 'Entrez le mot de passe'}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiagnosticForm;

export { DiagnosticForm }