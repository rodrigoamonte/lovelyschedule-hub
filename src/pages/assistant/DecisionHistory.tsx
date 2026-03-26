import { useData } from '@/contexts/DataContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { History } from 'lucide-react';

export default function DecisionHistory() {
  const { appointments, suppliers, stores, history } = useData();

  const decisionsAppts = appointments
    .filter(a => a.status === 'aprovado' || a.status === 'rejeitado')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <History className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl text-foreground">Histórico de Decisões</h1>
          <p className="text-sm text-muted-foreground">Agendamentos já analisados</p>
        </div>
      </div>

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        {decisionsAppts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhuma decisão registrada ainda.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Mercadoria</TableHead>
                <TableHead>Decisão</TableHead>
                <TableHead>Justificativa</TableHead>
                <TableHead>Data da decisão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {decisionsAppts.map(appt => {
                const supplier = suppliers.find(s => s.id === appt.supplierId);
                const store = stores.find(s => s.id === appt.storeId);
                const decisionEntry = history
                  .filter(h => h.appointmentId === appt.id && (h.action === 'Aprovação' || h.action === 'Rejeição'))
                  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
                return (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{supplier?.nomeFantasia}</TableCell>
                    <TableCell>{store?.name}</TableCell>
                    <TableCell>{appt.date}</TableCell>
                    <TableCell>{appt.time}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{appt.merchandise}</TableCell>
                    <TableCell><StatusBadge status={appt.status} /></TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">{appt.rejectionReason || '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {decisionEntry ? new Date(decisionEntry.createdAt).toLocaleString('pt-BR') : appt.updatedAt}
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
