import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCompletionRecord, useStudents, useGradeClasses, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CompletionRecord, CompletionType, CompletionStatus } from "@/lib/types";

const TYPES: CompletionType[] = ["SEE", "NEB_12", "school_completion", "transfer"];
const STATUSES: CompletionStatus[] = ["pending", "completed", "withheld", "certified"];

export function CompletionRecordFormDialog({ open, onOpenChange, record }: { open: boolean; onOpenChange: (o: boolean) => void; record?: CompletionRecord }) {
  const save = useSaveCompletionRecord();
  const students = useStudents();
  const gradeClasses = useGradeClasses();
  const academicYears = useAcademicYears();
  const [form, setForm] = useState<Partial<CompletionRecord>>({});

  useEffect(() => {
    if (open) setForm(record ?? { studentRef: "", studentName: "", gradeClassRef: "", academicPeriodRef: "", type: "SEE", status: "pending", completedOn: new Date().toISOString().slice(0, 10) });
  }, [open, record]);

  const set = (patch: Partial<CompletionRecord>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.gradeClassRef || !form.academicPeriodRef || !form.type || !form.status || !form.completedOn) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(record ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as CompletionRecord,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{record ? `Edit completion — ${record.studentName}` : "Create completion record"}</DialogTitle>
          <DialogDescription>Record SEE / NEB or school completion attestation (M09.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
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
            <Label>Grade / Class</Label>
            <Select value={form.gradeClassRef} onValueChange={(v) => set({ gradeClassRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(academicYears.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as CompletionType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CompletionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Completed On</Label>
            <Input type="date" value={form.completedOn ? form.completedOn.slice(0, 10) : ""} onChange={(e) => set({ completedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.gradeClassRef || !form.academicPeriodRef || !form.type || !form.status || !form.completedOn}>
            <Plus className="h-4 w-4" /> {record ? "Save changes" : "Create record"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
