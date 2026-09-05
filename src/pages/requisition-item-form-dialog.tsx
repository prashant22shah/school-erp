import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRequisitionItem, usePurchaseRequisitions } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { RequisitionItem } from "@/lib/types";

const STATUSES: RequisitionItem["status"][] = ["pending", "approved", "rejected"];

export function RequisitionItemFormDialog({ open, onOpenChange, item }: { open: boolean; onOpenChange: (o: boolean) => void; item?: RequisitionItem }) {
  const save = useSaveRequisitionItem();
  const requisitions = usePurchaseRequisitions();
  const [form, setForm] = useState<Partial<RequisitionItem>>({});

  useEffect(() => {
    if (open) {
      setForm(item ?? { requisitionRef: "", itemName: "", description: "", quantity: 0, unit: "", estimatedCost: 0, specification: "", preferredVendor: "", status: "pending" as const });
    }
  }, [open, item]);

  const set = (patch: Partial<RequisitionItem>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.requisitionRef || !form.itemName || !form.status) return;
    save.mutate(
      { ...(item ?? { id: uid(), createdOn: todayISO() }), ...form } as RequisitionItem,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? `Edit item — ${item.itemName}` : "Add requisition item"}</DialogTitle>
          <DialogDescription>Requisition line item details (M14.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Requisition</Label>
            <Select value={form.requisitionRef} onValueChange={(v) => set({ requisitionRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select requisition" /></SelectTrigger>
              <SelectContent>{requisitions.data?.map((r) => <SelectItem key={r.id} value={r.id}>{r.requisitionNo}</SelectItem>)}</SelectContent>
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
            <Label>Estimated Cost (Rs)</Label>
            <Input type="number" min={0} value={form.estimatedCost ?? 0} onChange={(e) => set({ estimatedCost: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Preferred Vendor</Label>
            <Input placeholder="Vendor name (optional)" value={form.preferredVendor ?? ""} onChange={(e) => set({ preferredVendor: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RequisitionItem["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Specification</Label>
            <Textarea placeholder="Technical specifications" value={form.specification ?? ""} onChange={(e) => set({ specification: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="Additional description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.requisitionRef || !form.itemName || !form.status}>
            <Plus className="h-4 w-4" /> {item ? "Save changes" : "Add item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
