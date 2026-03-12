import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { DAY_NAMES, STATUS_LABELS } from '@/lib/mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarCheck, Clock } from 'lucide-react';

export default function Scheduling() {
  const { user } = useAuth();
  const { suppliers, units, windows, appointments, addAppointment, addNotification, getBookingsCount } = useData();

  const supplier = suppliers.find(s => s.id === user?.supplierId);
  const associatedUnits = units.filter(u => supplier?.unitIds.includes(u.id));

  const [selectedUnit, setSelectedUnit] = useState(associatedUnits[0]?.id ?? '');
  const [open, setOpen] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const selectedDow = new Date(date + 'T12:00:00').getDay();

  const availableWindows = windows.filter(w => w.unitId === selectedUnit && w.dayOfWeek === selectedDow);
  const myAppointments = appointments.filter(a => a.supplierId === user?.supplierId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleSubmit = () => {
    if (!selectedWindow || !supplier) return;
    addAppointment({
      supplierId: supplier.id,
      unitId: selectedUnit,
      windowId: selectedWindow,
      date,
      status: 'pendente',
      notes: notes || undefined,
    });
    // Notify unit gestor
    addNotification({
      userId: 'u2', // gestor mock
      message: `Novo agendamento pendente de ${supplier.name} para ${date}.`,
      read: false,
    });
    setOpen(false);
    setSelectedWindow(null);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground">Agendar Entrega</h1>
        <p className="text-sm text-muted-foreground">Selecione uma unidade, data e janela disponível</p>
      </div>

      <div className="rounded-xl bg-card p-6 shadow-card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Unidade</Label>
            <Select value={selectedUnit} onValueChange={setSelectedUnit}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {associatedUnits.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input type="date" min={today} value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        {availableWindows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhuma janela disponível para {DAY_NAMES[selectedDow]}. Tente outra data.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableWindows.map(w => {
              const booked = getBookingsCount(w.id, date);
              const full = booked >= w.maxCapacity;
              return (
                <button key={w.id} disabled={full} onClick={() => { setSelectedWindow(w.id); setOpen(true); }}
                  className={`rounded-xl border p-4 text-left transition-colors ${full ? 'opacity-50 cursor-not-allowed bg-muted' : 'bg-card hover:bg-secondary cursor-pointer shadow-card'}`}>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-primary" />
                    {w.startTime}–{w.endTime}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{w.cargoType}</p>
                  <p className="mt-1 text-xs">{full ? <span className="text-destructive font-medium">Esgotado</span> : <span className="text-accent font-medium">{w.maxCapacity - booked} vaga{w.maxCapacity - booked !== 1 ? 's' : ''}</span>}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar Agendamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {units.find(u => u.id === selectedUnit)?.name} — {date} — {windows.find(w => w.id === selectedWindow)?.startTime}–{windows.find(w => w.id === selectedWindow)?.endTime}
            </p>
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ex: carga frágil, necessita empilhadeira..." />
            </div>
            <Button onClick={handleSubmit} className="w-full"><CalendarCheck className="mr-2 h-4 w-4" />Solicitar Agendamento</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Meus Agendamentos</h2>
        <div className="rounded-xl bg-card shadow-card overflow-hidden">
          {myAppointments.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground text-center">Nenhum agendamento realizado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myAppointments.map(a => {
                  const win = windows.find(w => w.id === a.windowId);
                  const unit = units.find(u => u.id === a.unitId);
                  return (
                    <TableRow key={a.id} className="transition-colors hover:bg-secondary">
                      <TableCell className="font-medium">{a.date}</TableCell>
                      <TableCell>{unit?.name}</TableCell>
                      <TableCell className="text-muted-foreground">{win?.startTime}–{win?.endTime}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
