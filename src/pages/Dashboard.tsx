import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Truck, Package } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { appointments, suppliers, units, windows, updateAppointmentStatus } = useData();

  const today = new Date().toISOString().split('T')[0];

  const unitFilter = user?.role === 'gestor' ? user.unitId : undefined;
  const todayAppts = appointments
    .filter(a => a.date === today && (a.status === 'aprovado' || a.status === 'aguardando' || a.status === 'chegou' || a.status === 'atrasado' || a.status === 'concluido'))
    .filter(a => !unitFilter || a.unitId === unitFilter)
    .sort((a, b) => {
      const wa = windows.find(w => w.id === a.windowId);
      const wb = windows.find(w => w.id === b.windowId);
      return (wa?.startTime ?? '').localeCompare(wb?.startTime ?? '');
    });

  const pendingCount = appointments.filter(a => a.status === 'pendente' && (!unitFilter || a.unitId === unitFilter)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground">Painel Diário</h1>
        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="Entregas hoje" value={todayAppts.length} />
        <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pendingCount} />
        <StatCard icon={<Truck className="h-5 w-5 text-accent" />} label="Concluídas" value={todayAppts.filter(a => a.status === 'concluido').length} />
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {todayAppts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Nenhum agendamento aprovado para hoje. Verifique a aba de <span className="font-medium text-foreground">Aprovações</span> para pendentes.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Horário</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayAppts.map(appt => {
                const win = windows.find(w => w.id === appt.windowId);
                const sup = suppliers.find(s => s.id === appt.supplierId);
                const unit = units.find(u => u.id === appt.unitId);
                return (
                  <TableRow key={appt.id} className="transition-colors hover:bg-secondary">
                    <TableCell className="font-medium">{win?.startTime}–{win?.endTime}</TableCell>
                    <TableCell>{sup?.name}</TableCell>
                    <TableCell>{unit?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{win?.cargoType}</TableCell>
                    <TableCell><StatusBadge status={appt.status} /></TableCell>
                    <TableCell className="text-right space-x-1">
                      {appt.status === 'aprovado' && (
                        <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(appt.id, 'chegou')}>Check-in</Button>
                      )}
                      {appt.status === 'chegou' && (
                        <Button size="sm" variant="success" onClick={() => updateAppointmentStatus(appt.id, 'concluido')}>Concluir</Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-card flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
