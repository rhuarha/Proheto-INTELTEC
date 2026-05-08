import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Layout } from "@/components/layout";
import NotFound from "@/pages/not-found";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Recebimento from "@/pages/recebimento";
import Processamento from "@/pages/processamento";
import Impressao from "@/pages/impressao";
import Envelopamento from "@/pages/envelopamento";
import Embalagem from "@/pages/embalagem";
import Retirada from "@/pages/retirada";
import MinhasOrdens from "@/pages/minhas-ordens";

// Admin Pages
import Usuarios from "@/pages/admin/usuarios";
import Clientes from "@/pages/admin/clientes";
import Produtos from "@/pages/admin/produtos";
import Precos from "@/pages/admin/precos";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, allowedRoles }: { component: any, allowedRoles?: string[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Redirect to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to={user.role === 'cliente' ? '/minhas-ordens' : '/dashboard'} />;
  }
  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Layout><div /></Layout>;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/login">
          {user ? <Redirect to={user.role === 'cliente' ? '/minhas-ordens' : '/dashboard'} /> : <Login />}
        </Route>

        <Route path="/">
          {user ? <Redirect to={user.role === 'cliente' ? '/minhas-ordens' : '/dashboard'} /> : <Redirect to="/login" />}
        </Route>

        <Route path="/dashboard">
          <ProtectedRoute component={Dashboard} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/recebimento">
          <ProtectedRoute component={Recebimento} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/processamento">
          <ProtectedRoute component={Processamento} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/impressao">
          <ProtectedRoute component={Impressao} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/envelopamento">
          <ProtectedRoute component={Envelopamento} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/embalagem">
          <ProtectedRoute component={Embalagem} allowedRoles={['admin', 'apontador']} />
        </Route>
        <Route path="/retirada">
          <ProtectedRoute component={Retirada} allowedRoles={['admin', 'apontador']} />
        </Route>

        <Route path="/admin/usuarios">
          <ProtectedRoute component={Usuarios} allowedRoles={['admin']} />
        </Route>
        <Route path="/admin/clientes">
          <ProtectedRoute component={Clientes} allowedRoles={['admin']} />
        </Route>
        <Route path="/admin/produtos">
          <ProtectedRoute component={Produtos} allowedRoles={['admin']} />
        </Route>
        <Route path="/admin/precos">
          <ProtectedRoute component={Precos} allowedRoles={['admin', 'apontador']} />
        </Route>

        <Route path="/minhas-ordens">
          <ProtectedRoute component={MinhasOrdens} />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
