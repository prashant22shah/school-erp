import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveCohortAnalysis } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

export function CohortAnalysisFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveCohortAnalysis();
  const [form, setForm] = useState({ id: "", cohortName: "", gradeRef: "", academicYear: "", enrolledCount: 0, promotedCount: 0, repeatedCount: 0, withdrawnCount: 0, avgAttendance: 0, avgScore: 0, passRate: 0, dropoutRate: 0, analyzedOn: "", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), cohortName: "", gradeRef: "", academicYear: "", enrolledCount: 0, promotedCount: 0, repeatedCount: 0, withdrawnCount: 0, avgAttendance: 0, avgScore: 0, passRate: 0, dropoutRate: 0, analyzedOn: new Date().toISOString(), createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Cohort Analysis" : "Add Cohort Analysis"}</DialogTitle>
          <DialogDescription>Analyze cohort performance and progression (M24.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Cohort Name</Label>
            <Input placeholder="e.g. Grade 10 Batch 2025" value={form.cohortName} onChange={(e) => set({ cohortName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade Ref</Label>
            <Input placeholder="e.g. GRADE-10" value={form.gradeRef} onChange={(e) => set({ gradeRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Year</Label>
            <Input placeholder="e.g. 2025" value={form.academicYear} onChange={(e) => set({ academicYear: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Enrolled Count</Label>
            <Input type="number" min={0} value={form.enrolledCount} onChange={(e) => set({ enrolledCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Promoted Count</Label>
            <Input type="number" min={0} value={form.promotedCount} onChange={(e) => set({ promotedCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Repeated Count</Label>
            <Input type="number" min={0} value={form.repeatedCount} onChange={(e) => set({ repeatedCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Withdrawn Count</Label>
            <Input type="number" min={0} value={form.withdrawnCount} onChange={(e) => set({ withdrawnCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Avg Attendance (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.avgAttendance} onChange={(e) => set({ avgAttendance: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Avg Score</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.avgScore} onChange={(e) => set({ avgScore: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Pass Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.passRate} onChange={(e) => set({ passRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Dropout Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.dropoutRate} onChange={(e) => set({ dropoutRate: Number(e.target.value) })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate({ ...form, analyzedOn: new Date().toISOString() }, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.cohortName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
