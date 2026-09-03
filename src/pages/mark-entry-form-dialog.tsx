import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveMarkEntry, useExams, useExamRegistrations, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { MarkEntry, MarkStatus } from "@/lib/types";

const STATUSES: MarkStatus[] = ["draft", "submitted", "verified", "published"];

export function MarkEntryFormDialog({ open, onOpenChange, entry }: { open: boolean; onOpenChange: (o: boolean) => void; entry?: MarkEntry }) {
  const save = useSaveMarkEntry();
  const exams = useExams();
  const registrations = useExamRegistrations();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<MarkEntry>>({});

  useEffect(() => {
    if (open) setForm(entry ?? { examId: "", registrationId: "", subjectRef: "", marksObtained: 0, maxMarks: 100, grade: "", status: "draft", enteredBy: "" });
  }, [open, entry]);

  const set = (patch: Partial<MarkEntry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.registrationId || !form.subjectRef || form.marksObtained == null || form.maxMarks == null) return;
    const now = new Date().toISOString();
    const subjectName = subjects.data?.find((s) => s.id === form.subjectRef)?.name ?? "";
    const studentName = registrations.data?.find((r) => r.id === form.registrationId)?.studentName ?? "";
    save.mutate(
      {
        ...(entry ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
        subjectName,
        studentName: (form as any).studentName ?? studentName,
        updatedOn: now,
      } as MarkEntry,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry ? `Edit mark entry — ${entry.studentName ?? entry.registrationId}` : "Create mark entry"}</DialogTitle>
          <DialogDescription>Enter marks for a student in an exam subject (M08.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={form.examId} onValueChange={(v) => set({ examId: v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Registration</Label>
            <Select value={form.registrationId} onValueChange={(v) => set({ registrationId: v })}>
              <SelectTrigger><SelectValue placeholder="Select registration" /></SelectTrigger>
              <SelectContent>{(registrations.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.studentName} ({r.examName ?? r.examId})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectRef} onValueChange={(v) => set({ subjectRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(subjects.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Entered By</Label>
            <Input placeholder="e.g. Manoj Rai" value={form.enteredBy ?? ""} onChange={(e) => set({ enteredBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Marks Obtained</Label>
            <Input type="number" min={0} value={form.marksObtained ?? 0} onChange={(e) => set({ marksObtained: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" min={0} value={form.maxMarks ?? 0} onChange={(e) => set({ maxMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Input placeholder="e.g. A, B+" value={form.grade ?? ""} onChange={(e) => set({ grade: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as MarkStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.registrationId || !form.subjectRef}>
            <Plus className="h-4 w-4" /> {entry ? "Save changes" : "Create mark entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
