
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRCodeDisplayProps {
  instanceId: string;
  onScanComplete?: (token: string, userData: any) => void;
  qrCodeUrl?: string;
  qrCodeData?: string;
}

export const QRCodeDisplay = ({ instanceId, onScanComplete, qrCodeUrl, qrCodeData }: QRCodeDisplayProps) => {
  const [displayUrl, setDisplayUrl] = useState<string>('');
  
  useEffect(() => {
    if (qrCodeData) {
      // Verificar se o qrCodeData já é um dado de imagem completo (base64 ou URL)
      if (qrCodeData.startsWith('data:image') || qrCodeData.startsWith('http')) {
        setDisplayUrl(qrCodeData);
      } else {
        // Se for apenas um texto base64 sem o cabeçalho de dados, adicionar o prefixo necessário
        setDisplayUrl(`data:image/png;base64,${qrCodeData}`);
      }
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
      <CardContent className="flex justify-center p-6">
        {displayUrl && (
          <img
            src={displayUrl}
            alt="QR Code"
            className="w-64 h-64"
          />
        )}
      </CardContent>
    </Card>
  );
};
