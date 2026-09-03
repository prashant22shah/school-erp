import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveExam, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Exam, ExamType, ExamStatus } from "@/lib/types";

const TYPES: ExamType[] = ["unit", "terminal", "pre_board", "board", "entrance"];
const STATUSES: ExamStatus[] = ["draft", "scheduled", "ongoing", "completed", "cancelled"];

export function ExamFormDialog({ open, onOpenChange, exam }: { open: boolean; onOpenChange: (o: boolean) => void; exam?: Exam }) {
  const save = useSaveExam();
  const years = useAcademicYears();
  const [form, setForm] = useState<Partial<Exam>>({});

  useEffect(() => {
    if (open) setForm(exam ?? { academicPeriodRef: "", code: "", name: "", type: "terminal", status: "draft", startDate: "", endDate: "" });
  }, [open, exam]);

  const set = (patch: Partial<Exam>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.type || !form.startDate || !form.endDate) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(exam ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as Exam,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exam ? `Edit exam — ${exam.name}` : "Create exam"}</DialogTitle>
          <DialogDescription>Schedule an examination event with date range (M08.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. EXAM-T1-2082" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as ExamType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. First Terminal 2082" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ExamStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Start Date</Label>
            <Input type="date" value={form.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End Date</Label>
            <Input type="date" value={form.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.type || !form.startDate || !form.endDate}>
            <Plus className="h-4 w-4" /> {exam ? "Save changes" : "Create exam"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
