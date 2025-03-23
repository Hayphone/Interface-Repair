import React, { useEffect, useState } from 'react';
import { Printer, AlertCircle } from 'lucide-react';

interface LabelPrinterProps {
  data: {
    customerName: string;
    deviceInfo: string;
    repairDescription: string;
    status: string;
    repairId: string;
    date: string;
  };
}

declare global {
  interface Window {
    dymo: {
      label: {
        framework: {
          init: () => void;
          getPrinters: () => any[];
          openLabelXml: (xml: string) => any;
        };
      };
    };
  }
}

export const LabelPrinter: React.FC<LabelPrinterProps> = ({ data }) => {
  const [printerStatus, setPrinterStatus] = useState<'ready' | 'error' | 'loading'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    loadDymoFramework();
  }, []);

  const loadDymoFramework = async () => {
    try {
      // Load DYMO Label Framework
      const script = document.createElement('script');
      script.src = 'http://labelwriter.com/software/dls/sdk/js/DYMO.Label.Framework.latest.js';
      script.async = true;
      script.onload = () => {
        try {
          window.dymo.label.framework.init();
          setPrinterStatus('ready');
        } catch (err) {
          setPrinterStatus('error');
          setErrorMessage('Erreur d\'initialisation de l\'imprimante DYMO');
        }
      };
      script.onerror = () => {
        setPrinterStatus('error');
        setErrorMessage('Impossible de charger le SDK DYMO');
      };
      document.body.appendChild(script);
    } catch (err) {
      setPrinterStatus('error');
      setErrorMessage('Erreur lors du chargement du SDK DYMO');
    }
  };

  const getLabelXml = () => {
    return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="mm">
    <PaperOrientation>Landscape</PaperOrientation>
    <Id>Address</Id>
    <PaperName>11352 Shipping</PaperName>
    <DrawCommands>
        <RoundRectangle X="0" Y="0" Width="252" Height="81" Rx="10" Ry="10" />
    </DrawCommands>
    <ObjectInfo>
        <TextObject>
            <Name>Customer</Name>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
            <LinkedObjectName></LinkedObjectName>
            <Rotation>Rotation0</Rotation>
            <IsMirrored>False</IsMirrored>
            <IsVariable>False</IsVariable>
            <HorizontalAlignment>Left</HorizontalAlignment>
            <VerticalAlignment>Top</VerticalAlignment>
            <TextFitMode>None</TextFitMode>
            <UseFullFontHeight>True</UseFullFontHeight>
            <Verticalized>False</Verticalized>
            <StyledText>
                <Element>
                    <String>${data.customerName}</String>
                    <Attributes>
                        <Font Family="Arial" Size="12" Bold="True" Italic="False" Underline="False" Strikeout="False" />
                    </Attributes>
                </Element>
            </StyledText>
        </TextObject>
        <Bounds X="10" Y="10" Width="230" Height="20" />
    </ObjectInfo>
    <ObjectInfo>
        <TextObject>
            <Name>DeviceInfo</Name>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
            <LinkedObjectName></LinkedObjectName>
            <Rotation>Rotation0</Rotation>
            <IsMirrored>False</IsMirrored>
            <IsVariable>False</IsVariable>
            <HorizontalAlignment>Left</HorizontalAlignment>
            <VerticalAlignment>Top</VerticalAlignment>
            <TextFitMode>None</TextFitMode>
            <UseFullFontHeight>True</UseFullFontHeight>
            <Verticalized>False</Verticalized>
            <StyledText>
                <Element>
                    <String>${data.deviceInfo}</String>
                    <Attributes>
                        <Font Family="Arial" Size="10" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                    </Attributes>
                </Element>
            </StyledText>
        </TextObject>
        <Bounds X="10" Y="30" Width="230" Height="20" />
    </ObjectInfo>
    <ObjectInfo>
        <TextObject>
            <Name>RepairInfo</Name>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
            <LinkedObjectName></LinkedObjectName>
            <Rotation>Rotation0</Rotation>
            <IsMirrored>False</IsMirrored>
            <IsVariable>False</IsVariable>
            <HorizontalAlignment>Left</HorizontalAlignment>
            <VerticalAlignment>Top</VerticalAlignment>
            <TextFitMode>None</TextFitMode>
            <UseFullFontHeight>True</UseFullFontHeight>
            <Verticalized>False</Verticalized>
            <StyledText>
                <Element>
                    <String>${data.repairDescription}</String>
                    <Attributes>
                        <Font Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                    </Attributes>
                </Element>
            </StyledText>
        </TextObject>
        <Bounds X="10" Y="50" Width="230" Height="20" />
    </ObjectInfo>
    <ObjectInfo>
        <BarcodeObject>
            <Name>Barcode</Name>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
            <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
            <LinkedObjectName></LinkedObjectName>
            <Rotation>Rotation0</Rotation>
            <IsMirrored>False</IsMirrored>
            <IsVariable>False</IsVariable>
            <Text>${data.repairId}</Text>
            <Type>Code128Auto</Type>
            <Size>Small</Size>
            <TextPosition>Bottom</TextPosition>
            <TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
            <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
            <TextEmbedding>None</TextEmbedding>
            <ECLevel>0</ECLevel>
            <HorizontalAlignment>Center</HorizontalAlignment>
            <QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0" />
        </BarcodeObject>
        <Bounds X="180" Y="10" Width="60" Height="40" />
    </ObjectInfo>
</DieCutLabel>`;
  };

  const printLabel = async () => {
    try {
      setPrinterStatus('loading');
      
      // Get Dymo printers
      const printers = window.dymo.label.framework.getPrinters();
      const printer = printers.find((p: any) => p.printerType === 'LabelWriterPrinter');
      
      if (!printer) {
        throw new Error('Imprimante DYMO non trouvée');
      }

      // Create and print label
      const label = window.dymo.label.framework.openLabelXml(getLabelXml());
      
      // Print two copies
      label.print(printer.name, '', { copies: 2 });
      
      setPrinterStatus('ready');
    } catch (err) {
      setPrinterStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erreur d\'impression');
    }
  };

  return (
    <div className="mt-4">
      {printerStatus === 'error' ? (
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{errorMessage}</span>
        </div>
      ) : (
        <button
          onClick={printLabel}
          disabled={printerStatus === 'loading'}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            printerStatus === 'loading'
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
          }`}
        >
          <Printer className="h-5 w-5 mr-2" />
          {printerStatus === 'loading' ? 'Impression...' : 'Imprimer étiquette'}
        </button>
      )}
    </div>
  );
};