import { useMemo, useState } from "react";
import { ShoppingCart, Search, Plus, FileText } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PurchaseOrderFormDialog } from "@/pages/purchase-order-form-dialog";
import { PoItemFormDialog } from "@/pages/po-item-form-dialog";
import { usePurchaseOrders, usePoItems, useDeletePurchaseOrder, useDeletePoItem } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { PurchaseOrder, POItem } from "@/lib/types";

const poStatusVariant: Record<string, "success" | "info" | "warning" | "secondary" | "destructive"> = {
  draft: "info", sent: "warning", acknowledged: "secondary", partial_received: "warning", completed: "success", cancelled: "destructive",
};

const itemStatusVariant: Record<string, "info" | "warning" | "success"> = {
  pending: "info", partial: "warning", received: "success",
};

export default function PurchaseOrdersPage() {
  const purchaseOrders = usePurchaseOrders();
  const poItems = usePoItems();
  const deletePo = useDeletePurchaseOrder();
  const deletePoItem = useDeletePoItem();
  const [q, setQ] = useState("");
  const [poDialogOpen, setPoDialogOpen] = useState(false);
  const [editingPo, setEditingPo] = useState<PurchaseOrder | undefined>();
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<POItem | undefined>();

  const filteredPo = useMemo(() => {
    let list = purchaseOrders.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.poNo.toLowerCase().includes(s) || p.vendorName.toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [purchaseOrders.data, q]);

  const filteredItems = useMemo(() => {
    let list = poItems.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.itemName.toLowerCase().includes(s) || i.poRef.toLowerCase().includes(s) || i.status.toLowerCase().includes(s)); }
    return list;
  }, [poItems.data, q]);

  const total = purchaseOrders.data?.length ?? 0;
  const completed = (purchaseOrders.data ?? []).filter((p) => p.status === "completed").length;
  const active = (purchaseOrders.data ?? []).filter((p) => ["sent", "acknowledged", "partial_received"].includes(p.status)).length;
  const totalValue = (purchaseOrders.data ?? []).reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShoppingCart}
        title="Purchase Orders"
        titleNe="खरिद आदेश"
        microModule="M14.04"
        description="Purchase orders and line items — track orders, delivery and receipts."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="purchaseOrders">
              <Button variant="outline" onClick={() => { setEditingPo(undefined); setPoDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New PO
              </Button>
            </CanCreate>
            <CanCreate resource="purchaseOrders">
              <Button onClick={() => { setEditingItem(undefined); setItemDialogOpen(true); }}>
                <FileText className="h-4 w-4" /> New item
              </Button>
            </CanCreate>
          </div>
        }
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShoppingCart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total POs</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ShoppingCart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ShoppingCart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShoppingCart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">Rs {totalValue.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search POs, items…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="items">PO Items</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-4">
          {purchaseOrders.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">PO No</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Requisition</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredPo.map((p) => (
                  <TableRow key={p.id} className="group">
                    <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.poNo}</code></TableCell>
                    <TableCell><p className="font-medium">{p.vendorName}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.requisitionRef}</code></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(p.orderDate)}</span></TableCell>
                    <TableCell><span className="text-sm">{fmtDate(p.deliveryDate)}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {p.totalAmount.toLocaleString()}</span></TableCell>
                    <TableCell><Badge variant={poStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="purchaseOrders" onEdit={() => { setEditingPo(p); setPoDialogOpen(true); }} onDelete={() => deletePo.mutate(p)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="items" className="mt-4">
          {poItems.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead className="pl-5">Item</TableHead>
                <TableHead>PO</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="pr-5" />
              </TableRow></TableHeader>
              <TableBody>
                {filteredItems.map((i) => (
                  <TableRow key={i.id} className="group">
                    <TableCell className="pl-5"><p className="font-medium">{i.itemName}</p></TableCell>
                    <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.poRef}</code></TableCell>
                    <TableCell><span className="text-sm font-mono">{i.quantity}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {i.unitPrice.toLocaleString()}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">Rs {i.totalPrice.toLocaleString()}</span></TableCell>
                    <TableCell><span className="text-sm font-mono">{i.receivedQty}</span></TableCell>
                    <TableCell><Badge variant={itemStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                    <TableCell className="pr-5 text-right">
                      <RowActionMenu resource="purchaseOrders" onEdit={() => { setEditingItem(i); setItemDialogOpen(true); }} onDelete={() => deletePoItem.mutate(i)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <PurchaseOrderFormDialog open={poDialogOpen} onOpenChange={setPoDialogOpen} po={editingPo} />
      <PoItemFormDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} item={editingItem} />
    </div>
  );
}
