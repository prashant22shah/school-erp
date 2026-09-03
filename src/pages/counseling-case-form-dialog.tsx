import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveCounselingCase } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CounselingCase } from "@/lib/types";

const CASE_TYPES = ["academic", "behavioral", "emotional", "career", "safeguarding"] as const;
const SEVERITIES = ["low", "medium", "high", "critical"] as const;
const STATUSES = ["open", "in_progress", "closed", "escalated"] as const;

export function CounselingCaseFormDialog({ open, onOpenChange, counselingCase }: { open: boolean; onOpenChange: (o: boolean) => void; counselingCase?: CounselingCase }) {
  const save = useSaveCounselingCase();
  const [form, setForm] = useState<Partial<CounselingCase>>({});

  useEffect(() => {
    if (open) {
      setForm(
        counselingCase ?? {
          studentName: "", studentRef: "", caseType: "academic",
          severity: "low", status: "open", assignedTo: "", description: "",
        }
      );
    }
  }, [open, counselingCase]);

  const set = (patch: Partial<CounselingCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.caseType || !form.severity || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: counselingCase?.id ?? uid(),
        createdOn: counselingCase?.createdOn ?? now,
        studentName: form.studentName!,
        studentRef: form.studentRef || "",
        caseType: form.caseType!,
        severity: form.severity!,
        status: form.status!,
        assignedTo: form.assignedTo || "",
        description: form.description || "",
      } as CounselingCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{counselingCase ? `Edit counseling case — ${counselingCase.studentName}` : "Create counseling case"}</DialogTitle>
          <DialogDescription>Record a student counseling case (M19.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Full name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="e.g. STU-001" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Case Type</Label>
            <Select value={form.caseType} onValueChange={(v) => set({ caseType: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CASE_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Severity</Label>
            <Select value={form.severity} onValueChange={(v) => set({ severity: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SEVERITIES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Assigned To</Label>
            <Input placeholder="Counselor / Staff name" value={form.assignedTo ?? ""} onChange={(e) => set({ assignedTo: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the case…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.caseType || !form.severity || !form.status}>
            <Plus className="h-4 w-4" /> {counselingCase ? "Save changes" : "Create case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
