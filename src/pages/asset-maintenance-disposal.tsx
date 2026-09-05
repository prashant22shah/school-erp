import { useMemo, useState } from "react";
import { Wrench, Search, Plus, Calendar, DollarSign, Truck, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AssetMaintenanceFormDialog } from "@/pages/asset-maintenance-form-dialog";
import { DisposalFormDialog } from "@/pages/disposal-form-dialog";
import { useAssetMaintenances, useDisposals, useDeleteAssetMaintenance, useDeleteDisposal } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { AssetMaintenance, Disposal } from "@/lib/types";

const maintStatusVariant: Record<string, "info" | "warning" | "success" | "secondary"> = {
  scheduled: "info", in_progress: "warning", completed: "success", cancelled: "secondary",
};
const maintTypeVariant: Record<string, "info" | "warning" | "secondary"> = {
  preventive: "info", corrective: "warning", upgrade: "secondary",
};
const disposalStatusVariant: Record<string, "info" | "success" | "secondary"> = {
  draft: "info", approved: "success", completed: "secondary",
};
const disposalMethodVariant: Record<string, "success" | "secondary" | "destructive" | "info"> = {
  sale: "success", donation: "secondary", scrap: "destructive", trade_in: "info",
};

export default function AssetMaintenanceDisposal() {
  const maintenances = useAssetMaintenances();
  const disposals = useDisposals();
  const deleteMaintenance = useDeleteAssetMaintenance();
  const deleteDisposal = useDeleteDisposal();
  const [q, setQ] = useState("");
  const [maintDialogOpen, setMaintDialogOpen] = useState(false);
  const [editingMaint, setEditingMaint] = useState<AssetMaintenance | undefined>();
  const [disposalDialogOpen, setDisposalDialogOpen] = useState(false);
  const [editingDisposal, setEditingDisposal] = useState<Disposal | undefined>();

  const filteredMaintenances = useMemo(() => {
    let list = maintenances.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.assetName.toLowerCase().includes(s) || m.vendor.toLowerCase().includes(s) || m.description.toLowerCase().includes(s)); }
    return list;
  }, [maintenances.data, q]);

  const filteredDisposals = useMemo(() => {
    let list = disposals.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.assetName.toLowerCase().includes(s) || d.buyer.toLowerCase().includes(s)); }
    return list;
  }, [disposals.data, q]);

  const completedMaint = (maintenances.data ?? []).filter((m) => m.status === "completed").length;
  const totalMaintCost = (maintenances.data ?? []).reduce((sum, m) => sum + (m.cost ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title="Maintenance & Disposal"
        titleNe="मर्मत र विलोपन"
        microModule="M15.07"
        description="Schedule asset maintenance, track completion costs and manage disposals."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="assetMaintenances">
              <Button variant="outline" onClick={() => { setEditingMaint(undefined); setMaintDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New maintenance
              </Button>
            </CanCreate>
            <CanCreate resource="disposals">
              <Button onClick={() => { setEditingDisposal(undefined); setDisposalDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New disposal
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Wrench className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total maintenance</p><p className="text-lg font-bold">{maintenances.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedMaint}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Maint. cost</p><p className="text-lg font-bold">NPR {totalMaintCost.toLocaleString()}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Truck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Disposals</p><p className="text-lg font-bold">{disposals.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search maintenance, disposals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="maintenance">
        <TabsList>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="disposals">Disposals</TabsTrigger>
        </TabsList>

        <TabsContent value="maintenance" className="mt-4">
          {maintenances.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Scheduled</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Cost (NPR)</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMaintenances.map((m) => (
                      <TableRow key={m.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{m.assetName}</p>
                          {m.description && <p className="text-xs text-muted-foreground max-w-[200px] truncate">{m.description}</p>}
                        </TableCell>
                        <TableCell><Badge variant={maintTypeVariant[m.maintenanceType] ?? "secondary"} className="capitalize">{m.maintenanceType}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(m.scheduledDate)}</span></TableCell>
                        <TableCell><span className="text-xs">{m.completedDate ? fmtDate(m.completedDate) : "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{m.cost?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{m.vendor || "—"}</span></TableCell>
                        <TableCell><Badge variant={maintStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="assetMaintenances" onEdit={() => { setEditingMaint(m); setMaintDialogOpen(true); }} onDelete={() => deleteMaintenance.mutate(m)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="disposals" className="mt-4">
          {disposals.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Net Book Value</TableHead>
                      <TableHead>Gain/Loss</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisposals.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{d.assetName}</p></TableCell>
                        <TableCell><Badge variant={disposalMethodVariant[d.disposalMethod] ?? "secondary"} className="capitalize">{d.disposalMethod.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(d.disposalDate)}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{d.salePrice?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{d.buyer || "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{d.netBookValue?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className={`text-sm font-mono font-medium ${d.gainLoss >= 0 ? "text-emerald-600" : "text-destructive"}`}>{d.gainLoss >= 0 ? "+" : ""}{d.gainLoss?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={disposalStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="disposals" onEdit={() => { setEditingDisposal(d); setDisposalDialogOpen(true); }} onDelete={() => deleteDisposal.mutate(d)} />
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

      <AssetMaintenanceFormDialog open={maintDialogOpen} onOpenChange={setMaintDialogOpen} editing={editingMaint} />
      <DisposalFormDialog open={disposalDialogOpen} onOpenChange={setDisposalDialogOpen} editing={editingDisposal} />
    </div>
  );
}
