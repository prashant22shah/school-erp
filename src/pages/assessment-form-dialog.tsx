import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAssessment, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Assessment, AssessmentType, AssessmentStatus } from "@/lib/types";

const TYPES: AssessmentType[] = ["formative", "summative", "unit_test", "terminal", "board_mock"];
const STATUSES: AssessmentStatus[] = ["draft", "published", "active", "archived"];

export function AssessmentFormDialog({ open, onOpenChange, assessment }: { open: boolean; onOpenChange: (o: boolean) => void; assessment?: Assessment }) {
  const save = useSaveAssessment();
  const years = useAcademicYears();
  const [form, setForm] = useState<Partial<Assessment>>({});

  useEffect(() => {
    if (open) {
      setForm(
        assessment ?? {
          academicPeriodRef: "",
          code: "",
          name: "",
          type: "terminal",
          maxMarks: 100,
          passMarks: 40,
          weight: 25,
          status: "draft",
        }
      );
    }
  }, [open, assessment]);

  const set = (patch: Partial<Assessment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.type || form.maxMarks == null || form.passMarks == null || form.weight == null) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(assessment ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        maxMarks: Number(form.maxMarks),
        passMarks: Number(form.passMarks),
        weight: Number(form.weight),
        updatedOn: now,
      } as Assessment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assessment ? `Edit assessment — ${assessment.name}` : "Create assessment"}</DialogTitle>
          <DialogDescription>Define assessment scheme with weightage and grading (M08.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. ASS-2082-T1" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Academic Period</Label>
            <Select value={form.academicPeriodRef} onValueChange={(v) => set({ academicPeriodRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
              <SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. First Terminal Examination" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as AssessmentType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AssessmentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" min={0} value={form.maxMarks ?? 0} onChange={(e) => set({ maxMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Pass Marks</Label>
            <Input type="number" min={0} value={form.passMarks ?? 0} onChange={(e) => set({ passMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Weight (%)</Label>
            <Input type="number" min={0} max={100} value={form.weight ?? 0} onChange={(e) => set({ weight: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.type}>
            <Plus className="h-4 w-4" /> {assessment ? "Save changes" : "Create assessment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
