import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveEnrolment, useStudents, useAcademicYears, useGradeClasses, useSections, useStreams } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Enrolment, EnrolmentStatus } from "@/lib/types";

const STATUSES: EnrolmentStatus[] = ["enrolled", "promoted", "repeated", "transferred", "withdrawn", "completed"];

export function EnrolmentFormDialog({ open, onOpenChange, enrolment }: { open: boolean; onOpenChange: (o: boolean) => void; enrolment?: Enrolment }) {
  const save = useSaveEnrolment();
  const students = useStudents();
  const academicYears = useAcademicYears();
  const gradeClasses = useGradeClasses();
  const sections = useSections();
  const streams = useStreams();
  const [form, setForm] = useState<Partial<Enrolment>>({});

  useEffect(() => {
    if (open) {
      setForm(enrolment ?? { status: "enrolled" as EnrolmentStatus, effectiveFrom: todayISO(), createdOn: todayISO() });
    }
  }, [open, enrolment]);

  const set = (patch: Partial<Enrolment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.academicYearId || !form.gradeId || !form.status || !form.effectiveFrom) return;
    const student = students.data?.find((s) => s.id === form.studentId);
    const year = academicYears.data?.find((y) => y.id === form.academicYearId);
    const grade = gradeClasses.data?.find((g) => g.id === form.gradeId);
    const section = sections.data?.find((s) => s.id === form.sectionId);
    const stream = streams.data?.find((s) => s.id === form.streamId);
    save.mutate(
      {
        ...(enrolment ?? { id: uid() }),
        ...form,
        studentName: student?.personName ?? form.studentName ?? "",
        academicYearName: year?.name ?? form.academicYearName ?? "",
        gradeName: grade?.name ?? form.gradeName ?? "",
        sectionName: section?.name ?? form.sectionName,
        streamName: stream?.name ?? form.streamName,
        tenantId: "tenant-default",
      } as Enrolment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{enrolment ? `Edit enrolment — ${enrolment.studentName}` : "Create enrolment"}</DialogTitle>
          <DialogDescription>Enrol student in academic year, grade and section (M05.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentId} onValueChange={(v) => set({ studentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{students.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Academic year</Label>
            <Select value={form.academicYearId} onValueChange={(v) => set({ academicYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{academicYears.data?.map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Grade</Label>
            <Select value={form.gradeId} onValueChange={(v) => set({ gradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{gradeClasses.data?.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Section</Label>
            <Select value={form.sectionId} onValueChange={(v) => set({ sectionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>{sections.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stream</Label>
            <Select value={form.streamId} onValueChange={(v) => set({ streamId: v })}>
              <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
              <SelectContent>{streams.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Roll number</Label>
            <Input placeholder="e.g. 12" value={form.rollNumber ?? ""} onChange={(e) => set({ rollNumber: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as EnrolmentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Effective from</Label>
            <Input type="date" value={form.effectiveFrom ?? ""} onChange={(e) => set({ effectiveFrom: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.academicYearId || !form.gradeId || !form.status || !form.effectiveFrom}>
            <Plus className="h-4 w-4" /> {enrolment ? "Save changes" : "Create enrolment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EnrolmentFormDialog;
