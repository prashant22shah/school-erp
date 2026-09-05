import { useMemo, useState } from "react";
import { ClipboardCheck, Search, Plus, AlertTriangle, CheckCircle2, FileText } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PhysicalCountFormDialog } from "@/pages/physical-count-form-dialog";
import { VarianceReportFormDialog } from "@/pages/variance-report-form-dialog";
import { usePhysicalCounts, useVarianceReports, useDeletePhysicalCount, useDeleteVarianceReport } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { PhysicalCount, VarianceReport } from "@/lib/types";

const countStatusVariant: Record<string, "info" | "warning" | "success" | "secondary"> = {
  draft: "info", in_progress: "warning", completed: "success", adjusted: "secondary",
};
const varianceStatusVariant: Record<string, "warning" | "info" | "success" | "destructive"> = {
  open: "warning", investigated: "info", adjusted: "success", written_off: "destructive",
};

export default function CountsReconciliation() {
  const counts = usePhysicalCounts();
  const variances = useVarianceReports();
  const deleteCount = useDeletePhysicalCount();
  const deleteVariance = useDeleteVarianceReport();
  const [q, setQ] = useState("");
  const [countDialogOpen, setCountDialogOpen] = useState(false);
  const [editingCount, setEditingCount] = useState<PhysicalCount | undefined>();
  const [varianceDialogOpen, setVarianceDialogOpen] = useState(false);
  const [editingVariance, setEditingVariance] = useState<VarianceReport | undefined>();

  const filteredCounts = useMemo(() => {
    let list = counts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.countNo.toLowerCase().includes(s) || c.storeRef.toLowerCase().includes(s) || c.countedBy.toLowerCase().includes(s)); }
    return list;
  }, [counts.data, q]);

  const filteredVariances = useMemo(() => {
    let list = variances.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((v) => v.itemName.toLowerCase().includes(s) || v.countRef.toLowerCase().includes(s) || v.reason.toLowerCase().includes(s)); }
    return list;
  }, [variances.data, q]);

  const completedCounts = (counts.data ?? []).filter((c) => c.status === "completed").length;
  const openVariances = (variances.data ?? []).filter((v) => v.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Counts & Reconciliation"
        titleNe="भौतिक गणना"
        microModule="M15.03"
        description="Run physical stock counts, identify variances and reconcile inventory."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="physicalCounts">
              <Button variant="outline" onClick={() => { setEditingCount(undefined); setCountDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New count
              </Button>
            </CanCreate>
            <CanCreate resource="varianceReports">
              <Button onClick={() => { setEditingVariance(undefined); setVarianceDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New variance
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total counts</p><p className="text-lg font-bold">{counts.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedCounts}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Variance reports</p><p className="text-lg font-bold">{variances.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Open variances</p><p className="text-lg font-bold">{openVariances}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search counts, variances…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="counts">
        <TabsList>
          <TabsTrigger value="counts">Physical Counts</TabsTrigger>
          <TabsTrigger value="variances">Variance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="counts" className="mt-4">
          {counts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Count No</TableHead>
                      <TableHead>Store</TableHead>
                      <TableHead>Count Date</TableHead>
                      <TableHead>Counted By</TableHead>
                      <TableHead>Items Counted</TableHead>
                      <TableHead>Discrepancies</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCounts.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.countNo}</code></TableCell>
                        <TableCell><span className="text-sm">{c.storeRef}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.countDate)}</span></TableCell>
                        <TableCell><span className="text-sm">{c.countedBy}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{c.itemCounted}</span></TableCell>
                        <TableCell><span className={`text-sm font-mono ${c.discrepancyCount > 0 ? "text-destructive font-medium" : ""}`}>{c.discrepancyCount}</span></TableCell>
                        <TableCell><Badge variant={countStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="physicalCounts" onEdit={() => { setEditingCount(c); setCountDialogOpen(true); }} onDelete={() => deleteCount.mutate(c)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="variances" className="mt-4">
          {variances.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Item</TableHead>
                      <TableHead>Count Ref</TableHead>
                      <TableHead>System Qty</TableHead>
                      <TableHead>Physical Qty</TableHead>
                      <TableHead>Variance</TableHead>
                      <TableHead>Value (NPR)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVariances.map((v) => (
                      <TableRow key={v.id} className="group">
                        <TableCell className="pl-5"><span className="text-sm font-medium">{v.itemName}</span></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{v.countRef}</code></TableCell>
                        <TableCell><span className="text-sm font-mono">{v.systemQty}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{v.physicalQty}</span></TableCell>
                        <TableCell><span className={`text-sm font-mono font-medium ${v.variance !== 0 ? "text-destructive" : ""}`}>{v.variance > 0 ? "+" : ""}{v.variance}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{v.varianceValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={varianceStatusVariant[v.status] ?? "secondary"} className="capitalize">{v.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="varianceReports" onEdit={() => { setEditingVariance(v); setVarianceDialogOpen(true); }} onDelete={() => deleteVariance.mutate(v)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <PhysicalCountFormDialog open={countDialogOpen} onOpenChange={setCountDialogOpen} editing={editingCount} />
      <VarianceReportFormDialog open={varianceDialogOpen} onOpenChange={setVarianceDialogOpen} editing={editingVariance} />
    </div>
  );
}
