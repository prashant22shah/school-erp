import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAssessmentComponent, useAssessments } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { AssessmentComponent } from "@/lib/types";

export function AssessmentComponentFormDialog({ open, onOpenChange, component }: { open: boolean; onOpenChange: (o: boolean) => void; component?: AssessmentComponent }) {
  const save = useSaveAssessmentComponent();
  const assessments = useAssessments();
  const [form, setForm] = useState<Partial<AssessmentComponent>>({});

  useEffect(() => {
    if (open) setForm(component ?? { assessmentId: "", name: "", maxMarks: 25, weight: 25 });
  }, [open, component]);

  const set = (patch: Partial<AssessmentComponent>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assessmentId || !form.name || form.maxMarks == null || form.weight == null) return;
    const now = new Date().toISOString();
    const assessmentName = assessments.data?.find((a) => a.id === form.assessmentId)?.name ?? "";
    save.mutate(
      {
        ...(component ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        maxMarks: Number(form.maxMarks),
        weight: Number(form.weight),
        assessmentName,
        updatedOn: now,
      } as AssessmentComponent,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{component ? `Edit component — ${component.name}` : "Create assessment component"}</DialogTitle>
          <DialogDescription>Break down an assessment into weighted components (M08.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assessment</Label>
            <Select value={form.assessmentId} onValueChange={(v) => set({ assessmentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select assessment" /></SelectTrigger>
              <SelectContent>{(assessments.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Theory, Practical, MCQ Section" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Max Marks</Label>
            <Input type="number" min={0} value={form.maxMarks ?? 0} onChange={(e) => set({ maxMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Weight (%)</Label>
            <Input type="number" min={0} max={100} value={form.weight ?? 0} onChange={(e) => set({ weight: +e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assessmentId || !form.name}>
            <Plus className="h-4 w-4" /> {component ? "Save changes" : "Create component"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
