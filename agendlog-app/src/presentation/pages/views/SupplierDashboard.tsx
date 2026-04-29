// import { useAppointments } from '@/presentation/hooks/useAppointments';
// import { useSuppliers } from '@/presentation/hooks/useSuppliers';
// import { User } from '@/core/entities/User';
// import { useNavigate } from 'react-router-dom';
// import { DashboardShell, StatCard } from './components/DashboardUI';
// import { Clock, CheckCircle, CalendarCheck, AlertTriangle } from 'lucide-react';
// import { Button } from '@/shared/components/ui/button';

// export function SupplierDashboard({ user }: { user: User }) {
//   const { appointments } = useAppointments();
//   const { suppliers } = useSuppliers();
//   const navigate = useNavigate();

//   const today = new Date().toISOString().split('T')[0];
//   const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

//   const supplier = suppliers.find(s => s.userId === user.id);
//   const myAppts = appointments.filter(a => a.supplierId === supplier?.id);

//   const pending = myAppts.filter(a => a.status === 'pendente').length;
//   const approved = myAppts.filter(a => a.status === 'aprovado').length;
//   const todayAppts = myAppts.filter(a => a.date === today && a.status === 'aprovado');

//   const unread = 0;

//   return (
//     <DashboardShell title={`Olá, ${user.name}`} subtitle={todayStr} role={user.role}>
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard icon={<Clock className="h-5 w-5 text-warning" />} label="Pendentes" value={pending} />
//         <StatCard icon={<CheckCircle className="h-5 w-5 text-accent" />} label="Aprovados" value={approved} />
//         <StatCard icon={<CalendarCheck className="h-5 w-5 text-primary" />} label="Entregas hoje" value={todayAppts.length} />
//         <StatCard icon={<AlertTriangle className="h-5 w-5 text-destructive" />} label="Notificações" value={unread} />
//       </div>
//       <div className="flex gap-3 mt-6">
//         <Button onClick={() => navigate('/supplier/new-appointment')}>Novo Agendamento</Button>
//         <Button variant="outline" onClick={() => navigate('/supplier/my-appointments')}>Meus Agendamentos</Button>
//       </div>
//     </DashboardShell>
//   );
// }
