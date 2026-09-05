import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveImpairment } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { Impairment } from "@/lib/types";

const STATUSES = ["draft", "approved", "posted"] as const;

export function ImpairmentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: Impairment }) {
  const save = useSaveImpairment();
  const [form, setForm] = useState<Partial<Impairment>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetName: "", impairmentDate: todayISO(), carryingValue: 0, recoverableAmount: 0, impairmentLoss: 0, reason: "", approvedBy: "", status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<Impairment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.impairmentDate) return;
    save.mutate({ ...(editing ?? { id: uid(), assetRef: "" }), ...form } as Impairment, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit impairment — ${editing.assetName}` : "Create impairment"}</DialogTitle>
          <DialogDescription>Record an asset impairment loss when recoverable amount drops below carrying value (M15.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset name</Label>
            <Input placeholder="Asset name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Impairment date</Label>
            <Input type="date" value={form.impairmentDate ?? ""} onChange={(e) => set({ impairmentDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Carrying value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.carryingValue ?? ""} onChange={(e) => set({ carryingValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Recoverable amount (NPR)</Label>
            <Input type="number" placeholder="0" value={form.recoverableAmount ?? ""} onChange={(e) => set({ recoverableAmount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Impairment loss (NPR)</Label>
            <Input type="number" placeholder="0" value={form.impairmentLoss ?? ""} onChange={(e) => set({ impairmentLoss: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approved by</Label>
            <Input placeholder="Approver name" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Impairment["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for impairment…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.impairmentDate}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create impairment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
