import { useState } from "react";
import { useUsers } from "@/modules/users/presentation/hooks/useUsers";
import { THEME_CONFIG } from "@/shared/styles/theme-constants";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import { Switch } from "@/shared/presentation/components/ui/switch";
import { Users as UsersIcon, Plus, Trash2, Pencil } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/presentation/components/ui/select";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  ANALYST: "Analista",
  CHECKER: "Conferente",
  DRIVER: "Motorista",
  SUPPLIER: "Fornecedor",
};

export default function UsersPage() {
  const { users, roles, isLoading, createUser, updateUser, deleteUser } =
    useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      if (editingUser) {
        await updateUser(editingUser.id, data);
      } else {
        await createUser({ ...data, status: "ACTIVE" });
      }
      handleClose();
    } catch (error) {}
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingUser(null);
  };

  return (
    <div className={THEME_CONFIG.layout.shell}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${THEME_CONFIG.icons.container} bg-primary/10`}>
            <UsersIcon
              className={`${THEME_CONFIG.icons.size.lg} text-primary`}
            />
          </div>
          <div>
            <h1 className={THEME_CONFIG.typography.h1}>Usuários</h1>
            <p className={THEME_CONFIG.typography.subtitle}>
              Gerencie os cargos e acessos da plataforma
            </p>
          </div>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => (open ? setIsOpen(true) : handleClose())}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => setEditingUser(null)}>
              <Plus className={THEME_CONFIG.icons.size.md} /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Cadastrar Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleSubmit}
              className={THEME_CONFIG.layout.section}
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingUser?.name}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={editingUser?.email}
                  placeholder="joao@empresa.com"
                  required
                />
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Senha Inicial *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="role">Cargo *</Label>
                <Select name="role" defaultValue={editingUser?.role} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role] || role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingUser ? "Salvar Alterações" : "Finalizar Cadastro"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className={THEME_CONFIG.table.wrapper}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className={THEME_CONFIG.table.headerAction}>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded">
                      {ROLE_LABELS[user.role] || user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-medium ${
                        user.status === "ACTIVE"
                          ? THEME_CONFIG.status.ACTIVE.text
                          : THEME_CONFIG.status.INACTIVE.text
                      }`}
                    >
                      {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Switch
                        checked={user.status === "ACTIVE"}
                        onCheckedChange={(checked) =>
                          updateUser(user.id, {
                            status: checked ? "ACTIVE" : "INACTIVE",
                          })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => deleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
