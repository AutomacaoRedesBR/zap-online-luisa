
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QRCodeDisplay } from "@/components/QRCodeDisplay";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Plan } from "@/types/instanceTypes";
import { PLAN_UUIDS } from "@/types/instanceTypes";
import { isValidUUID } from "@/utils/validationUtils";

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
  // Obter dados do usuário atual
  const { userData } = useAuth();
  
  // Estado local para armazenar o UUID real
  const [actualPlanUUID, setActualPlanUUID] = useState<string>("");
  
  // Atualizar o UUID quando o planId selecionado mudar
  useEffect(() => {
    if (selectedPlanId && PLAN_UUIDS[selectedPlanId as keyof typeof PLAN_UUIDS]) {
      const uuid = PLAN_UUIDS[selectedPlanId as keyof typeof PLAN_UUIDS];
      setActualPlanUUID(uuid);
      console.log("Selected plan ID:", selectedPlanId);
      console.log("Mapped to UUID:", uuid);
    } else if (isValidUUID(selectedPlanId)) {
      // Se já for um UUID válido, usá-lo diretamente
      setActualPlanUUID(selectedPlanId);
    }
  }, [selectedPlanId]);

  // Função para lidar com a criação de instância com o UUID correto
  const handleCreateWithUUID = () => {
    console.log("Creating instance with plan UUID:", actualPlanUUID);
    // Verificar se temos um UUID válido para o usuário
    if (userData && userData.id) {
      if (!isValidUUID(userData.id)) {
        console.warn(`O ID de usuário não parece ser um UUID válido: ${userData.id}`);
      } else {
        console.log(`Criando instância para usuário com UUID: ${userData.id}`);
      }
    } else {
      console.error("ID de usuário não encontrado!");
    }
    
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
            {userData && (
              <div className="text-xs text-gray-500 mt-1 p-2 bg-gray-100 rounded">
                <p><strong>Dados do usuário:</strong></p>
                <p>ID: {userData.id || "Não disponível"}</p>
                <p>Nome: {userData.name || "Não disponível"}</p>
                <p>Email: {userData.email || "Não disponível"}</p>
              </div>
            )}
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
