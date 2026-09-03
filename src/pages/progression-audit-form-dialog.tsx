import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveProgressionAudit, useEnrolments } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { ProgressionAudit, AuditOutcome } from "@/lib/types";

const OUTCOMES: AuditOutcome[] = ["promoted", "conditionally_promoted", "repeated", "completed", "failed"];

export function ProgressionAuditFormDialog({ open, onOpenChange, audit }: { open: boolean; onOpenChange: (o: boolean) => void; audit?: ProgressionAudit }) {
  const save = useSaveProgressionAudit();
  const enrolments = useEnrolments();
  const [form, setForm] = useState<Partial<ProgressionAudit>>({});
  useEffect(() => {
    if (open) setForm(audit ?? { enrolmentId: "", studentName: "", gradeName: "", academicYearName: "", ruleVersion: "", outcome: "promoted", decidedBy: "", decidedOn: todayISO() });
  }, [open, audit]);
  const set = (patch: Partial<ProgressionAudit>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.enrolmentId || !form.outcome || !form.decidedBy) return;
    const enrol = enrolments.data?.find((e) => e.id === form.enrolmentId);
    save.mutate({ ...(audit ?? { id: uid(), tenantId: "tenant-default" }), ...form, studentName: enrol?.studentName ?? form.studentName ?? "", gradeName: enrol?.gradeName ?? form.gradeName ?? "", academicYearName: enrol?.academicYearName ?? form.academicYearName ?? "", decidedOn: form.decidedOn ?? todayISO() } as ProgressionAudit, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{audit ? `Edit audit — ${audit.studentName}` : "Create progression audit"}</DialogTitle>
          <DialogDescription>Promotion/completion audit outcome (M05.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Enrolment</Label><Select value={form.enrolmentId} onValueChange={(v) => set({ enrolmentId: v })}><SelectTrigger><SelectValue placeholder="Select enrolment" /></SelectTrigger><SelectContent>{(enrolments.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.studentName} — {e.gradeName}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Outcome</Label><Select value={form.outcome} onValueChange={(v) => set({ outcome: v as AuditOutcome })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{OUTCOMES.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Rule Version</Label><Input placeholder="e.g. PR-v2081" value={form.ruleVersion ?? ""} onChange={(e) => set({ ruleVersion: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Decided By</Label><Input placeholder="Decided by" value={form.decidedBy ?? ""} onChange={(e) => set({ decidedBy: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>GPA</Label><Input type="number" step="0.01" value={form.gpa ?? ""} onChange={(e) => set({ gpa: e.target.value ? +e.target.value : undefined })} /></div>
          <div className="space-y-1.5"><Label>Attendance %</Label><Input type="number" value={form.attendance ?? ""} onChange={(e) => set({ attendance: e.target.value ? +e.target.value : undefined })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.enrolmentId || !form.outcome || !form.decidedBy}><Plus className="h-4 w-4" /> {audit ? "Save changes" : "Create audit"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
