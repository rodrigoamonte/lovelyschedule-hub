import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

export default function Suppliers() {
  const { suppliers, units, addSupplier } = useData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', cnpj: '', contact: '', email: '', unitIds: [] as string[] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(form);
    setForm({ name: '', cnpj: '', contact: '', email: '', unitIds: [] });
    setOpen(false);
  };

  const toggleUnit = (id: string) => {
    setForm(f => ({
      ...f,
      unitIds: f.unitIds.includes(id) ? f.unitIds.filter(u => u !== id) : [...f.unitIds, id],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground">Fornecedores</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} cadastrado{suppliers.length !== 1 ? 's' : ''}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Novo Fornecedor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Fornecedor</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Nome</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></div>
              <div className="space-y-2"><Label>CNPJ</Label><Input value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Contato</Label><Input value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} /></div>
                <div className="space-y-2"><Label>E-mail</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required /></div>
              </div>
              <div className="space-y-2">
                <Label>Unidades associadas</Label>
                <div className="flex flex-wrap gap-2">
                  {units.map(u => (
                    <button key={u.id} type="button" onClick={() => toggleUnit(u.id)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${form.unitIds.includes(u.id) ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border'}`}>
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Unidades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map(s => (
              <TableRow key={s.id} className="transition-colors hover:bg-secondary">
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="text-muted-foreground">{s.cnpj}</TableCell>
                <TableCell className="text-muted-foreground">{s.contact}</TableCell>
                <TableCell className="text-muted-foreground">{s.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {s.unitIds.map(uid => {
                      const u = units.find(x => x.id === uid);
                      return <span key={uid} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{u?.name}</span>;
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
