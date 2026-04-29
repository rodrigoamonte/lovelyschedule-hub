// import { useAppointments } from "@/presentation/hooks/useAppointments";
// import { useStores } from "@/presentation/hooks/useStores";
// import { useSuppliers } from "@/presentation/hooks/useSuppliers";
// import { User } from "@/core/entities/User";
// import { useNavigate } from "react-router-dom";
// import { DashboardShell, StatCard } from "./components/DashboardUI";
// import { Package, Clock, Building2, Users } from "lucide-react";
// import { Button } from "@/shared/components/ui/button";

// export function AdminDashboard({ user }: { user: User }) {
//   const { appointments } = useAppointments();
//   const { stores } = useStores();
//   const { suppliers } = useSuppliers();
//   const navigate = useNavigate();

//   const todayStr = new Date().toLocaleDateString("pt-BR", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   const totalAppts = appointments.length;
//   const pendingAppts = appointments.filter(
//     (a) => a.status === "pendente",
//   ).length;

//   return (
//     <DashboardShell
//       title="Painel Administrativo"
//       subtitle={todayStr}
//       role={user.role}
//     >
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           icon={<Package className="h-5 w-5 text-primary" />}
//           label="Total de agendamentos"
//           value={totalAppts}
//         />
//         <StatCard
//           icon={<Clock className="h-5 w-5 text-warning" />}
//           label="Pendentes"
//           value={pendingAppts}
//         />
//         <StatCard
//           icon={<Building2 className="h-5 w-5 text-accent" />}
//           label="Lojas"
//           value={stores.length}
//         />
//         <StatCard
//           icon={<Users className="h-5 w-5 text-destructive" />}
//           label="Fornecedores"
//           value={suppliers.length}
//         />
//       </div>
//       <div className="flex gap-3 mt-6">
//         <Button onClick={() => navigate("/admin/stores")}>
//           Gerenciar Lojas
//         </Button>
//         <Button variant="outline" onClick={() => navigate("/admin/schedules")}>
//           Configurar Horários
//         </Button>
//         <Button variant="outline" onClick={() => navigate("/admin/users")}>
//           Gestão de Usuários
//         </Button>
//       </div>
//     </DashboardShell>
//   );
// }
