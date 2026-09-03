import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveWorkloadAllocation } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { WorkloadAllocation, ActivityType } from "@/lib/types";

const ACTIVITY_TYPES: ActivityType[] = ["teaching", "assessment", "administration", "guidance", "extra_curricular"];

export function WorkloadAllocationFormDialog({ open, onOpenChange, allocation }: { open: boolean; onOpenChange: (o: boolean) => void; allocation?: WorkloadAllocation }) {
  const save = useSaveWorkloadAllocation();
  const [form, setForm] = useState<Partial<WorkloadAllocation>>({});

  useEffect(() => {
    if (open) {
      setForm(allocation ?? { staffRef: "", staffName: "", activityType: "teaching", units: "", periodStart: "", periodEnd: "" });
    }
  }, [open, allocation]);

  const set = (patch: Partial<WorkloadAllocation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.staffName || !form.activityType || !form.units || !form.periodStart || !form.periodEnd) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(allocation ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as WorkloadAllocation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{allocation ? `Edit workload — ${allocation.staffName}` : "Create workload allocation"}</DialogTitle>
          <DialogDescription>Allocate teaching workload units to staff by activity and period (M06.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Input placeholder="e.g. STAFF-001" value={form.staffRef ?? ""} onChange={(e) => set({ staffRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="e.g. Ram Sharma" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Activity Type</Label>
            <Select value={form.activityType} onValueChange={(v) => set({ activityType: v as ActivityType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ACTIVITY_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Units</Label>
            <Input placeholder="e.g. 6 periods/week" value={form.units ?? ""} onChange={(e) => set({ units: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period Start</Label>
            <Input placeholder="e.g. 2025-04-01" value={form.periodStart ?? ""} onChange={(e) => set({ periodStart: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Period End</Label>
            <Input placeholder="e.g. 2025-07-31" value={form.periodEnd ?? ""} onChange={(e) => set({ periodEnd: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.staffName || !form.activityType || !form.units || !form.periodStart || !form.periodEnd}>
            <Plus className="h-4 w-4" /> {allocation ? "Save changes" : "Create allocation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
