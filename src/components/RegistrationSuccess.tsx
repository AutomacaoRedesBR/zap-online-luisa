
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from 'lucide-react';

interface RegistrationSuccessProps {
  onBackToLogin: () => void;
}

export const RegistrationSuccess = ({ onBackToLogin }: RegistrationSuccessProps) => {
  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-bold">Conta Criada com Sucesso!</CardTitle>
        <CardDescription>
          Sua conta foi criada e registrada em nosso sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p>Você já pode fazer login com as credenciais cadastradas.</p>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Button 
          onClick={onBackToLogin} 
          className="w-full"
        >
          Voltar para Login
        </Button>
      </CardFooter>
    </Card>
  );
};
