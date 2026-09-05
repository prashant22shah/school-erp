import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveWorkforceAnalytics } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

export function WorkforceAnalyticsFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveWorkforceAnalytics();
  const [form, setForm] = useState({ id: "", period: "", totalStaff: 0, teachingStaff: 0, nonTeachingStaff: 0, vacancyRate: 0, attritionRate: 0, avgExperience: 0, leaveUtilization: 0, trainingHours: 0, analyzedOn: "", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), period: "", totalStaff: 0, teachingStaff: 0, nonTeachingStaff: 0, vacancyRate: 0, attritionRate: 0, avgExperience: 0, leaveUtilization: 0, trainingHours: 0, analyzedOn: new Date().toISOString(), createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Workforce Analytics" : "Add Workforce Analytics"}</DialogTitle>
          <DialogDescription>Track workforce metrics and staffing analytics (M24.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Period</Label>
            <Input placeholder="e.g. FY 2025 Q1" value={form.period} onChange={(e) => set({ period: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Staff</Label>
            <Input type="number" min={0} value={form.totalStaff} onChange={(e) => set({ totalStaff: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Teaching Staff</Label>
            <Input type="number" min={0} value={form.teachingStaff} onChange={(e) => set({ teachingStaff: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Non-Teaching Staff</Label>
            <Input type="number" min={0} value={form.nonTeachingStaff} onChange={(e) => set({ nonTeachingStaff: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vacancy Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.vacancyRate} onChange={(e) => set({ vacancyRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Attrition Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.attritionRate} onChange={(e) => set({ attritionRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Avg Experience (years)</Label>
            <Input type="number" min={0} step={0.1} value={form.avgExperience} onChange={(e) => set({ avgExperience: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Leave Utilization (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.leaveUtilization} onChange={(e) => set({ leaveUtilization: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Training Hours</Label>
            <Input type="number" min={0} step={0.1} value={form.trainingHours} onChange={(e) => set({ trainingHours: Number(e.target.value) })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate({ ...form, analyzedOn: new Date().toISOString() }, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.period}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
