import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStudentAttendance, useAttendanceSessions, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { StudentAttendance, StudentAttendanceStatus } from "@/lib/types";

const STATUSES: StudentAttendanceStatus[] = ["present", "absent", "late", "excused", "leave", "half_day", "unknown"];

export function StudentAttendanceFormDialog({ open, onOpenChange, attendance }: { open: boolean; onOpenChange: (o: boolean) => void; attendance?: StudentAttendance }) {
  const save = useSaveStudentAttendance();
  const sessions = useAttendanceSessions();
  const students = useStudents();
  const [form, setForm] = useState<Partial<StudentAttendance>>({});

  useEffect(() => {
    if (open) setForm(attendance ?? { sessionId: "", studentRef: "", studentName: "", status: "present", recordedAt: new Date().toISOString().slice(0,16) });
  }, [open, attendance]);

  const set = (patch: Partial<StudentAttendance>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.sessionId || !form.studentRef || !form.status || !form.recordedAt) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    const sessionLabel = sessions.data?.find((s) => s.id === form.sessionId)?.sessionDate ?? "";
    save.mutate(
      {
        ...(attendance ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        sessionLabel,
        updatedOn: now,
      } as StudentAttendance,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{attendance ? `Edit attendance — ${attendance.studentName}` : "Record student attendance"}</DialogTitle>
          <DialogDescription>Capture present/absent/late status for a session (M07.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Session</Label>
            <Select value={form.sessionId} onValueChange={(v) => set({ sessionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
              <SelectContent>{(sessions.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.sectionName} — {s.sessionDate} P{s.periodNo}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => set({ studentRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StudentAttendanceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Recorded At</Label>
            <Input type="datetime-local" value={form.recordedAt ?? ""} onChange={(e) => set({ recordedAt: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Input placeholder="Remarks…" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.sessionId || !form.studentRef || !form.status || !form.recordedAt}>
            <Plus className="h-4 w-4" /> {attendance ? "Save changes" : "Record attendance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
