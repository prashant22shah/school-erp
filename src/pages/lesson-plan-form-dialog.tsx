import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLessonPlan, useTeachingAssignments } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LessonPlan, LessonPlanStatus } from "@/lib/types";

const STATUSES: LessonPlanStatus[] = ["draft", "submitted", "approved", "active", "completed", "cancelled"];

export function LessonPlanFormDialog({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (o: boolean) => void; plan?: LessonPlan }) {
  const save = useSaveLessonPlan();
  const assignments = useTeachingAssignments();
  const [form, setForm] = useState<Partial<LessonPlan>>({});

  useEffect(() => {
    if (open) {
      setForm(plan ?? { assignmentId: "", localDate: "", status: "draft", objectives: "", methods: "", resources: "", homework: "", assessmentCheck: "" });
    }
  }, [open, plan]);

  const set = (patch: Partial<LessonPlan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assignmentId || !form.localDate || !form.objectives) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(plan ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as LessonPlan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan ? `Edit lesson plan — ${plan.localDate}` : "Create lesson plan"}</DialogTitle>
          <DialogDescription>Plan a lesson with objectives, methods and resources (M06.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Assignment</Label>
            <Select value={form.assignmentId} onValueChange={(v) => set({ assignmentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
              <SelectContent>{(assignments.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.staffName} - {a.subjectName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Local Date</Label>
            <Input placeholder="e.g. 2025-04-10" value={form.localDate ?? ""} onChange={(e) => set({ localDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as LessonPlanStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Objectives</Label>
            <Input placeholder="Lesson objectives…" value={form.objectives ?? ""} onChange={(e) => set({ objectives: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Methods</Label>
            <Input placeholder="Teaching methods…" value={form.methods ?? ""} onChange={(e) => set({ methods: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Resources</Label>
            <Input placeholder="Required resources…" value={form.resources ?? ""} onChange={(e) => set({ resources: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Homework</Label>
            <Input placeholder="Homework assignment…" value={form.homework ?? ""} onChange={(e) => set({ homework: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assessment Check</Label>
            <Input placeholder="Assessment criteria…" value={form.assessmentCheck ?? ""} onChange={(e) => set({ assessmentCheck: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assignmentId || !form.localDate || !form.objectives}>
            <Plus className="h-4 w-4" /> {plan ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
