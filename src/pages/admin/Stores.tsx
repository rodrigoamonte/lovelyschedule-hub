import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Building2, Plus } from 'lucide-react';

export default function StoresPage() {
  const { stores, addStore, updateStore } = useData();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !city.trim() || !address.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    addStore({ name: name.trim(), city: city.trim(), address: address.trim(), active: true });
    toast.success('Loja cadastrada com sucesso!');
    setOpen(false);
    setName(''); setCity(''); setAddress('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Lojas</h1>
            <p className="text-sm text-muted-foreground">Gerencie as lojas e depósitos da rede</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Nova Loja</Button>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ativa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stores.map(store => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell>{store.city}</TableCell>
                <TableCell className="text-muted-foreground">{store.address}</TableCell>
                <TableCell><span className={`text-xs font-medium ${store.active ? 'text-accent' : 'text-muted-foreground'}`}>{store.active ? 'Ativa' : 'Inativa'}</span></TableCell>
                <TableCell>
                  <Switch checked={store.active} onCheckedChange={v => updateStore(store.id, { active: v })} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nova Loja</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Supermercado Centro" /></div>
            <div className="space-y-2"><Label>Cidade *</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="Ex: São Paulo" /></div>
            <div className="space-y-2"><Label>Endereço *</Label><Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Ex: Rua das Flores, 123" /></div>
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
