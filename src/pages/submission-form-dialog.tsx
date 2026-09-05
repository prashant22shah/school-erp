import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSubmission } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Submission } from "@/lib/types";

const STATUSES: Submission["status"][] = ["submitted", "late", "graded", "returned"];

export function SubmissionFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Submission }) {
  const save = useSaveSubmission();
  const [form, setForm] = useState<Partial<Submission>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          assignmentRef: "", studentName: "", submittedOn: "",
          fileUrl: "", score: 0, feedback: "", gradedBy: "", status: "submitted",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Submission>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assignmentRef || !form.studentName) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        score: Number(form.score),
      } as Submission,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit submission — ${editing.studentName}` : "Create submission"}</DialogTitle>
          <DialogDescription>Record a student submission for an assignment (M10.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assignment Ref</Label>
            <Input placeholder="Assignment ID" value={form.assignmentRef ?? ""} onChange={(e) => set({ assignmentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Submitted On</Label>
            <Input type="date" value={form.submittedOn ?? ""} onChange={(e) => set({ submittedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>File URL</Label>
            <Input placeholder="https://..." value={form.fileUrl ?? ""} onChange={(e) => set({ fileUrl: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Score</Label>
            <Input type="number" min={0} value={form.score ?? 0} onChange={(e) => set({ score: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Submission["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Graded By</Label>
            <Input placeholder="Teacher name" value={form.gradedBy ?? ""} onChange={(e) => set({ gradedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Feedback</Label>
            <Input placeholder="Feedback notes" value={form.feedback ?? ""} onChange={(e) => set({ feedback: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assignmentRef || !form.studentName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create submission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
