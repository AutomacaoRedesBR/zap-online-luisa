
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Plan } from "@/services/instanceService";

interface CreateInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceName: string;
  onInstanceNameChange: (value: string) => void;
  selectedPlanId: string;
  onPlanSelect: (value: string) => void;
  isCreatingInstance: boolean;
  onCreateInstance: () => void;
  plans: Plan[] | undefined;
  isLoadingPlans: boolean;
  qrCodeData: string | null;
  instanceId: string | null;
}

export const CreateInstanceDialog = ({
  open,
  onOpenChange,
  instanceName,
  onInstanceNameChange,
  selectedPlanId,
  onPlanSelect,
  isCreatingInstance,
  onCreateInstance,
  plans,
  isLoadingPlans,
  qrCodeData,
  instanceId,
}: CreateInstanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Instância</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar uma nova instância.
          </DialogDescription>
        </DialogHeader>

        {qrCodeData && instanceId ? (
          <div className="py-4">
            <h3 className="text-lg font-medium mb-4 text-center">Escaneie o QR Code para ativar sua instância</h3>
            <QRCodeDisplay 
              qrCodeData={qrCodeData} 
              instanceId={instanceId} 
            />
            <p className="text-sm text-gray-500 mt-4 text-center">
              ID da instância: {instanceId}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome da Instância</Label>
              <Input
                id="name"
                placeholder="Ex: Minha Instância Principal"
                value={instanceName}
                onChange={(e) => onInstanceNameChange(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="plan">Plano</Label>
              <Select 
                value={selectedPlanId} 
                onValueChange={onPlanSelect}
                disabled={isLoadingPlans}
              >
                <SelectTrigger id="plan">
                  <SelectValue placeholder="Selecione um plano" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingPlans ? (
                    <SelectItem value="loading" disabled>Carregando planos...</SelectItem>
                  ) : (
                    plans?.filter(plan => plan.name !== 'Free').map(plan => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} {plan.description ? `- ${plan.description}` : ''}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          {qrCodeData ? (
            <Button onClick={() => onOpenChange(false)}>
              Concluído
            </Button>
          ) : (
            <Button onClick={onCreateInstance} disabled={isCreatingInstance}>
              {isCreatingInstance ? 'Criando...' : 'Criar Instância'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
