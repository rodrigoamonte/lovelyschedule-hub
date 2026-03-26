import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { CheckSquare, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { Appointment } from '@/lib/mock-data';

export default function PendingRequests() {
  const { user } = useAuth();
  const { appointments, suppliers, stores, timeSlots, approveAppointment, rejectAppointment } = useData();

  const pending = appointments.filter(a => a.status === 'pendente').sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const [rejectTarget, setRejectTarget] = useState<Appointment | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (appt: Appointment) => {
    if (!user) return;
    approveAppointment(appt.id, user.id);
    toast.success('Agendamento aprovado com sucesso!');
  };

  const handleReject = () => {
    if (!rejectTarget || !user || !rejectReason.trim()) {
      toast.error('A justificativa é obrigatória para rejeitar.');
      return;
    }
    rejectAppointment(rejectTarget.id, user.id, rejectReason.trim());
    toast.success('Agendamento rejeitado.');
    setRejectTarget(null);
    setRejectReason('');
  };

  const getCapacityWarning = (appt: Appointment) => {
    const slot = timeSlots.find(t => t.storeId === appt.storeId && t.date === appt.date && t.time === appt.time);
    if (!slot) return null;
    if (slot.usedCapacity >= slot.maxCapacity) return 'Capacidade máxima atingida!';
    if (slot.usedCapacity >= slot.maxCapacity - 1) return 'Última vaga disponível';
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
          <CheckSquare className="h-5 w-5 text-warning" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Solicitações Pendentes</h1>
          <p className="text-sm text-muted-foreground">{pending.length} solicitação(ões) aguardando análise</p>
        </div>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {pending.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma solicitação pendente no momento. 🎉</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Mercadoria</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map(appt => {
                const supplier = suppliers.find(s => s.id === appt.supplierId);
                const store = stores.find(s => s.id === appt.storeId);
                const warning = getCapacityWarning(appt);
                return (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{supplier?.nomeFantasia}</TableCell>
                    <TableCell>{store?.name}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{appt.merchandise}</TableCell>
                    <TableCell className="max-w-[150px] truncate text-muted-foreground">{appt.notes || '—'}</TableCell>
                    <TableCell>
                      {warning ? (
                        <span className="inline-flex items-center gap-1 text-xs text-warning">
                          <AlertTriangle className="h-3 w-3" />
                          {warning}
                        </span>
                      ) : (
                        <span className="text-xs text-accent">Disponível</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="success" onClick={() => handleApprove(appt)}>
                        <CheckCircle className="mr-1 h-3 w-3" /> Aprovar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setRejectTarget(appt)}>
                        <XCircle className="mr-1 h-3 w-3" /> Rejeitar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={() => { setRejectTarget(null); setRejectReason(''); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rejeitar Agendamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Fornecedor: <span className="font-medium text-foreground">{suppliers.find(s => s.id === rejectTarget?.supplierId)?.nomeFantasia}</span><br/>
              Loja: <span className="font-medium text-foreground">{stores.find(s => s.id === rejectTarget?.storeId)?.name}</span><br/>
              Data/Hora: <span className="font-medium text-foreground">{rejectTarget?.date} às {rejectTarget?.time}</span>
            </p>
            <div className="space-y-2">
              <Label>Justificativa da rejeição *</Label>
              <Textarea
                placeholder="Informe o motivo da rejeição..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectTarget(null); setRejectReason(''); }}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>Confirmar Rejeição</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
