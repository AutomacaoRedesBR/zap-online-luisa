
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserInfoProps {
  token?: string;
  userData?: {
    name: string;
    email: string;
    phone: string;
  };
  name?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export const UserInfo = ({ token, userData, name, email, phone, id }: UserInfoProps) => {
  // Se userData for fornecido, use seus valores, caso contrário use os props individuais
  const displayName = userData?.name || name || '';
  const displayEmail = userData?.email || email || '';
  const displayPhone = userData?.phone || phone || '';

  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle>Informações do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {token && (
          <div className="space-y-2">
            <Label>Token</Label>
            <div className="p-2 bg-muted rounded-md text-sm font-mono break-all">
              {token}
            </div>
          </div>
        )}
        <div className="space-y-2">
          <Label>Nome</Label>
          <div className="p-2 bg-muted rounded-md">
            {displayName}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="p-2 bg-muted rounded-md">
            {displayEmail}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <div className="p-2 bg-muted rounded-md">
            {displayPhone}
          </div>
        </div>
        {id && (
          <div className="space-y-2">
            <Label>ID</Label>
            <div className="p-2 bg-muted rounded-md text-sm font-mono">
              {id}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
