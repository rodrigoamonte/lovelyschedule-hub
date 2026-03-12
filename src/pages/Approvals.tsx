import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';

export default function Approvals() {
  const { user } = useAuth();
  const { appointments, suppliers, units, windows, updateAppointmentStatus, addNotification } = useData();

  const unitFilter = user?.role === 'gestor' ? user.unitId : undefined;
  const pending = appointments
    .filter(a => a.status === 'pendente' && (!unitFilter || a.unitId === unitFilter))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const recent = appointments
    .filter(a => a.status !== 'pendente' && (!unitFilter || a.unitId === unitFilter))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10);

  const handleApprove = (id: string, supplierId: string) => {
    updateAppointmentStatus(id, 'aprovado');
    const sup = suppliers.find(s => s.id === supplierId);
    addNotification({ userId: 'u3', message: `Seu agendamento foi aprovado.`, read: false });
  };

  const handleReject = (id: string, supplierId: string) => {
    updateAppointmentStatus(id, 'rejeitado');
    addNotification({ userId: 'u3', message: `Seu agendamento foi rejeitado.`, read: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-foreground">Aprovações</h1>
        <p className="text-sm text-muted-foreground">{pending.length} agendamento{pending.length !== 1 ? 's' : ''} pendente{pending.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {pending.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Nenhum agendamento pendente. Tudo em dia! ✓</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Obs.</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map(a => {
                const win = windows.find(w => w.id === a.windowId);
                const sup = suppliers.find(s => s.id === a.supplierId);
                const unit = units.find(u => u.id === a.unitId);
                return (
                  <TableRow key={a.id} className="transition-colors hover:bg-secondary">
                    <TableCell className="font-medium">{a.date}</TableCell>
                    <TableCell>{win?.startTime}–{win?.endTime}</TableCell>
                    <TableCell>{sup?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{unit?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{win?.cargoType}</TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-[120px] truncate">{a.notes ?? '—'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="success" onClick={() => handleApprove(a.id, a.supplierId)}>
                        <Check className="mr-1 h-3 w-3" />Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(a.id, a.supplierId)}>
                        <X className="mr-1 h-3 w-3" />Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {recent.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Histórico Recente</h2>
          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map(a => {
                  const win = windows.find(w => w.id === a.windowId);
                  const sup = suppliers.find(s => s.id === a.supplierId);
                  return (
                    <TableRow key={a.id} className="transition-colors hover:bg-secondary">
                      <TableCell className="font-medium">{a.date}</TableCell>
                      <TableCell>{sup?.name}</TableCell>
                      <TableCell className="text-muted-foreground">{win?.startTime}–{win?.endTime}</TableCell>
                      <TableCell><StatusBadge status={a.status} /></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
