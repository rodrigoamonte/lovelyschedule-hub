import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS, type UserRole } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Users, Plus } from 'lucide-react';

export default function UsersPage() {
  const { users, updateUsers } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('fornecedor');

  const handleAdd = () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    if (users.find(u => u.email === email.trim())) {
      toast.error('E-mail já cadastrado.');
      return;
    }
    const newUser = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role,
      status: 'ativo' as const,
      loginAttempts: 0,
      blockedUntil: null,
      createdAt: new Date().toISOString(),
    };
    updateUsers([...users, newUser]);
    toast.success('Usuário cadastrado com sucesso!');
    setOpen(false);
    setName(''); setEmail(''); setPassword(''); setRole('fornecedor');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Gestão de Usuários</h1>
            <p className="text-sm text-muted-foreground">Visualize e cadastre usuários do sistema</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo Usuário</Button>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{ROLE_LABELS[u.role]}</TableCell>
                <TableCell><span className={`text-xs font-medium ${u.status === 'ativo' ? 'text-accent' : 'text-destructive'}`}>{u.status === 'ativo' ? 'Ativo' : 'Bloqueado'}</span></TableCell>
                <TableCell className="text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Usuário</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>E-mail *</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="space-y-2"><Label>Senha *</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Perfil *</Label>
              <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Cadastrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
