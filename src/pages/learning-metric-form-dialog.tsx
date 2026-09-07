import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLearningMetric } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LearningMetric } from "@/lib/types";

const RISK_LEVELS: LearningMetric["riskLevel"][] = ["low", "medium", "high"];

export function LearningMetricFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: LearningMetric }) {
  const save = useSaveLearningMetric();
  const [form, setForm] = useState<Partial<LearningMetric>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          studentRef: "", studentName: "", courseSpaceRef: "", loginCount: 0,
          contentAccessed: 0, assignmentCompletion: 0, quizAverage: 0,
          attendanceRate: 0, riskLevel: "low",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<LearningMetric>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.courseSpaceRef) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        loginCount: Number(form.loginCount),
        contentAccessed: Number(form.contentAccessed),
        assignmentCompletion: Number(form.assignmentCompletion),
        quizAverage: Number(form.quizAverage),
        attendanceRate: Number(form.attendanceRate),
      } as LearningMetric,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit metric — ${editing.studentName}` : "Record learning metric"}</DialogTitle>
          <DialogDescription>Track a student's engagement and performance metrics (M10.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="Student ID" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Course Space Ref</Label>
            <Input placeholder="Course space ID" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Login Count</Label>
            <Input type="number" min={0} value={form.loginCount ?? 0} onChange={(e) => set({ loginCount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Content Accessed</Label>
            <Input type="number" min={0} value={form.contentAccessed ?? 0} onChange={(e) => set({ contentAccessed: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assignment Completion (%)</Label>
            <Input type="number" min={0} max={100} value={form.assignmentCompletion ?? 0} onChange={(e) => set({ assignmentCompletion: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Quiz Average</Label>
            <Input type="number" min={0} max={100} value={form.quizAverage ?? 0} onChange={(e) => set({ quizAverage: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Attendance Rate (%)</Label>
            <Input type="number" min={0} max={100} value={form.attendanceRate ?? 0} onChange={(e) => set({ attendanceRate: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Risk Level</Label>
            <Select value={form.riskLevel} onValueChange={(v) => set({ riskLevel: v as LearningMetric["riskLevel"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RISK_LEVELS.map((r) => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.courseSpaceRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Record metric"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
