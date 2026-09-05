import { useMemo, useState } from "react";
import { TrendingUp, Search, Plus, ShieldCheck } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SupplierScoreFormDialog } from "@/pages/supplier-score-form-dialog";
import { SlaTrackingFormDialog } from "@/pages/sla-tracking-form-dialog";
import { useSupplierScores, useSlaTrackings, useDeleteSupplierScore, useDeleteSlaTracking } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SupplierScore, SLATracking } from "@/lib/types";

const slaStatusVariant: Record<string, "success" | "warning" | "destructive"> = {
  met: "success", at_risk: "warning", breached: "destructive",
};

export default function SupplierPerformancePage() {
  const supplierScores = useSupplierScores();
  const slaTrackings = useSlaTrackings();
  const deleteScore = useDeleteSupplierScore();
  const deleteSla = useDeleteSlaTracking();
  const [q, setQ] = useState("");
  const [scoreDialogOpen, setScoreDialogOpen] = useState(false);
  const [editingScore, setEditingScore] = useState<SupplierScore | undefined>();
  const [slaDialogOpen, setSlaDialogOpen] = useState(false);
  const [editingSla, setEditingSla] = useState<SLATracking | undefined>();

  const filteredScores = useMemo(() => {
    let list = supplierScores.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sc) => sc.vendorName.toLowerCase().includes(s) || sc.period.toLowerCase().includes(s)); }
    return list;
  }, [supplierScores.data, q]);

  const filteredSlas = useMemo(() => {
    let list = slaTrackings.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sl) => sl.slaMetric.toLowerCase().includes(s) || sl.vendorRef.toLowerCase().includes(s) || sl.status.toLowerCase().includes(s)); }
    return list;
  }, [slaTrackings.data, q]);

  const totalVendors = new Set((supplierScores.data ?? []).map((s) => s.vendorRef)).size;
  const avgOverall = (supplierScores.data ?? []).length > 0
    ? Math.round((supplierScores.data ?? []).reduce((sum, s) => sum + s.overallScore, 0) / (supplierScores.data ?? []).length)
    : 0;
  const breachedSlas = (slaTrackings.data ?? []).filter((s) => s.status === "breached").length;
  const atRiskSlas = (slaTrackings.data ?? []).filter((s) => s.status === "at_risk").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={TrendingUp}
        title="Supplier Performance"
        titleNe="आपूर्तिकर्ता प्रदर्शन"
        microModule="M14.07"
        description="Supplier scoring, SLA tracking and performance benchmarking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="supplierScores">
              <Button variant="outline" onClick={() => { setEditingScore(undefined); setScoreDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New score
              </Button>
            </CanCreate>
            <CanCreate resource="supplierScores">
              <Button onClick={() => { setEditingSla(undefined); setSlaDialogOpen(true); }}>
                <ShieldCheck className="h-4 w-4" /> New SLA
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><TrendingUp className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Vendors Scored</p><p className="text-lg font-bold">{totalVendors}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingUp className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Avg Score</p><p className="text-lg font-bold">{avgOverall}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Breached SLAs</p><p className="text-lg font-bold">{breachedSlas}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">At Risk SLAs</p><p className="text-lg font-bold">{atRiskSlas}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search scores, SLAs…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="scores">
        <TabsList>
          <TabsTrigger value="scores">Supplier Scores</TabsTrigger>
          <TabsTrigger value="slas">SLA Tracking</TabsTrigger>
        </TabsList>
        <TabsContent value="scores" className="mt-4">
          {supplierScores.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Vendor</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Overall</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredScores.map((s) => (
                  <TableRow key={s.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{s.vendorName}</p></TableCell>
                    <TableCell><Badge variant="secondary">{s.period}</Badge></TableCell>
                    <TableCell><span className="text-sm font-mono">{s.qualityScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{s.deliveryScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{s.priceScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{s.serviceScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono font-bold">{s.overallScore}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{s.rank}</span></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="supplierScores" onEdit={() => { setEditingScore(s); setScoreDialogOpen(true); }} onDelete={() => deleteScore.mutate(s)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="slas" className="mt-4">
          {slaTrackings.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Metric</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredSlas.map((sl) => (
                  <TableRow key={sl.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{sl.slaMetric}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{sl.vendorRef}</code></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{sl.contractRef}</code></TableCell>
                    <TableCell><span className="text-sm">{sl.target}</span></TableCell>
                    <TableCell><span className="text-sm">{sl.actual}</span></TableCell>
                    <TableCell><span className="text-sm">{sl.period}</span></TableCell>
                    <TableCell><Badge variant={slaStatusVariant[sl.status] ?? "secondary"} className="capitalize">{sl.status.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="supplierScores" onEdit={() => { setEditingSla(sl); setSlaDialogOpen(true); }} onDelete={() => deleteSla.mutate(sl)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <SupplierScoreFormDialog open={scoreDialogOpen} onOpenChange={setScoreDialogOpen} score={editingScore} />
      <SlaTrackingFormDialog open={slaDialogOpen} onOpenChange={setSlaDialogOpen} sla={editingSla} />
    </div>
  );
}
