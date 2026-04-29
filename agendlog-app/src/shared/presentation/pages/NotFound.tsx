import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Truck, MapPinOff } from "lucide-react";
import { THEME_CONFIG } from "@/shared/styles/theme-constants";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center space-y-6 max-w-sm mx-auto px-4">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Truck className="h-14 w-14" />
        </div>

        <h1 className={`${THEME_CONFIG.typography.h1} text-7xl`}>404</h1>

        <p className={`${THEME_CONFIG.typography.h2} text-muted-foreground`}>
          Ops! Página não encontrada
        </p>

        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-primary underline hover:text-primary/90 font-medium"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
