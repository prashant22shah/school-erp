import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePurchaseOrder } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PurchaseOrder } from "@/lib/types";

const STATUSES: PurchaseOrder["status"][] = ["draft", "sent", "acknowledged", "partial_received", "completed", "cancelled"];

export function PurchaseOrderFormDialog({ open, onOpenChange, po }: { open: boolean; onOpenChange: (o: boolean) => void; po?: PurchaseOrder }) {
  const save = useSavePurchaseOrder();
  const [form, setForm] = useState<Partial<PurchaseOrder>>({});

  useEffect(() => {
    if (open) {
      setForm(po ?? { poNo: "", vendorRef: "", vendorName: "", requisitionRef: "", orderDate: "", deliveryDate: "", totalAmount: 0, terms: "", status: "draft" as const });
    }
  }, [open, po]);

  const set = (patch: Partial<PurchaseOrder>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.poNo || !form.vendorName || !form.status) return;
    save.mutate(
      { ...(po ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as PurchaseOrder,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{po ? `Edit PO — ${po.poNo}` : "Create purchase order"}</DialogTitle>
          <DialogDescription>Purchase order details (M14.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>PO No</Label>
            <Input placeholder="e.g. PO-2026-001" value={form.poNo ?? ""} onChange={(e) => set({ poNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="Vendor name" value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Order Date</Label>
            <Input type="date" value={form.orderDate ? form.orderDate.slice(0, 10) : ""} onChange={(e) => set({ orderDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Delivery Date</Label>
            <Input type="date" value={form.deliveryDate ? form.deliveryDate.slice(0, 10) : ""} onChange={(e) => set({ deliveryDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Amount (Rs)</Label>
            <Input type="number" min={0} value={form.totalAmount ?? 0} onChange={(e) => set({ totalAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PurchaseOrder["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Terms & Conditions</Label>
            <Textarea placeholder="Payment and delivery terms" value={form.terms ?? ""} onChange={(e) => set({ terms: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.poNo || !form.vendorName || !form.status}>
            <Plus className="h-4 w-4" /> {po ? "Save changes" : "Create PO"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
