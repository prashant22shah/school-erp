import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveExamRegistration, useExams, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ExamRegistration, RegistrationStatus } from "@/lib/types";

const STATUSES: RegistrationStatus[] = ["registered", "admitted", "absent", "cancelled", "completed"];

export function ExamRegistrationFormDialog({ open, onOpenChange, registration }: { open: boolean; onOpenChange: (o: boolean) => void; registration?: ExamRegistration }) {
  const save = useSaveExamRegistration();
  const exams = useExams();
  const students = useStudents();
  const [form, setForm] = useState<Partial<ExamRegistration>>({});

  useEffect(() => {
    if (open) setForm(registration ?? { examId: "", studentRef: "", studentName: "", status: "registered" });
  }, [open, registration]);

  const set = (patch: Partial<ExamRegistration>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.studentRef || !form.status) return;
    const now = new Date().toISOString();
    const examName = exams.data?.find((e) => e.id === form.examId)?.name ?? "";
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(registration ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        examName,
        studentName,
        updatedOn: now,
      } as ExamRegistration,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{registration ? `Edit registration — ${registration.studentName}` : "Create exam registration"}</DialogTitle>
          <DialogDescription>Register a student for an examination (M08.03).</DialogDescription>
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
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RegistrationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.studentRef || !form.status}>
            <Plus className="h-4 w-4" /> {registration ? "Save changes" : "Create registration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
