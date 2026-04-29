// import { useAppointments } from '@/presentation/hooks/useAppointments';
// import { User } from '@/core/entities/User';
// import { useNavigate } from 'react-router-dom';
// import { DashboardShell, StatCard } from './components/DashboardUI';
// import { Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
// import { Button } from '@/shared/components/ui/button';

// export function AssistantDashboard({ user }: { user: User }) {
//   const { appointments } = useAppointments();
//   const navigate = useNavigate();

//   const today = new Date().toISOString().split('T')[0];
//   const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

//   const pending = appointments.filter(a => a.status === 'pendente').length;
//   const approvedToday = appointments.filter(a => a.status === 'aprovado' && a.date === today).length;
//   const rejectedTotal = appointments.filter(a => a.status === 'rejeitado').length;
//   const unread = 0;

//   return (
//     <DashboardShell title="Painel da Validação" subtitle={todayStr} role={user.role}>
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pending} />
//         <StatCard icon={<CheckCircle className="h-5 w-5 text-accent" />} label="Aprovados hoje" value={approvedToday} />
//         <StatCard icon={<XCircle className="h-5 w-5 text-destructive" />} label="Rejeitados" value={rejectedTotal} />
//         <StatCard icon={<AlertTriangle className="h-5 w-5 text-primary" />} label="Notificações" value={unread} />
//       </div>
//       <div className="flex gap-3 mt-6">
//         <Button onClick={() => navigate('/assistant/pending-requests')}>Ver Solicitações Pendentes</Button>
//         <Button variant="outline" onClick={() => navigate('/assistant/decision-history')}>Histórico de Decisões</Button>
//       </div>
//     </DashboardShell>
//   );
// }
