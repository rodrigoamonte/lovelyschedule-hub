import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Clock, Plus } from 'lucide-react';

export default function SchedulesPage() {
  const { stores, timeSlots, addTimeSlot, updateTimeSlot } = useData();
  const [open, setOpen] = useState(false);
  const [storeId, setStoreId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('2');

  const [filterStore, setFilterStore] = useState<string>('all');
  const [filterDate, setFilterDate] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const filtered = timeSlots
    .filter(t => filterStore === 'all' || t.storeId === filterStore)
    .filter(t => !filterDate || t.date === filterDate)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const handleAdd = () => {
    if (!storeId || !date || !time || !maxCapacity) {
      toast.error('Preencha todos os campos.');
      return;
    }
    addTimeSlot({ storeId, date, time, maxCapacity: parseInt(maxCapacity), usedCapacity: 0, active: true });
    toast.success('Horário cadastrado com sucesso!');
    setOpen(false);
    setStoreId(''); setDate(''); setTime(''); setMaxCapacity('2');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl text-foreground">Horários Disponíveis</h1>
            <p className="text-sm text-muted-foreground">Configure faixas de horário e capacidade por loja</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo Horário</Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Filtrar por loja</Label>
          <Select value={filterStore} onValueChange={setFilterStore}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {stores.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Filtrar por data</Label>
          <Input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="w-44" />
        </div>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhum horário encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Ocupação</TableHead>
                <TableHead>Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.slice(0, 50).map(slot => {
                const store = stores.find(s => s.id === slot.storeId);
                const pct = slot.maxCapacity > 0 ? Math.round((slot.usedCapacity / slot.maxCapacity) * 100) : 0;
                return (
                  <TableRow key={slot.id}>
                    <TableCell className="font-medium">{store?.name}</TableCell>
                    <TableCell>{slot.date}</TableCell>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell>{slot.maxCapacity}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium ${pct >= 100 ? 'text-destructive' : pct >= 50 ? 'text-warning' : 'text-accent'}`}>
                        {slot.usedCapacity}/{slot.maxCapacity} ({pct}%)
                      </span>
                    </TableCell>
                    <TableCell>
                      <Switch checked={slot.active} onCheckedChange={v => updateTimeSlot(slot.id, { active: v })} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Novo Horário</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Loja *</Label>
              <Select value={storeId} onValueChange={setStoreId}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{stores.filter(s => s.active).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Data *</Label><Input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Horário *</Label><Input type="time" value={time} onChange={e => setTime(e.target.value)} /></div>
            <div className="space-y-2"><Label>Capacidade máxima *</Label><Input type="number" min="1" value={maxCapacity} onChange={e => setMaxCapacity(e.target.value)} /></div>
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
