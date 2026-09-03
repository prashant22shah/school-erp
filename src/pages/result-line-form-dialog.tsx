import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveResultLine, useResultRuns, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ResultLine, ResultOutcome } from "@/lib/types";

const OUTCOMES: ResultOutcome[] = ["pass", "fail", "withheld", "absent"];

export function ResultLineFormDialog({ open, onOpenChange, resultLine }: { open: boolean; onOpenChange: (o: boolean) => void; resultLine?: ResultLine }) {
  const save = useSaveResultLine();
  const resultRuns = useResultRuns();
  const students = useStudents();
  const [form, setForm] = useState<Partial<ResultLine>>({});

  useEffect(() => {
    if (open) setForm(resultLine ?? { resultRunId: "", studentRef: "", studentName: "", totalMarks: 0, gpa: undefined, grade: "", outcome: "pass", rank: undefined });
  }, [open, resultLine]);

  const set = (patch: Partial<ResultLine>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.resultRunId || !form.studentRef || form.totalMarks == null || !form.outcome) return;
    const now = new Date().toISOString();
    const resultRunName = resultRuns.data?.find((r) => r.id === form.resultRunId)?.name ?? "";
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(resultLine ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        resultRunName,
        studentName,
        updatedOn: now,
      } as ResultLine,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resultLine ? `Edit result line — ${resultLine.studentName}` : "Create result line"}</DialogTitle>
          <DialogDescription>Student outcome within a result run (M09.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Result Run</Label>
            <Select value={form.resultRunId} onValueChange={(v) => set({ resultRunId: v })}>
              <SelectTrigger><SelectValue placeholder="Select run" /></SelectTrigger>
              <SelectContent>{(resultRuns.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => {
              const name = students.data?.find((s) => s.id === v)?.personName ?? "";
              set({ studentRef: v, studentName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Marks</Label>
            <Input type="number" placeholder="e.g. 342" value={form.totalMarks ?? 0} onChange={(e) => set({ totalMarks: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>GPA</Label>
            <Input type="number" step="0.01" placeholder="e.g. 3.65" value={form.gpa ?? ""} onChange={(e) => set({ gpa: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. A, B+" value={form.grade ?? ""} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <Select value={form.outcome} onValueChange={(v) => set({ outcome: v as ResultOutcome })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{OUTCOMES.map((o) => <SelectItem key={o} value={o} className="capitalize">{o}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Rank</Label>
            <Input type="number" placeholder="e.g. 1" value={form.rank ?? ""} onChange={(e) => set({ rank: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.resultRunId || !form.studentRef || form.totalMarks == null || !form.outcome}>
            <Plus className="h-4 w-4" /> {resultLine ? "Save changes" : "Create line"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
