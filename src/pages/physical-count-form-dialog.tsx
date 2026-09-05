import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePhysicalCount } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { PhysicalCount } from "@/lib/types";

const STATUSES = ["draft", "in_progress", "completed", "adjusted"] as const;

export function PhysicalCountFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: PhysicalCount }) {
  const save = useSavePhysicalCount();
  const [form, setForm] = useState<Partial<PhysicalCount>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { countNo: "", storeRef: "", countDate: todayISO(), countedBy: "", itemCounted: 0, discrepancyCount: 0, status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<PhysicalCount>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.countNo || !form.storeRef) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as PhysicalCount, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit count — ${editing.countNo}` : "Create physical count"}</DialogTitle>
          <DialogDescription>Initiate a physical stock count session (M15.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Count no</Label>
            <Input placeholder="e.g. PC-2081-001" value={form.countNo ?? ""} onChange={(e) => set({ countNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Store reference</Label>
            <Input placeholder="Store name or code" value={form.storeRef ?? ""} onChange={(e) => set({ storeRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Count date</Label>
            <Input type="date" value={form.countDate ?? ""} onChange={(e) => set({ countDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Counted by</Label>
            <Input placeholder="Staff name" value={form.countedBy ?? ""} onChange={(e) => set({ countedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Items counted</Label>
            <Input type="number" placeholder="0" value={form.itemCounted ?? ""} onChange={(e) => set({ itemCounted: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Discrepancies</Label>
            <Input type="number" placeholder="0" value={form.discrepancyCount ?? ""} onChange={(e) => set({ discrepancyCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PhysicalCount["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.countNo || !form.storeRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create count"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
