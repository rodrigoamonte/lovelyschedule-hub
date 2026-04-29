import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStores } from "@/modules/stores/presentation/hooks/useStores";
import { StoreRepository } from "@/modules/stores/data/repositories/StoreRepository";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/presentation/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/presentation/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/presentation/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/presentation/components/ui/table";
import { Separator } from "@/shared/presentation/components/ui/separator";
import {
  Clock,
  CalendarRange,
  LayoutPanelLeft,
  Plus,
  Loader2,
  Trash2,
  CalendarPlus,
  Pencil,
} from "lucide-react";

const DAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];
const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = ["00", "15", "30", "45"];

export function StoreManagementDialog({ store, open, onOpenChange }: any) {
  const {
    setOperatingHours,
    generateSlots,
    createBay,
    deleteBay,
    createSlot,
    deleteOperatingHour,
    isProcessing,
  } = useStores();

  const { toast } = useToast();
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isAddingBay, setIsAddingBay] = useState(false);
  const [editingDay, setEditingDay] = useState<any>(null);

  const { data: bays = [] } = useQuery({
    queryKey: ["bays", store?.id],
    queryFn: () => StoreRepository.getBays(store?.id),
    enabled: !!store?.id,
  });

  const { data: operatingHours = [] } = useQuery({
    queryKey: ["operating-hours", store?.id],
    queryFn: () => StoreRepository.getOperatingHours(store?.id),
    enabled: !!store?.id,
  });

  const handleSaveHours = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await setOperatingHours({
      storeId: store.id,
      dayOfWeek: Number(fd.get("dayOfWeek")),
      openTime: `${fd.get("openH")}:${fd.get("openM")}`,
      closeTime: `${fd.get("closeH")}:${fd.get("closeM")}`,
      slotDuration: Number(fd.get("slotDuration")),
    });
    setEditingDay(null);
  };

  const handleDeleteHour = async (id: string) => {
    if (confirm("Deseja remover o horário deste dia?")) {
      await deleteOperatingHour(id);
    }
  };

  const handleCreateBay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await createBay({
      name: fd.get("name") as string,
      code: fd.get("code") as string,
      location: fd.get("location") as string,
      storeId: store.id,
    });
    setIsAddingBay(false);
  };

  const handleDeleteBay = async (id: string) => {
    if (confirm("Remover esta doca?")) {
      await deleteBay(id);
    }
  };

  const handleCreateManualSlot = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const date = fd.get("date") as string;

    const startTime = new Date(
      `${date}T${fd.get("startH")}:${fd.get("startM")}:00`,
    ).toISOString();
    const endTime = new Date(
      `${date}T${fd.get("endH")}:${fd.get("endM")}:00`,
    ).toISOString();

    await createSlot({
      bayId: fd.get("bayId") as string,
      startTime,
      endTime,
      maxCapacity: Number(fd.get("capacity")),
    });
    (e.target as HTMLFormElement).reset();
  };

  const handleGenerateSlotsRange = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const start = new Date(fd.get("startDate") + "T00:00:00");
    const end = new Date(fd.get("endDate") + "T00:00:00");
    if (end < start)
      return toast({
        variant: "destructive",
        title: "Erro",
        description: "Intervalo inválido",
      });

    setLoadingSlots(true);
    try {
      let current = new Date(start);
      while (current <= end) {
        await generateSlots({
          storeId: store.id,
          date: current.toISOString().split("T")[0],
          durationMinutes: Number(fd.get("duration")),
          force: true,
        });
        current.setDate(current.getDate() + 1);
      }
      toast({ title: "Sucesso", description: "Agenda gerada." });
    } finally {
      setLoadingSlots(false);
    }
  };

  const TimeSelector = ({ label, prefix, defaultValue }: any) => {
    const [h, m] = (defaultValue || "08:00").split(":");
    return (
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase">{label}</Label>
        <div className="flex items-center gap-1">
          <Select name={`${prefix}H`} defaultValue={h} required>
            <SelectTrigger className="w-[65px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="font-bold">:</span>
          <Select name={`${prefix}M`} defaultValue={m} required>
            <SelectTrigger className="w-[65px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestão da Unidade: {store?.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="hours">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hours" className="gap-2">
              <Clock className="h-4 w-4" /> Horários
            </TabsTrigger>
            <TabsTrigger value="bays" className="gap-2">
              <LayoutPanelLeft className="h-4 w-4" /> Docas
            </TabsTrigger>
            <TabsTrigger value="slots" className="gap-2">
              <CalendarRange className="h-4 w-4" /> Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hours" className="pt-4 space-y-6">
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia</TableHead>
                    <TableHead>Abertura</TableHead>
                    <TableHead>Fechamento</TableHead>
                    <TableHead>Duração Slot</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DAYS.map((day, index) => {
                    const config = operatingHours.find(
                      (h: any) => h.dayOfWeek === index,
                    );
                    return (
                      <TableRow
                        key={index}
                        className={config ? "bg-primary/5" : "opacity-40"}
                      >
                        <TableCell className="font-medium">{day}</TableCell>
                        <TableCell>{config?.openTime || "--:--"}</TableCell>
                        <TableCell>{config?.closeTime || "--:--"}</TableCell>
                        <TableCell>
                          {config?.slotDuration
                            ? `${config.slotDuration} min`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                setEditingDay(config || { dayOfWeek: index })
                              }
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            {config && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteHour(config.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {editingDay && (
              <form
                onSubmit={handleSaveHours}
                className="p-4 border-2 border-primary/10 rounded-lg bg-muted/20 space-y-4"
              >
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-bold text-primary">
                    {DAYS[editingDay.dayOfWeek]}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingDay(null)}
                  >
                    Cancelar
                  </Button>
                </div>
                <input
                  type="hidden"
                  name="dayOfWeek"
                  value={editingDay.dayOfWeek}
                />
                <div className="grid grid-cols-3 gap-6">
                  <TimeSelector
                    label="Abertura"
                    prefix="open"
                    defaultValue={editingDay.openTime}
                  />
                  <TimeSelector
                    label="Fechamento"
                    prefix="close"
                    defaultValue={editingDay.closeTime}
                  />
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">
                      Slot (minutos)
                    </Label>
                    <Input
                      name="slotDuration"
                      type="number"
                      defaultValue={editingDay.slotDuration || 60}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isProcessing}
                >
                  Salvar Configuração
                </Button>
              </form>
            )}
          </TabsContent>

          <TabsContent value="bays" className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Docas Disponíveis</h3>
              <Button size="sm" onClick={() => setIsAddingBay(!isAddingBay)}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Doca
              </Button>
            </div>
            {isAddingBay && (
              <form
                onSubmit={handleCreateBay}
                className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/50"
              >
                <div className="space-y-1">
                  <Label>Nome</Label>
                  <Input name="name" required />
                </div>
                <div className="space-y-1">
                  <Label>Código</Label>
                  <Input name="code" required />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label>Localização</Label>
                  <Input name="location" />
                </div>
                <div className="col-span-2 flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddingBay(false)}
                  >
                    Sair
                  </Button>
                  <Button type="submit" size="sm">
                    Gravar
                  </Button>
                </div>
              </form>
            )}
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doca</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bays.map((bay: any) => (
                    <TableRow key={bay.id}>
                      <TableCell className="font-medium">{bay.name}</TableCell>
                      <TableCell>{bay.code}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteBay(bay.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="slots" className="pt-4 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <CalendarPlus className="h-5 w-5" /> Criar Slot Avulso
              </div>
              <form
                onSubmit={handleCreateManualSlot}
                className="p-4 border rounded-lg bg-muted/20 space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Doca</Label>
                    <Select name="bayId" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a doca..." />
                      </SelectTrigger>
                      <SelectContent>
                        {bays.map((b: any) => (
                          <SelectItem key={b.id} value={b.id}>
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Data</Label>
                    <Input name="date" type="date" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <TimeSelector label="Início" prefix="start" />
                  <TimeSelector
                    label="Término"
                    prefix="end"
                    defaultValue="09:00"
                  />
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase">
                      Capacidade
                    </Label>
                    <Input
                      name="capacity"
                      type="number"
                      defaultValue="1"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  variant="secondary"
                  disabled={isProcessing}
                >
                  Criar Slot
                </Button>
              </form>
            </div>

            <Separator />

            <div className="space-y-4 pb-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <CalendarRange className="h-5 w-5" /> Geração Automática em
                Massa
              </div>
              <form
                onSubmit={handleGenerateSlotsRange}
                className="p-4 border rounded-lg space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Início do Período</Label>
                    <Input name="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Fim do Período</Label>
                    <Input name="endDate" type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Duração padrão (minutos)</Label>
                  <Input
                    name="duration"
                    type="number"
                    defaultValue="60"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingSlots}
                >
                  {loadingSlots ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : (
                    "Iniciar Geração"
                  )}
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
