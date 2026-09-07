import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveCustodyRecord } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { CustodyRecord } from "@/lib/types";

const CONDITIONS = ["good", "fair", "poor", "damaged"] as const;
const STATUSES = ["active", "returned"] as const;

export function CustodyRecordFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: CustodyRecord }) {
  const save = useSaveCustodyRecord();
  const [form, setForm] = useState<Partial<CustodyRecord>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetRef: "", assetName: "", custodianRef: "", custodianName: "", assignedDate: todayISO(), returnDate: "", condition: "good", notes: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<CustodyRecord>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.custodianName) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as CustodyRecord, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit custody — ${editing.assetName}` : "Create custody record"}</DialogTitle>
          <DialogDescription>Assign an asset to a custodian and track its condition (M15.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset ref</Label>
            <Input placeholder="Asset ID" value={form.assetRef ?? ""} onChange={(e) => set({ assetRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Asset name</Label>
            <Input placeholder="Asset name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Custodian ref</Label>
            <Input placeholder="Custodian ID" value={form.custodianRef ?? ""} onChange={(e) => set({ custodianRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Custodian name</Label>
            <Input placeholder="Responsible person" value={form.custodianName ?? ""} onChange={(e) => set({ custodianName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned date</Label>
            <Input type="date" value={form.assignedDate ?? ""} onChange={(e) => set({ assignedDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Return date</Label>
            <Input type="date" value={form.returnDate ?? ""} onChange={(e) => set({ returnDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Condition</Label>
            <Select value={form.condition} onValueChange={(v) => set({ condition: v as CustodyRecord["condition"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CONDITIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CustodyRecord["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes…" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.custodianName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
