import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Warehouse, Truck, Clock, Package } from 'lucide-react';

export default function OperationalBoard() {
  const { appointments, suppliers, stores } = useData();
  const today = new Date().toISOString().split('T')[0];

  const [storeFilter, setStoreFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState(today);

  const approved = appointments
    .filter(a => a.status === 'aprovado')
    .filter(a => storeFilter === 'all' || a.storeId === storeFilter)
    .filter(a => a.date === dateFilter)
    .sort((a, b) => a.time.localeCompare(b.time));

  const groupedByTime: Record<string, typeof approved> = {};
  approved.forEach(a => {
    if (!groupedByTime[a.time]) groupedByTime[a.time] = [];
    groupedByTime[a.time].push(a);
  });

  const timeSlots = Object.keys(groupedByTime).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          <Warehouse className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Mural Operacional</h1>
          <p className="text-sm text-muted-foreground">Entregas aprovadas organizadas por horário</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Loja</Label>
          <Select value={storeFilter} onValueChange={setStoreFilter}>
            <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as lojas</SelectItem>
              {stores.filter(s => s.active).map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Data</Label>
          <Input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-44" />
        </div>
      </div>

      {approved.length === 0 ? (
        <div className="rounded-xl bg-card shadow-card p-8 text-center text-muted-foreground text-sm">
          Nenhuma entrega aprovada para os filtros selecionados.
        </div>
      ) : (
        <div className="space-y-4">
          {timeSlots.map(time => (
            <div key={time} className="rounded-xl bg-card shadow-card overflow-hidden">
              <div className="bg-secondary px-4 py-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{time}</span>
                <span className="text-xs text-muted-foreground">— {groupedByTime[time].length} entrega(s)</span>
              </div>
              <div className="divide-y divide-border">
                {groupedByTime[time].map(appt => {
                  const supplier = suppliers.find(s => s.id === appt.supplierId);
                  const store = stores.find(s => s.id === appt.storeId);
                  return (
                    <div key={appt.id} className="px-4 py-3 flex items-center gap-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 shrink-0">
                        <Truck className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{supplier?.nomeFantasia}</p>
                        <p className="text-xs text-muted-foreground">{store?.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{appt.merchandise}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
