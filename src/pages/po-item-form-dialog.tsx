import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePoItem, usePurchaseOrders } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { POItem } from "@/lib/types";

const STATUSES: POItem["status"][] = ["pending", "partial", "received"];

export function PoItemFormDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item?: POItem }) {
  const save = useSavePoItem();
  const pos = usePurchaseOrders();
  const [form, setForm] = useState<Partial<POItem>>({});

  useEffect(() => {
    if (open) {
      setForm(item ?? { poRef: "", itemName: "", description: "", quantity: 0, unit: "", unitPrice: 0, totalPrice: 0, receivedQty: 0, status: "pending" as const });
    }
  }, [open, item]);

  const set = (patch: Partial<POItem>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.poRef || !form.itemName || !form.status) return;
    const total = (form.quantity ?? 0) * (form.unitPrice ?? 0);
    save.mutate(
      { ...(item ?? { id: uid(), createdOn: todayISO() }), ...form, totalPrice: total } as POItem,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? `Edit item — ${item.itemName}` : "Add PO item"}</DialogTitle>
          <DialogDescription>Purchase order line item (M14.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Purchase Order</Label>
            <Select value={form.poRef} onValueChange={(v) => set({ poRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select PO" /></SelectTrigger>
              <SelectContent>{pos.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.poNo}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Item Name</Label>
            <Input placeholder="Item description" value={form.itemName ?? ""} onChange={(e) => set({ itemName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Quantity</Label>
            <Input type="number" min={0} value={form.quantity ?? 0} onChange={(e) => set({ quantity: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit</Label>
            <Input placeholder="e.g. pcs, kg, box" value={form.unit ?? ""} onChange={(e) => set({ unit: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Unit Price (Rs)</Label>
            <Input type="number" min={0} value={form.unitPrice ?? 0} onChange={(e) => set({ unitPrice: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Received Qty</Label>
            <Input type="number" min={0} value={form.receivedQty ?? 0} onChange={(e) => set({ receivedQty: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as POItem["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="Item description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.poRef || !form.itemName || !form.status}>
            <Plus className="h-4 w-4" /> {item ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
