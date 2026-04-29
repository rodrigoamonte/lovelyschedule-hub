import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreRepository } from "@/modules/stores/data/repositories/StoreRepository";
import { useToast } from "@/shared/hooks/use-toast";
import { Bay, Store } from "@/modules/stores/core/entities/Store";

export function useStores() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stores = [], isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: StoreRepository.getAll,
  });

  const createMutation = useMutation({
    mutationFn: StoreRepository.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast({ title: "Sucesso", description: "Loja registada." });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Store> }) =>
      StoreRepository.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast({ title: "Sucesso", description: "Dados atualizados." });
    },
  });

  const hoursMutation = useMutation({
    mutationFn: StoreRepository.setOperatingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operating-hours"] });
      toast({ title: "Sucesso", description: "Horário configurado." });
    },
  });

  const slotsMutation = useMutation({
    mutationFn: StoreRepository.generateSlots,
  });

  const bayMutation = useMutation({
    mutationFn: StoreRepository.createBay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bays"] });
      toast({ title: "Sucesso", description: "Doca adicionada." });
    },
  });

  const updateBayMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Bay> }) =>
      StoreRepository.updateBay(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bays"] }),
  });

  const deleteBayMutation = useMutation({
    mutationFn: StoreRepository.deleteBay,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bays"] });
      toast({ title: "Sucesso", description: "Doca removida." });
    },
  });

  const deleteHourMutation = useMutation({
    mutationFn: StoreRepository.deleteOperatingHour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operating-hours"] });
      toast({ title: "Sucesso", description: "Horário removido." });
    },
  });

  const createSlotMutation = useMutation({
    mutationFn: StoreRepository.createSlot,
    onSuccess: () =>
      toast({ title: "Sucesso", description: "Slot criado manualmente." }),
  });

  return {
    stores,
    isLoading,
    createStore: createMutation.mutateAsync,
    updateStore: updateMutation.mutateAsync,
    setOperatingHours: hoursMutation.mutateAsync,
    generateSlots: slotsMutation.mutateAsync,
    createBay: bayMutation.mutateAsync,
    updateBay: updateBayMutation.mutateAsync,
    deleteBay: deleteBayMutation.mutateAsync,
    deleteOperatingHour: deleteHourMutation.mutateAsync,
    createSlot: createSlotMutation.mutateAsync,
    toggleStoreStatus: (id: string, active: boolean) =>
      updateMutation.mutate({ id, payload: { active } }),
    isProcessing:
      hoursMutation.isPending ||
      slotsMutation.isPending ||
      bayMutation.isPending,
  };
}
