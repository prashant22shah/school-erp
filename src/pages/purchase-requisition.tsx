import { useMemo, useState } from "react";
import { ClipboardList, Search, Plus, FileText } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PurchaseRequisitionFormDialog } from "@/pages/purchase-requisition-form-dialog";
import { RequisitionItemFormDialog } from "@/pages/requisition-item-form-dialog";
import { usePurchaseRequisitions, useRequisitionItems, useDeletePurchaseRequisition, useDeleteRequisitionItem } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { PurchaseRequisition, RequisitionItem } from "@/lib/types";

const prStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  draft: "info", submitted: "warning", approved: "success", rejected: "destructive", converted: "secondary",
};

const itemStatusVariant: Record<string, "success" | "info" | "warning" | "destructive"> = {
  pending: "info", approved: "success", rejected: "destructive",
};

export default function PurchaseRequisitionPage() {
  const requisitions = usePurchaseRequisitions();
  const requisitionItems = useRequisitionItems();
  const deleteRequisition = useDeletePurchaseRequisition();
  const deleteRequisitionItem = useDeleteRequisitionItem();
  const [q, setQ] = useState("");
  const [prDialogOpen, setPrDialogOpen] = useState(false);
  const [editingPr, setEditingPr] = useState<PurchaseRequisition | undefined>();
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RequisitionItem | undefined>();

  const filteredPr = useMemo(() => {
    let list = requisitions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.requisitionNo.toLowerCase().includes(s) || r.department.toLowerCase().includes(s) || r.requestedByName.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [requisitions.data, q]);

  const filteredItems = useMemo(() => {
    let list = requisitionItems.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.itemName.toLowerCase().includes(s) || i.requisitionRef.toLowerCase().includes(s) || i.status.toLowerCase().includes(s)); }
    return list;
  }, [requisitionItems.data, q]);

  const total = requisitions.data?.length ?? 0;
  const approved = (requisitions.data ?? []).filter((r) => r.status === "approved").length;
  const pending = (requisitions.data ?? []).filter((r) => r.status === "submitted").length;
  const totalValue = (requisitions.data ?? []).reduce((sum, r) => sum + (r.totalEstimate || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Purchase Requisitions"
        titleNe="खरिद माग"
        microModule="M14.02"
        description="Purchase requisitions and line items — department requests for procurement."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="purchaseRequisitions">
              <Button variant="outline" onClick={() => { setEditingPr(undefined); setPrDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New requisition
              </Button>
            </CanCreate>
            <CanCreate resource="purchaseRequisitions">
              <Button onClick={() => { setEditingItem(undefined); setItemDialogOpen(true); }}>
                <FileText className="h-4 w-4" /> New item
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Requisitions</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approved}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">Rs {totalValue.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search requisitions, items…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="requisitions">
        <TabsList>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>
        <TabsContent value="requisitions" className="mt-4">
          {requisitions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Requisition No</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Estimate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredPr.map((r) => (
                  <TableRow key={r.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.requisitionNo}</code></TableCell>
                    <TableCell><span className="text-sm">{r.department}</span></TableCell>
                    <TableCell><span className="text-sm">{r.requestedByName}</span></TableCell>
                    <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{r.purpose}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {r.totalEstimate.toLocaleString()}</span></TableCell>
                    <TableCell><Badge variant={prStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                    <TableCell><span className="text-xs">{fmtDate(r.createdOn)}</span></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="purchaseRequisitions" onEdit={() => { setEditingPr(r); setPrDialogOpen(true); }} onDelete={() => deleteRequisition.mutate(r)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          {requisitionItems.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Item</TableHead>
                <TableHead>Requisition</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Est. Cost</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredItems.map((i) => (
                  <TableRow key={i.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{i.itemName}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.requisitionRef}</code></TableCell>
                    <TableCell><span className="text-sm font-mono">{i.quantity}</span></TableCell>
                    <TableCell><span className="text-sm">{i.unit}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {i.estimatedCost.toLocaleString()}</span></TableCell>
                    <TableCell><span className="text-sm">{i.preferredVendor || "—"}</span></TableCell>
                    <TableCell><Badge variant={itemStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="purchaseRequisitions" onEdit={() => { setEditingItem(i); setItemDialogOpen(true); }} onDelete={() => deleteRequisitionItem.mutate(i)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <PurchaseRequisitionFormDialog open={prDialogOpen} onOpenChange={setPrDialogOpen} requisition={editingPr} />
      <RequisitionItemFormDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} item={editingItem} />
    </div>
  );
}
