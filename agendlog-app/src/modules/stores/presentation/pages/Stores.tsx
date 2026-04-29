import { useState } from "react";
import { useStores } from "../hooks/useStores";
import { THEME_CONFIG } from "@/shared/styles/theme-constants";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/presentation/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/shared/presentation/components/ui/dialog";
import { Switch } from "@/shared/presentation/components/ui/switch";
import { Building2, Plus, Pencil, Clock } from "lucide-react";
import { Store } from "../../core/entities/Store";
import { StoreManagementDialog } from "../components/StoreManagementDialog";

export default function StoresPage() {
  const { stores, isLoading, createStore, updateStore, toggleStoreStatus } =
    useStores();
  const [isOpen, setIsOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [managingStore, setManagingStore] = useState<Store | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      if (editingStore) {
        await updateStore({
          id: editingStore.id,
          payload: {
            name: data.name as string,
            code: data.code as string,
            address: data.address as string,
          },
        });
      } else {
        await createStore({
          name: data.name as string,
          code: data.code as string,
          address: data.address as string,
          active: true,
        });
      }
      handleClose();
    } catch {}
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingStore(null);
  };

  return (
    <div className={THEME_CONFIG.layout.shell}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${THEME_CONFIG.icons.container} bg-primary/10`}>
            <Building2
              className={`${THEME_CONFIG.icons.size.lg} text-primary`}
            />
          </div>
          <div>
            <h1 className={THEME_CONFIG.typography.h1}>Lojas</h1>
            <p className={THEME_CONFIG.typography.subtitle}>
              Gerenciamento de unidades e logística
            </p>
          </div>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingStore(null)}>
              <Plus className={THEME_CONFIG.icons.size.md} /> Nova Loja
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStore ? "Editar Loja" : "Cadastrar Loja"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className={THEME_CONFIG.layout.section}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Loja</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingStore?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Código Identificador</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingStore?.code}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={editingStore?.address}
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={THEME_CONFIG.table.wrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loja</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className={THEME_CONFIG.table.headerAction}>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    #{store.code}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${store.active ? THEME_CONFIG.status.ACTIVE.text : THEME_CONFIG.status.INACTIVE.text}`}
                    >
                      {store.active ? "Ativa" : "Inativa"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setManagingStore(store)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(store)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={store.active}
                        onCheckedChange={(c) => toggleStoreStatus(store.id, c)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <StoreManagementDialog
        store={managingStore}
        open={!!managingStore}
        onOpenChange={() => setManagingStore(null)}
      />
    </div>
  );
}
