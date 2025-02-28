
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRCodeDisplayProps {
  instanceId: string;
  onScanComplete?: (token: string, userData: any) => void;
  qrCodeUrl?: string;
  qrCodeData?: string;
  instanceDetails?: {
    id: string;
    user_id: string;
    name: string;
    status: string;
    evo_api_key?: string;
    expiration_date?: string;
    sequence_id?: number;
    sent_messages_number?: number;
  };
}

export const QRCodeDisplay = ({ 
  instanceId, 
  onScanComplete, 
  qrCodeUrl, 
  qrCodeData,
  instanceDetails
}: QRCodeDisplayProps) => {
  const [displayUrl, setDisplayUrl] = useState<string>('');

  useEffect(() => {
    if (qrCodeData) {
      setDisplayUrl(qrCodeData);
    } else if (qrCodeUrl) {
      setDisplayUrl(qrCodeUrl);
    } else {
      setDisplayUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instanceId}`);
    }
  }, [instanceId, qrCodeUrl, qrCodeData]);

  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle>Conecte-se com QR Code</CardTitle>
        <CardDescription>
          Escaneie o código QR usando seu aplicativo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-6">
        {displayUrl && (
          <img
            src={displayUrl}
            alt="QR Code"
            className="w-64 h-64 mb-4"
          />
        )}
        
        {instanceDetails && (
          <div className="w-full mt-4 text-sm">
            <div className="grid grid-cols-2 gap-2 text-left">
              <span className="font-medium">Nome:</span>
              <span>{instanceDetails.name}</span>
              
              <span className="font-medium">Status:</span>
              <span className="capitalize">{instanceDetails.status}</span>
              
              {instanceDetails.expiration_date && (
                <>
                  <span className="font-medium">Expira em:</span>
                  <span>{new Date(instanceDetails.expiration_date).toLocaleDateString()}</span>
                </>
              )}
              
              {instanceDetails.evo_api_key && (
                <>
                  <span className="font-medium">API Key:</span>
                  <span className="truncate">{instanceDetails.evo_api_key}</span>
                </>
              )}
              
              {instanceDetails.sent_messages_number !== undefined && (
                <>
                  <span className="font-medium">Mensagens enviadas:</span>
                  <span>{instanceDetails.sent_messages_number}</span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
