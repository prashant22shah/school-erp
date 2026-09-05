import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveGoodsReceipt } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { GoodsReceipt } from "@/lib/types";

const INSPECTION_STATUSES: GoodsReceipt["inspectionStatus"][] = ["pending", "passed", "failed"];
const STATUSES: GoodsReceipt["status"][] = ["draft", "inspected", "accepted", "rejected"];

export function GoodsReceiptFormDialog({ open, onOpenChange, grn }: { open: boolean; onOpenChange: (o: boolean) => void; grn?: GoodsReceipt }) {
  const save = useSaveGoodsReceipt();
  const [form, setForm] = useState<Partial<GoodsReceipt>>({});

  useEffect(() => {
    if (open) {
      setForm(grn ?? { grnNo: "", poRef: "", vendorRef: "", receivedBy: "", receivedDate: "", items: "", inspectionStatus: "pending" as const, notes: "", status: "draft" as const });
    }
  }, [open, grn]);

  const set = (patch: Partial<GoodsReceipt>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.grnNo || !form.receivedBy || !form.status) return;
    save.mutate(
      { ...(grn ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as GoodsReceipt,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{grn ? `Edit GRN — ${grn.grnNo}` : "Create goods receipt"}</DialogTitle>
          <DialogDescription>Goods receipt note details (M14.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>GRN No</Label>
            <Input placeholder="e.g. GRN-2026-001" value={form.grnNo ?? ""} onChange={(e) => set({ grnNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>PO Reference</Label>
            <Input placeholder="PO number" value={form.poRef ?? ""} onChange={(e) => set({ poRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor Reference</Label>
            <Input placeholder="Vendor ID" value={form.vendorRef ?? ""} onChange={(e) => set({ vendorRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Received By</Label>
            <Input placeholder="Staff name" value={form.receivedBy ?? ""} onChange={(e) => set({ receivedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Received Date</Label>
            <Input type="date" value={form.receivedDate ? form.receivedDate.slice(0, 10) : ""} onChange={(e) => set({ receivedDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Inspection Status</Label>
            <Select value={form.inspectionStatus} onValueChange={(v) => set({ inspectionStatus: v as GoodsReceipt["inspectionStatus"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{INSPECTION_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as GoodsReceipt["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Items</Label>
            <Textarea placeholder="Received items summary" value={form.items ?? ""} onChange={(e) => set({ items: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.grnNo || !form.receivedBy || !form.status}>
            <Plus className="h-4 w-4" /> {grn ? "Save changes" : "Create GRN"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
