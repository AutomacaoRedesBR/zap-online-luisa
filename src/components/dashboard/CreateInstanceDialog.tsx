
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { Plan } from "@/services/instanceService";
import { useState, useEffect } from "react";

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
  // Mapear os nomes de planos para UUIDs válidos
  const planUUIDs = {
    "free-plan": "95c10fdd-b92d-493a-a25d-3fee817c950a",
    "basic-plan": "741d4a3d-19b5-4a24-93ae-9b4890a40f7a",
    "premium-plan": "8d2c33c9-a6b9-448e-b76d-9c1ba92c5f03"
  };
  
  // Estado local para armazenar o UUID real
  const [actualPlanUUID, setActualPlanUUID] = useState<string>("");
  
  // Atualizar o UUID quando o planId selecionado mudar
  useEffect(() => {
    if (selectedPlanId && planUUIDs[selectedPlanId as keyof typeof planUUIDs]) {
      const uuid = planUUIDs[selectedPlanId as keyof typeof planUUIDs];
      setActualPlanUUID(uuid);
      console.log("Selected plan ID:", selectedPlanId);
      console.log("Mapped to UUID:", uuid);
    }
  }, [selectedPlanId]);

  // Função para lidar com a criação de instância com o UUID correto
  const handleCreateWithUUID = () => {
    console.log("Creating instance with plan UUID:", actualPlanUUID);
    // Substituir o ID do plano atual pelo UUID real antes de chamar onCreateInstance
    localStorage.setItem("currentPlanUUID", actualPlanUUID);
    onCreateInstance();
  };

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
              {selectedPlanId && (
                <p className="text-xs text-gray-500 mt-1">
                  ID do plano selecionado: {actualPlanUUID || "Carregando..."}
                </p>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {qrCodeData ? (
            <Button onClick={() => onOpenChange(false)}>
              Concluído
            </Button>
          ) : (
            <Button onClick={handleCreateWithUUID} disabled={isCreatingInstance}>
              {isCreatingInstance ? 'Criando...' : 'Criar Instância'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
