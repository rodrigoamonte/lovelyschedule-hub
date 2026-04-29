import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { Toaster } from "@/shared/presentation/components/ui/toaster";
import AppLayout from "@/shared/presentation/components/AppLayout";
import Login from "@/modules/auth/presentation/pages/Login";
import Dashboard from "@/presentation/pages/Dashboard";
import NotFound from "@/shared/presentation/pages/NotFound";
import StoresPage from "@/modules/stores/presentation/pages/Stores";
import UsersPage from "./modules/users/presentation/pages/Users";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/stores" element={<StoresPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
