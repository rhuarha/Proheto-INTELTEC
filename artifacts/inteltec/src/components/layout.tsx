import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  Printer,
  Archive,
  Send,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Building2,
  Box,
  LayoutDashboard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-16 border-b bg-card flex items-center px-6">
          <Skeleton className="h-6 w-32" />
        </header>
        <main className="flex-1 p-6">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-[400px] w-full" />
        </main>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const isAdmin = user.role === "admin";
  const isApontador = user.role === "apontador" || isAdmin;
  const isCliente = user.role === "cliente";

  const navLink = (path: string, label: string, icon: React.ElementType) => {
    const active = location === path;
    const Icon = icon;
    return (
      <Link href={path} className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${active ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-14 border-b bg-card flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-6 h-full">
          <div className="font-bold text-xl text-primary tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground">
              <Box className="w-5 h-5" />
            </div>
            INTELTEC
          </div>
          
          <nav className="hidden md:flex items-center gap-1 h-full pt-1">
            {isApontador && (
              <>
                {navLink("/dashboard", "Dashboard", LayoutDashboard)}
                {navLink("/recebimento", "Recebimento", Package)}
                {navLink("/processamento", "Processamento", ClipboardList)}
                {navLink("/impressao", "Impressão", Printer)}
                {navLink("/envelopamento", "Envelopamento", Archive)}
                {navLink("/embalagem", "Embalagem", Box)}
                {navLink("/despacho", "Despacho", Truck)}
              </>
            )}
            
            {isCliente && navLink("/minhas-ordens", "Minhas Ordens", ClipboardList)}

            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground">
                    <Settings className="w-4 h-4" />
                    Cadastros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <Link href="/admin/usuarios">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Users className="w-4 h-4" />
                      Usuários
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/clientes">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Building2 className="w-4 h-4" />
                      Clientes
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/admin/produtos">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Package className="w-4 h-4" />
                      Produtos
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm font-medium hidden sm:block">
            {user.name} <span className="text-muted-foreground font-normal">({user.role})</span>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} title="Sair" data-testid="button-logout">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
