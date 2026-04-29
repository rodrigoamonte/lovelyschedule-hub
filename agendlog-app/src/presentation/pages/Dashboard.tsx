import { THEME_CONFIG } from "@/shared/styles/theme-constants";

export default function Dashboard() {
  return (
    <div className={THEME_CONFIG.layout.shell}>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Sistema carregado com sucesso.</p>
    </div>
  );
}
