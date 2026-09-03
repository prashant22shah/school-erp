import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveQuestion, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Question, QuestionType, QuestionDifficulty, QuestionStatus } from "@/lib/types";

const TYPES: QuestionType[] = ["mcq", "short", "long", "practical", "objective"];
const DIFFICULTIES: QuestionDifficulty[] = ["easy", "medium", "hard"];
const STATUSES: QuestionStatus[] = ["draft", "approved", "archived"];

export function QuestionFormDialog({ open, onOpenChange, question }: { open: boolean; onOpenChange: (o: boolean) => void; question?: Question }) {
  const save = useSaveQuestion();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<Question>>({});

  useEffect(() => {
    if (open) setForm(question ?? { subjectRef: "", code: "", text: "", type: "short", difficulty: "medium", marks: 5, status: "draft" });
  }, [open, question]);

  const set = (patch: Partial<Question>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.text || !form.subjectRef || !form.type) return;
    const now = new Date().toISOString();
    const subjectName = subjects.data?.find((s) => s.id === form.subjectRef)?.name ?? "";
    save.mutate(
      {
        ...(question ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        marks: Number(form.marks),
        subjectName,
        updatedOn: now,
      } as Question,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{question ? `Edit question — ${question.code}` : "Create question"}</DialogTitle>
          <DialogDescription>Add a question to the bank for paper generation (M08.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. Q-PHY-001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectRef} onValueChange={(v) => set({ subjectRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(subjects.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Question Text</Label>
            <Textarea placeholder="Enter question text…" value={form.text ?? ""} onChange={(e) => set({ text: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as QuestionType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Difficulty</Label>
            <Select value={form.difficulty} onValueChange={(v) => set({ difficulty: v as QuestionDifficulty })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DIFFICULTIES.map((d) => <SelectItem key={d} value={d} className="capitalize">{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Marks</Label>
            <Input type="number" min={0} value={form.marks ?? 0} onChange={(e) => set({ marks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as QuestionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.text || !form.subjectRef}>
            <Plus className="h-4 w-4" /> {question ? "Save changes" : "Create question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
