import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveStudentAnalytics } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

export function StudentAnalyticsFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: any }) {
  const save = useSaveStudentAnalytics();
  const [form, setForm] = useState({ id: "", studentRef: "", studentName: "", grade: "", attendanceRate: 0, avgScore: 0, assignmentCompletion: 0, riskScore: 0, riskFactors: "", interventions: "", lastUpdated: "", createdOn: "" });

  useEffect(() => {
    if (open) {
      if (editing) setForm(editing);
      else setForm({ id: uid(), studentRef: "", studentName: "", grade: "", attendanceRate: 0, avgScore: 0, assignmentCompletion: 0, riskScore: 0, riskFactors: "", interventions: "", lastUpdated: new Date().toISOString(), createdOn: new Date().toISOString() });
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Student Analytics" : "Add Student Analytics"}</DialogTitle>
          <DialogDescription>Track student success metrics and risk indicators (M24.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="e.g. STU-001" value={form.studentRef} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.studentName} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. Grade 10" value={form.grade} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Attendance Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.attendanceRate} onChange={(e) => set({ attendanceRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Average Score</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.avgScore} onChange={(e) => set({ avgScore: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assignment Completion (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.assignmentCompletion} onChange={(e) => set({ assignmentCompletion: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Risk Score (0-100)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={form.riskScore} onChange={(e) => set({ riskScore: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Risk Factors</Label>
            <Input placeholder="e.g. Low attendance, poor grades" value={form.riskFactors} onChange={(e) => set({ riskFactors: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Interventions</Label>
            <Input placeholder="e.g. Counseling, parent meeting" value={form.interventions} onChange={(e) => set({ interventions: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => save.mutate({ ...form, lastUpdated: new Date().toISOString() }, { onSuccess: () => onOpenChange(false) })} disabled={save.isPending || !form.studentName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
