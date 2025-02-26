
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserInfoProps {
  token: string;
  userData: {
    name: string;
    email: string;
    phone: string;
  };
}

export const UserInfo = ({ token, userData }: UserInfoProps) => {
  return (
    <Card className="w-full max-w-md glass-card fade-in">
      <CardHeader>
        <CardTitle>Informações do Usuário</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Token</Label>
          <div className="p-2 bg-muted rounded-md text-sm font-mono break-all">
            {token}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Nome</Label>
          <div className="p-2 bg-muted rounded-md">
            {userData.name}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="p-2 bg-muted rounded-md">
            {userData.email}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Telefone</Label>
          <div className="p-2 bg-muted rounded-md">
            {userData.phone}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
