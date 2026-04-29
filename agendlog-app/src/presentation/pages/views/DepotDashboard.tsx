// import { useAppointments } from '@/presentation/hooks/useAppointments';
// import { useStores } from '@/presentation/hooks/useStores';
// import { useSuppliers } from '@/presentation/hooks/useSuppliers';
// import { User } from '@/core/entities/User';
// import { useNavigate } from 'react-router-dom';
// import { DashboardShell, StatCard } from './components/DashboardUI';
// import { Package, Building2, CalendarCheck } from 'lucide-react';
// import { Button } from '@/shared/components/ui/button';

// export function DepotDashboard({ user }: { user: User }) {
//   const { appointments } = useAppointments();
//   const { stores } = useStores();
//   const { suppliers } = useSuppliers();
//   const navigate = useNavigate();

//   const today = new Date().toISOString().split('T')[0];
//   const todayStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

//   const todayApproved = appointments.filter(a => a.date === today && a.status === 'aprovado');
//   const storeCount = stores.filter(s => s.active).length;

//   return (
//     <DashboardShell title="Painel do Depósito" subtitle={todayStr} role={user.role}>
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <StatCard icon={<Package className="h-5 w-5 text-primary" />} label="Entregas aprovadas hoje" value={todayApproved.length} />
//         <StatCard icon={<Building2 className="h-5 w-5 text-accent" />} label="Lojas ativas" value={storeCount} />
//         <StatCard icon={<CalendarCheck className="h-5 w-5 text-warning" />} label="Fornecedores" value={suppliers.length} />
//       </div>
//       <div className="flex gap-3 mt-6">
//         <Button onClick={() => navigate('/depot/operational-board')}>Acessar Mural Operacional</Button>
//       </div>
//     </DashboardShell>
//   );
// }
