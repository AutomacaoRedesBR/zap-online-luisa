
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onToggleForm: () => void;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, onToggleForm, isLoading = false }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Bem-vindo à Techify</CardTitle>
        <CardDescription>
          Entre com suas credenciais para continuar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aguarde...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onToggleForm}
            disabled={isLoading}
          >
            Criar uma conta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
