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
import Suppliers from '@/pages/Suppliers';
import UnitsPage from '@/pages/Units';
import WindowsPage from '@/pages/Windows';
import Scheduling from '@/pages/Scheduling';
import Approvals from '@/pages/Approvals';
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
                <Route path="fornecedores" element={<Suppliers />} />
                <Route path="unidades" element={<UnitsPage />} />
                <Route path="janelas" element={<WindowsPage />} />
                <Route path="agendar" element={<Scheduling />} />
                <Route path="aprovacoes" element={<Approvals />} />
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
