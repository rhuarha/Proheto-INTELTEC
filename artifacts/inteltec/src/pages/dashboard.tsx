import { useGetDashboardResumo, useGetDashboardPendentes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { Package, Printer, Archive, Box, PackageCheck, ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: resumo, isLoading: loadingResumo } = useGetDashboardResumo();
  const { data: pendentes, isLoading: loadingPendentes } = useGetDashboardPendentes();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do controle de produção.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ordens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingResumo ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold">{resumo?.totalOrdens || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebidas Hoje</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loadingResumo ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-primary">{resumo?.ordensHoje || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retiradas Hoje</CardTitle>
            <PackageCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            {loadingResumo ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-emerald-600">{resumo?.ordensRetiradasHoje || 0}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pendentes por Etapa (Itens)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <StageStat icon={ClipboardList} label="Pendente de Processamento" value={pendentes?.processamento} loading={loadingPendentes} />
              <StageStat icon={Printer} label="Impressão" value={pendentes?.impressao} loading={loadingPendentes} />
              <StageStat icon={Archive} label="Envelopamento" value={pendentes?.envelopamento} loading={loadingPendentes} />
              <StageStat icon={Box} label="Embalagem" value={pendentes?.embalagem} loading={loadingPendentes} />
              <StageStat icon={PackageCheck} label="Retirada" value={(pendentes as any)?.retirada ?? (pendentes as any)?.despacho} loading={loadingPendentes} />
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Ordens por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingResumo ? (
                Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
              ) : (
                Object.entries(resumo?.porStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                    <StatusBadge status={status} />
                    <span className="font-semibold text-lg">{count as number}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StageStat({ icon: Icon, label, value, loading }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-md text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{label}</span>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-12" />
      ) : (
        <span className="text-2xl font-bold">{value || 0}</span>
      )}
    </div>
  );
}
