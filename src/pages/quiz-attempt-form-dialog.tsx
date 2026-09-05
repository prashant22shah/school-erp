import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveQuizAttempt } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { QuizAttempt } from "@/lib/types";

const STATUSES: QuizAttempt["status"][] = ["in_progress", "completed", "timed_out"];

export function QuizAttemptFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: QuizAttempt }) {
  const save = useSaveQuizAttempt();
  const [form, setForm] = useState<Partial<QuizAttempt>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          quizRef: "", studentName: "", startedOn: "",
          completedOn: "", score: 0, answers: "", status: "in_progress",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<QuizAttempt>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.quizRef || !form.studentName) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
        score: Number(form.score),
      } as QuizAttempt,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit attempt — ${editing.studentName}` : "Record quiz attempt"}</DialogTitle>
          <DialogDescription>Record a student's quiz attempt with score and timing (M10.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Quiz Ref</Label>
            <Input placeholder="Quiz ID" value={form.quizRef ?? ""} onChange={(e) => set({ quizRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as QuizAttempt["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Started On</Label>
            <Input type="date" value={form.startedOn ?? ""} onChange={(e) => set({ startedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Completed On</Label>
            <Input type="date" value={form.completedOn ?? ""} onChange={(e) => set({ completedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Score</Label>
            <Input type="number" min={0} value={form.score ?? 0} onChange={(e) => set({ score: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Answers</Label>
            <Input placeholder="Answer summary" value={form.answers ?? ""} onChange={(e) => set({ answers: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.quizRef || !form.studentName}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Record attempt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
