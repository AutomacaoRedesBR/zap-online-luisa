
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, User, Loader2 } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; phone: string }) => void;
  onToggleForm: () => void;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, onToggleForm, isLoading = false }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone });
  };

  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Criar Conta Techify</CardTitle>
        <CardDescription>
          Preencha seus dados para começar
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                placeholder="Seu nome"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
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
            <Label htmlFor="phone">Telefone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
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
              "Cadastrar"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onToggleForm}
            disabled={isLoading}
          >
            Já tenho uma conta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
