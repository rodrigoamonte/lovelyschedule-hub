import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ClipboardList, Eye, Pencil, XCircle } from 'lucide-react';
import type { Appointment, AppointmentHistory } from '@/lib/mock-data';

export default function MyAppointments() {
  const { user } = useAuth();
  const { appointments, stores, history, getSupplierByUserId, cancelAppointment, updateAppointment } = useData();

  const supplier = user ? getSupplierByUserId(user.id) : undefined;
  const myAppts = appointments.filter(a => a.supplierId === supplier?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [detailAppt, setDetailAppt] = useState<Appointment | null>(null);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const [editMerchandise, setEditMerchandise] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const filtered = statusFilter === 'all' ? myAppts : myAppts.filter(a => a.status === statusFilter);

  const handleCancel = (appt: Appointment) => {
    if (!user) return;
    cancelAppointment(appt.id, user.id);
    toast.success('Agendamento cancelado com sucesso.');
  };

  const openEdit = (appt: Appointment) => {
    setEditAppt(appt);
    setEditMerchandise(appt.merchandise);
    setEditNotes(appt.notes);
  };

  const handleEdit = () => {
    if (!editAppt || !user) return;
    updateAppointment(editAppt.id, { merchandise: editMerchandise, notes: editNotes }, user.id, 'Edição', 'Agendamento editado pelo fornecedor.');
    toast.success('Agendamento atualizado.');
    setEditAppt(null);
  };

  const apptHistory = detailAppt ? history.filter(h => h.appointmentId === detailAppt.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt)) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <ClipboardList className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Meus Agendamentos</h1>
          <p className="text-sm text-muted-foreground">Acompanhe o status das suas solicitações</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="aprovado">Aprovado</SelectItem>
            <SelectItem value="rejeitado">Rejeitado</SelectItem>
            <SelectItem value="cancelado">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhum agendamento encontrado.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loja</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Mercadoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(appt => {
                const store = stores.find(s => s.id === appt.storeId);
                return (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{store?.name}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{appt.merchandise}</TableCell>
                    <TableCell><StatusBadge status={appt.status} /></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => setDetailAppt(appt)} title="Ver detalhes">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {appt.status === 'pendente' && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(appt)} title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleCancel(appt)} title="Cancelar">
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailAppt} onOpenChange={() => setDetailAppt(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Detalhes do Agendamento</DialogTitle></DialogHeader>
          {detailAppt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Loja:</span> <span className="font-medium">{stores.find(s => s.id === detailAppt.storeId)?.name}</span></div>
                <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{detailAppt.date}</span></div>
                <div><span className="text-muted-foreground">Horário:</span> <span className="font-medium">{detailAppt.time}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={detailAppt.status} /></div>
                <div className="col-span-2"><span className="text-muted-foreground">Mercadoria:</span> <span className="font-medium">{detailAppt.merchandise}</span></div>
                {detailAppt.notes && <div className="col-span-2"><span className="text-muted-foreground">Observações:</span> <span className="font-medium">{detailAppt.notes}</span></div>}
                {detailAppt.rejectionReason && <div className="col-span-2"><span className="text-muted-foreground">Motivo da rejeição:</span> <span className="font-medium text-destructive">{detailAppt.rejectionReason}</span></div>}
              </div>
              {apptHistory.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Histórico</p>
                  <div className="space-y-2">
                    {apptHistory.map(h => (
                      <div key={h.id} className="text-xs bg-secondary rounded-lg p-2">
                        <span className="font-medium">{h.action}</span> — {h.description}
                        <span className="block text-muted-foreground mt-0.5">{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editAppt} onOpenChange={() => setEditAppt(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Agendamento</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Mercadoria</Label>
              <Input value={editMerchandise} onChange={e => setEditMerchandise(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditAppt(null)}>Cancelar</Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
