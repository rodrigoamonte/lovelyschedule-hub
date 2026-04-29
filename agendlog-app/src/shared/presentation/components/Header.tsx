import { SidebarTrigger } from "@/shared/presentation/components/ui/sidebar";
import { Separator } from "@/shared/presentation/components/ui/separator";

export function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
    </header>
  );
}
