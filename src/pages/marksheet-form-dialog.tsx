import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveMarksheet, useStudents, useAcademicYears, useExams } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Marksheet, MarksheetStatus } from "@/lib/types";

const STATUSES: MarksheetStatus[] = ["draft", "issued", "reissued", "revoked"];

export function MarksheetFormDialog({ open, onOpenChange, marksheet }: { open: boolean; onOpenChange: (o: boolean) => void; marksheet?: Marksheet }) {
  const save = useSaveMarksheet();
  const students = useStudents();
  const academicYears = useAcademicYears();
  const exams = useExams();
  const [form, setForm] = useState<Partial<Marksheet>>({});

  useEffect(() => {
    if (open) setForm(marksheet ?? { studentRef: "", studentName: "", academicPeriodRef: "", examId: "", serial: "", status: "draft", issuedOn: new Date().toISOString().slice(0, 10) });
  }, [open, marksheet]);

  const set = (patch: Partial<Marksheet>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.academicPeriodRef || !form.serial || !form.status || !form.issuedOn) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(marksheet ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as Marksheet,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{marksheet ? `Edit marksheet — ${marksheet.studentName}` : "Create marksheet"}</DialogTitle>
          <DialogDescription>Issue or manage marksheets per student and exam (M09.04).</DialogDescription>
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
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(academicYears.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Exam (optional)</Label>
            <Select value={form.examId ?? "none"} onValueChange={(v) => set({ examId: v === "none" ? undefined : v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Serial</Label>
            <Input placeholder="e.g. MS-2082-004" value={form.serial ?? ""} onChange={(e) => set({ serial: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as MarksheetStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Issued On</Label>
            <Input type="date" value={form.issuedOn ? form.issuedOn.slice(0, 10) : ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.academicPeriodRef || !form.serial || !form.status || !form.issuedOn}>
            <Plus className="h-4 w-4" /> {marksheet ? "Save changes" : "Create marksheet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
