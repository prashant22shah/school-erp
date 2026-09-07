import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveInterventionAlert } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { InterventionAlert, AlertKind } from "@/lib/types";

const ALERT_TYPES: AlertKind[] = ["low_engagement", "failing_grade", "attendance_drop", "missing_assignments"];
const SEVERITIES: InterventionAlert["severity"][] = ["info", "warning", "critical"];
const STATUSES: InterventionAlert["status"][] = ["open", "acknowledged", "resolved"];

export function InterventionAlertFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: InterventionAlert }) {
  const save = useSaveInterventionAlert();
  const [form, setForm] = useState<Partial<InterventionAlert>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          studentRef: "", studentName: "", courseSpaceRef: "", alertType: "low_engagement",
          severity: "warning", message: "", assignedTo: "", status: "open",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<InterventionAlert>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.courseSpaceRef || !form.message) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
      } as InterventionAlert,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit alert — ${editing.studentName}` : "Create intervention alert"}</DialogTitle>
          <DialogDescription>Raise an intervention alert for a student (M10.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="Student ID" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="e.g. Ram Shrestha" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Course Space Ref</Label>
            <Input placeholder="Course space ID" value={form.courseSpaceRef ?? ""} onChange={(e) => set({ courseSpaceRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Alert Type</Label>
            <Select value={form.alertType} onValueChange={(v) => set({ alertType: v as AlertKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ALERT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v) => set({ severity: v as InterventionAlert["severity"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Message</Label>
            <Textarea placeholder="Describe the alert" value={form.message ?? ""} onChange={(e) => set({ message: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned To</Label>
            <Input placeholder="Teacher or counselor" value={form.assignedTo ?? ""} onChange={(e) => set({ assignedTo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as InterventionAlert["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.courseSpaceRef || !form.message}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create alert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
