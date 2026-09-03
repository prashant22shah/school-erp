import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveIntegrityCase, useExams, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { IntegrityCase, IntegrityType, IntegrityStatus } from "@/lib/types";

const TYPES: IntegrityType[] = ["malpractice", "impersonation", "cheating", "disruption", "other"];
const STATUSES: IntegrityStatus[] = ["open", "under_review", "resolved", "dismissed"];

export function IntegrityCaseFormDialog({ open, onOpenChange, integrityCase }: { open: boolean; onOpenChange: (o: boolean) => void; integrityCase?: IntegrityCase }) {
  const save = useSaveIntegrityCase();
  const exams = useExams();
  const students = useStudents();
  const [form, setForm] = useState<Partial<IntegrityCase>>({});

  useEffect(() => {
    if (open) setForm(integrityCase ?? { examId: "", studentRef: "", studentName: "", type: "cheating", description: "", status: "open" });
  }, [open, integrityCase]);

  const set = (patch: Partial<IntegrityCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.studentRef || !form.type || !form.status) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(integrityCase ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as IntegrityCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{integrityCase ? `Edit integrity case — ${integrityCase.studentName}` : "Create integrity case"}</DialogTitle>
          <DialogDescription>Report and track examination integrity incidents (M08.08).</DialogDescription>
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
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as IntegrityType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as IntegrityStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the incident…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.studentRef || !form.type || !form.status}>
            <Plus className="h-4 w-4" /> {integrityCase ? "Save changes" : "Create case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
