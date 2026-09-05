import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveQuiz } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Quiz, QuizKind } from "@/lib/types";

const TYPES: QuizKind[] = ["practice", "graded", "timed"];
const STATUSES: Quiz["status"][] = ["draft", "published", "closed"];

export function QuizFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Quiz }) {
  const save = useSaveQuiz();
  const [form, setForm] = useState<Partial<Quiz>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          courseSpaceRef: "", title: "", type: "practice",
          questionCount: 10, timeLimit: 30, maxScore: 100, passingScore: 40, status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Quiz>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.courseSpaceRef || !form.title) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        questionCount: Number(form.questionCount),
        timeLimit: Number(form.timeLimit),
        maxScore: Number(form.maxScore),
        passingScore: Number(form.passingScore),
        updatedOn: now,
      } as Quiz,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit quiz — ${editing.title}` : "Create quiz"}</DialogTitle>
          <DialogDescription>Configure a quiz with questions, time limit and scoring (M10.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Course Space Ref</Label>
            <Input placeholder="Course space ID" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Chapter 3 Quiz" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as QuizKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Quiz["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Question Count</Label>
            <Input type="number" min={0} value={form.questionCount ?? 10} onChange={(e) => set({ questionCount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Time Limit (min)</Label>
            <Input type="number" min={0} value={form.timeLimit ?? 30} onChange={(e) => set({ timeLimit: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Score</Label>
            <Input type="number" min={0} value={form.maxScore ?? 100} onChange={(e) => set({ maxScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Passing Score</Label>
            <Input type="number" min={0} value={form.passingScore ?? 40} onChange={(e) => set({ passingScore: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.courseSpaceRef || !form.title}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
