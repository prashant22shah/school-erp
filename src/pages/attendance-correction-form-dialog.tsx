import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAttendanceCorrection, useAttendanceSessions, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AttendanceCorrection, StudentAttendanceStatus, CorrectionStatus } from "@/lib/types";

const ATT_STATUSES: StudentAttendanceStatus[] = ["present", "absent", "late", "excused", "leave", "half_day", "unknown"];
const STATUSES: CorrectionStatus[] = ["draft", "pending", "approved", "rejected"];

export function AttendanceCorrectionFormDialog({ open, onOpenChange, correction }: { open: boolean; onOpenChange: (o: boolean) => void; correction?: AttendanceCorrection }) {
  const save = useSaveAttendanceCorrection();
  const sessions = useAttendanceSessions();
  const students = useStudents();
  const [form, setForm] = useState<Partial<AttendanceCorrection>>({});

  useEffect(() => {
    if (open) setForm(correction ?? { sessionId: "", studentRef: "", studentName: "", fromStatus: "absent", toStatus: "present", reason: "", status: "draft" });
  }, [open, correction]);

  const set = (patch: Partial<AttendanceCorrection>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.sessionId || !form.studentRef || !form.fromStatus || !form.toStatus || !form.reason) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(correction ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as AttendanceCorrection,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{correction ? `Edit correction — ${correction.studentName}` : "Create attendance correction"}</DialogTitle>
          <DialogDescription>Audited change request with approval workflow (M07.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Session</Label>
            <Select value={form.sessionId} onValueChange={(v) => set({ sessionId: v })}>
              <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
              <SelectContent>{(sessions.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.sectionName} — {s.sessionDate}</SelectItem>)}</SelectContent>
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
            <Label>From Status</Label>
            <Select value={form.fromStatus} onValueChange={(v) => set({ fromStatus: v as StudentAttendanceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ATT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>To Status</Label>
            <Select value={form.toStatus} onValueChange={(v) => set({ toStatus: v as StudentAttendanceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ATT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CorrectionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Approval</Label>
            <Input placeholder="Approved by" value={form.approval ?? ""} onChange={(e) => set({ approval: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input placeholder="Reason for correction" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.sessionId || !form.studentRef || !form.fromStatus || !form.toStatus || !form.reason}>
            <Plus className="h-4 w-4" /> {correction ? "Save changes" : "Create correction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
