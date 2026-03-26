import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { AppLayout } from '@/components/AppLayout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import NewAppointment from '@/pages/supplier/NewAppointment';
import MyAppointments from '@/pages/supplier/MyAppointments';
import PendingRequests from '@/pages/assistant/PendingRequests';
import DecisionHistory from '@/pages/assistant/DecisionHistory';
import OperationalBoard from '@/pages/depot/OperationalBoard';
import StoresPage from '@/pages/admin/Stores';
import SchedulesPage from '@/pages/admin/Schedules';
import UsersPage from '@/pages/admin/UsersPage';
import NotificationsPage from '@/pages/Notifications';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="novo-agendamento" element={<NewAppointment />} />
                <Route path="meus-agendamentos" element={<MyAppointments />} />
                <Route path="solicitacoes" element={<PendingRequests />} />
                <Route path="historico" element={<DecisionHistory />} />
                <Route path="mural" element={<OperationalBoard />} />
                <Route path="lojas" element={<StoresPage />} />
                <Route path="horarios" element={<SchedulesPage />} />
                <Route path="usuarios" element={<UsersPage />} />
                <Route path="notificacoes" element={<NotificationsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
