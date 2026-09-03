import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAttendanceAlert, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AttendanceAlert, AlertStatus } from "@/lib/types";

const STATUSES: AlertStatus[] = ["open", "acknowledged", "resolved", "dismissed"];
const ALERT_TYPES = ["chronic_absence", "late_pattern", "sudden_drop", "course_risk"];

export function AttendanceAlertFormDialog({ open, onOpenChange, alert }: { open: boolean; onOpenChange: (o: boolean) => void; alert?: AttendanceAlert }) {
  const save = useSaveAttendanceAlert();
  const students = useStudents();
  const [form, setForm] = useState<Partial<AttendanceAlert>>({});

  useEffect(() => {
    if (open) setForm(alert ?? { studentRef: "", studentName: "", ruleVersion: "v1-threshold-75", alertType: "chronic_absence", status: "open", message: "" });
  }, [open, alert]);

  const set = (patch: Partial<AttendanceAlert>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.ruleVersion || !form.alertType || !form.status) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(alert ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as AttendanceAlert,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{alert ? `Edit alert — ${alert.studentName}` : "Create attendance alert"}</DialogTitle>
          <DialogDescription>Threshold and trend alerts for intervention (M07.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => set({ studentRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Alert Type</Label>
            <Select value={form.alertType} onValueChange={(v) => set({ alertType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ALERT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Rule Version</Label>
            <Input placeholder="e.g. v1-threshold-75" value={form.ruleVersion ?? ""} onChange={(e) => set({ ruleVersion: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AlertStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Message</Label>
            <Input placeholder="Alert message…" value={form.message ?? ""} onChange={(e) => set({ message: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.ruleVersion || !form.alertType || !form.status}>
            <Plus className="h-4 w-4" /> {alert ? "Save changes" : "Create alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
