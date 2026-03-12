import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DAY_NAMES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

export default function WindowsPage() {
  const { user } = useAuth();
  const { windows, units, addWindow } = useData();
  const [open, setOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const filteredWindows = isAdmin ? windows : windows.filter(w => w.unitId === user?.unitId);
  const availableUnits = isAdmin ? units : units.filter(u => u.id === user?.unitId);

  const [form, setForm] = useState({
    unitId: availableUnits[0]?.id ?? '',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    cargoType: 'Geral',
    maxCapacity: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addWindow(form);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-foreground">Janelas de Recebimento</h1>
          <p className="text-sm text-muted-foreground">{filteredWindows.length} janela{filteredWindows.length !== 1 ? 's' : ''} configurada{filteredWindows.length !== 1 ? 's' : ''}</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Nova Janela</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Janela de Recebimento</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isAdmin && (
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select value={form.unitId} onValueChange={v => setForm(f => ({ ...f, unitId: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Dia da Semana</Label>
                <Select value={String(form.dayOfWeek)} onValueChange={v => setForm(f => ({ ...f, dayOfWeek: Number(v) }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DAY_NAMES.map((d, i) => <SelectItem key={i} value={String(i)}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Início</Label><Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Fim</Label><Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tipo de Carga</Label><Input value={form.cargoType} onChange={e => setForm(f => ({ ...f, cargoType: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Capacidade</Label><Input type="number" min={1} value={form.maxCapacity} onChange={e => setForm(f => ({ ...f, maxCapacity: Number(e.target.value) }))} /></div>
              </div>
              <Button type="submit" className="w-full">Criar Janela</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unidade</TableHead>
              <TableHead>Dia</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Tipo de Carga</TableHead>
              <TableHead>Capacidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWindows.map(w => {
              const unit = units.find(u => u.id === w.unitId);
              return (
                <TableRow key={w.id} className="transition-colors hover:bg-secondary">
                  <TableCell className="font-medium">{unit?.name}</TableCell>
                  <TableCell>{DAY_NAMES[w.dayOfWeek]}</TableCell>
                  <TableCell>{w.startTime}–{w.endTime}</TableCell>
                  <TableCell className="text-muted-foreground">{w.cargoType}</TableCell>
                  <TableCell>{w.maxCapacity} por janela</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
