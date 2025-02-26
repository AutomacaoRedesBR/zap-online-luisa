
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QRCodeDisplayProps {
  instanceId: string;
  onScanComplete: (token: string, userData: any) => void;
}

export const QRCodeDisplay = ({ instanceId, onScanComplete }: QRCodeDisplayProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const apiKey = 'YOUR_EVOLUTION_MANAGER_API_KEY'; // Substitua pela sua API key

  useEffect(() => {
    // Simulação da geração do QR Code
    // Aqui você deve integrar com a API real do Evolution Manager
    const generateQRCode = async () => {
      try {
        // Simula a chamada à API
        setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${instanceId}`);
        
        // Simula o recebimento do token após scan
        // Na implementação real, você deve usar websockets ou polling
        setTimeout(() => {
          onScanComplete('sample-token-123', {
            name: 'Usuário Exemplo',
            email: 'usuario@exemplo.com',
            phone: '(11) 99999-9999'
          });
        }, 5000);
      } catch (error) {
        console.error('Erro ao gerar QR Code:', error);
      }
    };

    generateQRCode();
  }, [instanceId]);

  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle>Conecte-se com QR Code</CardTitle>
        <CardDescription>
          Escaneie o código QR usando seu aplicativo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-6">
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-64 h-64"
          />
        )}
      </CardContent>
    </Card>
  );
};
