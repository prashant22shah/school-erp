import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDepreciationSchedule } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { DepreciationSchedule } from "@/lib/types";

const STATUSES = ["draft", "posted"] as const;

export function DepreciationScheduleFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: DepreciationSchedule }) {
  const save = useSaveDepreciationSchedule();
  const [form, setForm] = useState<Partial<DepreciationSchedule>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetRef: "", assetName: "", method: "", period: "", openingValue: 0, depreciationAmount: 0, accumulatedDepreciation: 0, closingValue: 0, status: "draft", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<DepreciationSchedule>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.period) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as DepreciationSchedule, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit schedule — ${editing.assetName}` : "Create depreciation schedule"}</DialogTitle>
          <DialogDescription>Record depreciation entries for an asset period (M15.06).</DialogDescription>
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
            <Label>Method</Label>
            <Select value={form.method ?? ""} onValueChange={(v) => set({ method: v })}>
              <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="straight_line">Straight Line</SelectItem>
                <SelectItem value="declining_balance">Declining Balance</SelectItem>
                <SelectItem value="units_of_production">Units of Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. 2081-01" value={form.period ?? ""} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Opening value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.openingValue ?? ""} onChange={(e) => set({ openingValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Depreciation amount (NPR)</Label>
            <Input type="number" placeholder="0" value={form.depreciationAmount ?? ""} onChange={(e) => set({ depreciationAmount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Accumulated depreciation (NPR)</Label>
            <Input type="number" placeholder="0" value={form.accumulatedDepreciation ?? ""} onChange={(e) => set({ accumulatedDepreciation: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Closing value (NPR)</Label>
            <Input type="number" placeholder="0" value={form.closingValue ?? ""} onChange={(e) => set({ closingValue: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as DepreciationSchedule["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.period}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
