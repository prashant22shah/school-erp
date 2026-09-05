import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSavePurchaseRequisition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PurchaseRequisition } from "@/lib/types";

const STATUSES: PurchaseRequisition["status"][] = ["draft", "submitted", "approved", "rejected", "converted"];

export function PurchaseRequisitionFormDialog({ open, onOpenChange, requisition }: { open: boolean; onOpenChange: (o: boolean) => void; requisition?: PurchaseRequisition }) {
  const save = useSavePurchaseRequisition();
  const [form, setForm] = useState<Partial<PurchaseRequisition>>({});

  useEffect(() => {
    if (open) {
      setForm(requisition ?? { requisitionNo: "", department: "", requestedBy: "", requestedByName: "", purpose: "", totalEstimate: 0, status: "draft" as const });
    }
  }, [open, requisition]);

  const set = (patch: Partial<PurchaseRequisition>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.requisitionNo || !form.department || !form.requestedByName || !form.status) return;
    save.mutate(
      { ...(requisition ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as PurchaseRequisition,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{requisition ? `Edit requisition — ${requisition.requisitionNo}` : "Create requisition"}</DialogTitle>
          <DialogDescription>Purchase requisition details (M14.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Requisition No</Label>
            <Input placeholder="e.g. PR-2026-001" value={form.requisitionNo ?? ""} onChange={(e) => set({ requisitionNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Department</Label>
            <Input placeholder="Department name" value={form.department ?? ""} onChange={(e) => set({ department: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Requested By (Name)</Label>
            <Input placeholder="Full name" value={form.requestedByName ?? ""} onChange={(e) => set({ requestedByName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Estimate (Rs)</Label>
            <Input type="number" min={0} value={form.totalEstimate ?? 0} onChange={(e) => set({ totalEstimate: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PurchaseRequisition["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Purpose</Label>
            <Textarea placeholder="Purpose of requisition" value={form.purpose ?? ""} onChange={(e) => set({ purpose: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.requisitionNo || !form.department || !form.requestedByName || !form.status}>
            <Plus className="h-4 w-4" /> {requisition ? "Save changes" : "Create requisition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
