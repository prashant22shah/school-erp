import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAssignment } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Assignment, AssignmentSubmissionMode } from "@/lib/types";

const MODES: AssignmentSubmissionMode[] = ["online", "offline", "both"];
const STATUSES: string[] = ["draft", "published", "closed", "graded"];

export function LmsAssignmentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Assignment }) {
  const save = useSaveAssignment();
  const [form, setForm] = useState<Partial<Assignment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          courseSpaceRef: "", title: "", description: "", dueDate: "",
          maxScore: 100, weightage: 10, submissionMode: "online", status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Assignment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.courseSpaceRef || !form.title) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        maxScore: Number(form.maxScore),
        weightage: Number(form.weightage),
      } as Assignment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit assignment — ${editing.title}` : "Create assignment"}</DialogTitle>
          <DialogDescription>Define an assignment with due date, scoring and submission mode (M10.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Course Space Ref</Label>
            <Input placeholder="Course space ID" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Chapter 5 Homework" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Assignment details" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate ?? ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Submission Mode</Label>
            <Select value={form.submissionMode} onValueChange={(v) => set({ submissionMode: v as AssignmentSubmissionMode })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MODES.map((m) => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Max Score</Label>
            <Input type="number" min={0} value={form.maxScore ?? 100} onChange={(e) => set({ maxScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Weightage (%)</Label>
            <Input type="number" min={0} max={100} value={form.weightage ?? 10} onChange={(e) => set({ weightage: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Assignment["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.courseSpaceRef || !form.title}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
