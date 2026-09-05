import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveVarianceReport } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { VarianceReport } from "@/lib/types";

const STATUSES = ["open", "investigated", "adjusted", "written_off"] as const;

export function VarianceReportFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: VarianceReport }) {
  const save = useSaveVarianceReport();
  const [form, setForm] = useState<Partial<VarianceReport>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { countRef: "", itemName: "", systemQty: 0, physicalQty: 0, variance: 0, varianceValue: 0, reason: "", status: "open", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<VarianceReport>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.itemName || !form.countRef) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as VarianceReport, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit variance — ${editing.itemName}` : "Create variance report"}</DialogTitle>
          <DialogDescription>Document stock count variance with reason and resolution (M15.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Count reference</Label>
            <Input placeholder="Physical count no" value={form.countRef ?? ""} onChange={(e) => set({ countRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Item name</Label>
            <Input placeholder="Item name" value={form.itemName ?? ""} onChange={(e) => set({ itemName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>System qty</Label>
            <Input type="number" placeholder="0" value={form.systemQty ?? ""} onChange={(e) => set({ systemQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Physical qty</Label>
            <Input type="number" placeholder="0" value={form.physicalQty ?? ""} onChange={(e) => set({ physicalQty: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Variance</Label>
            <Input type="number" placeholder="0" value={form.variance ?? ""} onChange={(e) => set({ variance: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Variance value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.varianceValue ?? ""} onChange={(e) => set({ varianceValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as VarianceReport["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for variance…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.itemName || !form.countRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
