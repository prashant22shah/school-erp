import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveResultRun, useAcademicYears, useExams } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ResultRun, ResultRunStatus } from "@/lib/types";

const STATUSES: ResultRunStatus[] = ["draft", "computed", "approved", "published", "superseded"];

export function ResultRunFormDialog({ open, onOpenChange, resultRun }: { open: boolean; onOpenChange: (o: boolean) => void; resultRun?: ResultRun }) {
  const save = useSaveResultRun();
  const academicYears = useAcademicYears();
  const exams = useExams();
  const [form, setForm] = useState<Partial<ResultRun>>({});

  useEffect(() => {
    if (open) setForm(resultRun ?? { academicPeriodRef: "", examId: "", name: "", status: "draft", computedOn: "" });
  }, [open, resultRun]);

  const set = (patch: Partial<ResultRun>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.examId || !form.academicPeriodRef || !form.status) return;
    const now = new Date().toISOString();
    const examName = exams.data?.find((e) => e.id === form.examId)?.name ?? "";
    save.mutate(
      {
        ...(resultRun ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        examName,
        updatedOn: now,
      } as ResultRun,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{resultRun ? `Edit result run — ${resultRun.name}` : "Create result run"}</DialogTitle>
          <DialogDescription>Compute or publish a result run for an exam (M09.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Terminal 1 — Class 10 — 2082" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(academicYears.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={form.examId} onValueChange={(v) => set({ examId: v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ResultRunStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Computed On</Label>
            <Input type="date" value={form.computedOn ? form.computedOn.slice(0, 10) : ""} onChange={(e) => set({ computedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.examId || !form.academicPeriodRef || !form.status}>
            <Plus className="h-4 w-4" /> {resultRun ? "Save changes" : "Create run"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
