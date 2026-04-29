import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import AppSidebar from "./AppSidebar";
import { Header } from "./Header";
import {
  SidebarProvider,
  SidebarInset,
} from "@/shared/presentation/components/ui/sidebar";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-y-auto p-8 bg-muted/10">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
