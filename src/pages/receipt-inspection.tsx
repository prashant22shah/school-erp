import { useMemo, useState } from "react";
import { PackageCheck, Search, Plus, ClipboardCheck } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GoodsReceiptFormDialog } from "@/pages/goods-receipt-form-dialog";
import { QualityInspectionFormDialog } from "@/pages/quality-inspection-form-dialog";
import { useGoodsReceipts, useQualityInspections, useDeleteGoodsReceipt, useDeleteQualityInspection } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { GoodsReceipt, QualityInspection } from "@/lib/types";

const grnStatusVariant: Record<string, "success" | "info" | "warning" | "secondary" | "destructive"> = {
  draft: "info", inspected: "warning", accepted: "success", rejected: "destructive",
};

const inspectionStatusVariant: Record<string, "success" | "info" | "warning" | "destructive"> = {
  pending: "info", passed: "success", failed: "destructive", conditional: "warning",
};

export default function ReceiptInspectionPage() {
  const goodsReceipts = useGoodsReceipts();
  const qualityInspections = useQualityInspections();
  const deleteGrn = useDeleteGoodsReceipt();
  const deleteInspection = useDeleteQualityInspection();
  const [q, setQ] = useState("");
  const [grnDialogOpen, setGrnDialogOpen] = useState(false);
  const [editingGrn, setEditingGrn] = useState<GoodsReceipt | undefined>();
  const [inspDialogOpen, setInspDialogOpen] = useState(false);
  const [editingInsp, setEditingInsp] = useState<QualityInspection | undefined>();

  const filteredGrn = useMemo(() => {
    let list = goodsReceipts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((g) => g.grnNo.toLowerCase().includes(s) || g.receivedBy.toLowerCase().includes(s) || g.status.toLowerCase().includes(s)); }
    return list;
  }, [goodsReceipts.data, q]);

  const filteredInspections = useMemo(() => {
    let list = qualityInspections.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.grnRef.toLowerCase().includes(s) || i.inspectedBy.toLowerCase().includes(s) || i.status.toLowerCase().includes(s)); }
    return list;
  }, [qualityInspections.data, q]);

  const totalGrn = goodsReceipts.data?.length ?? 0;
  const accepted = (goodsReceipts.data ?? []).filter((g) => g.status === "accepted").length;
  const pendingInspection = (goodsReceipts.data ?? []).filter((g) => g.inspectionStatus === "pending").length;
  const totalInspections = qualityInspections.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={PackageCheck}
        title="Receipt & Inspection"
        titleNe="रसीद"
        microModule="M14.05"
        description="Goods receipt notes and quality inspections for incoming deliveries."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="goodsReceipts">
              <Button variant="outline" onClick={() => { setEditingGrn(undefined); setGrnDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New GRN
              </Button>
            </CanCreate>
            <CanCreate resource="goodsReceipts">
              <Button onClick={() => { setEditingInsp(undefined); setInspDialogOpen(true); }}>
                <ClipboardCheck className="h-4 w-4" /> New inspection
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><PackageCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total GRNs</p><p className="text-lg font-bold">{totalGrn}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><PackageCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Accepted</p><p className="text-lg font-bold">{accepted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><PackageCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Inspection</p><p className="text-lg font-bold">{pendingInspection}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Inspections</p><p className="text-lg font-bold">{totalInspections}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search GRNs, inspections…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="grns">
        <TabsList>
          <TabsTrigger value="grns">Goods Receipts</TabsTrigger>
          <TabsTrigger value="inspections">Quality Inspections</TabsTrigger>
        </TabsList>
        <TabsContent value="grns" className="mt-4">
          {goodsReceipts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">GRN No</TableHead>
                <TableHead>PO Ref</TableHead>
                <TableHead>Received By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Inspection</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredGrn.map((g) => (
                  <TableRow key={g.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.grnNo}</code></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.poRef}</code></TableCell>
                    <TableCell><span className="text-sm">{g.receivedBy}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(g.receivedDate)}</span></TableCell>
                    <TableCell><Badge variant={inspectionStatusVariant[g.inspectionStatus] ?? "secondary"} className="capitalize">{g.inspectionStatus}</Badge></TableCell>
                    <TableCell><Badge variant={grnStatusVariant[g.status] ?? "secondary"} className="capitalize">{g.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="goodsReceipts" onEdit={() => { setEditingGrn(g); setGrnDialogOpen(true); }} onDelete={() => deleteGrn.mutate(g)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="inspections" className="mt-4">
          {qualityInspections.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">GRN Ref</TableHead>
                <TableHead>Inspected By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Checked</TableHead>
                <TableHead>Passed</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredInspections.map((i) => (
                  <TableRow key={i.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.grnRef}</code></TableCell>
                    <TableCell><span className="text-sm">{i.inspectedBy}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(i.inspectionDate)}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{i.itemsChecked}</span></TableCell>
                    <TableCell><span className="text-sm font-mono text-emerald-600">{i.itemsPassed}</span></TableCell>
                    <TableCell><span className="text-sm font-mono text-red-600">{i.itemsFailed}</span></TableCell>
                    <TableCell><Badge variant={inspectionStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="goodsReceipts" onEdit={() => { setEditingInsp(i); setInspDialogOpen(true); }} onDelete={() => deleteInspection.mutate(i)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <GoodsReceiptFormDialog open={grnDialogOpen} onOpenChange={setGrnDialogOpen} grn={editingGrn} />
      <QualityInspectionFormDialog open={inspDialogOpen} onOpenChange={setInspDialogOpen} inspection={editingInsp} />
    </div>
  );
}
