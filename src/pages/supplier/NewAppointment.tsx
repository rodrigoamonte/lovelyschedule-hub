import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, CheckCircle } from 'lucide-react';

export default function NewAppointment() {
  const { user } = useAuth();
  const { stores, getAvailableSlots, createAppointment, getSupplierByUserId } = useData();
  const navigate = useNavigate();

  const [storeId, setStoreId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [merchandise, setMerchandise] = useState('');
  const [notes, setNotes] = useState('');

  const supplier = user ? getSupplierByUserId(user.id) : undefined;
  const activeStores = stores.filter(s => s.active);
  const availableSlots = storeId && date ? getAvailableSlots(storeId, date) : [];

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier || !user) return;

    if (!storeId || !date || !time || !merchandise.trim()) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    createAppointment({
      supplierId: supplier.id,
      storeId,
      date,
      time,
      merchandise: merchandise.trim(),
      notes: notes.trim(),
    }, user.id);

    toast.success('Solicitação de agendamento enviada com sucesso!');
    navigate('/meus-agendamentos');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <CalendarPlus className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Novo Agendamento</h1>
          <p className="text-sm text-muted-foreground">Solicite um horário para entrega de mercadoria</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-card p-6 shadow-card">
        <div className="space-y-2">
          <Label>Loja *</Label>
          <Select value={storeId} onValueChange={(v) => { setStoreId(v); setTime(''); }}>
            <SelectTrigger><SelectValue placeholder="Selecione a loja" /></SelectTrigger>
            <SelectContent>
              {activeStores.map(s => <SelectItem key={s.id} value={s.id}>{s.name} — {s.city}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Data da entrega *</Label>
          <Input type="date" min={today} value={date} onChange={e => { setDate(e.target.value); setTime(''); }} required />
        </div>

        {storeId && date && (
          <div className="space-y-2">
            <Label>Horário disponível *</Label>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground bg-secondary rounded-lg p-3">Nenhum horário disponível para esta loja e data. Tente outra data.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setTime(slot.time)}
                    className={`rounded-lg border p-3 text-sm text-center transition-colors ${
                      time === slot.time
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <span className="font-medium">{slot.time}</span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {slot.maxCapacity - slot.usedCapacity} vaga(s)
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label>Mercadoria *</Label>
          <Input placeholder="Ex: Laticínios, Bebidas, Hortifruti..." value={merchandise} onChange={e => setMerchandise(e.target.value)} required />
        </div>

        <div className="space-y-2">
          <Label>Observações</Label>
          <Textarea placeholder="Informações adicionais sobre a entrega..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={!storeId || !date || !time || !merchandise.trim()}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Enviar Solicitação
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/meus-agendamentos')}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
