import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCohort, useAcademicYears, useGradeClasses } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Cohort } from "@/lib/types";

export function CohortFormDialog({ open, onOpenChange, cohort }: { open: boolean; onOpenChange: (o: boolean) => void; cohort?: Cohort }) {
  const save = useSaveCohort();
  const years = useAcademicYears();
  const grades = useGradeClasses();
  const [form, setForm] = useState<Partial<Cohort>>({});
  useEffect(() => {
    if (open) setForm(cohort ?? { name: "", academicYearId: "", academicYearName: "", gradeClassId: "", gradeClassName: "", description: "", studentCount: 0 });
  }, [open, cohort]);
  const set = (patch: Partial<Cohort>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.name || !form.academicYearId || !form.gradeClassId) return;
    const yearName = years.data?.find((y) => y.id === form.academicYearId)?.name ?? "";
    const gradeName = grades.data?.find((g) => g.id === form.gradeClassId)?.name ?? "";
    save.mutate({ ...(cohort ?? { id: uid(), tenantId: "tenant-default" }), ...form, academicYearName: yearName, gradeClassName: gradeName } as Cohort, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{cohort ? `Edit cohort — ${cohort.name}` : "Create cohort"}</DialogTitle>
          <DialogDescription>Student cohort linked to academic year and grade (M03.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. Class 10 — Batch 2082" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Academic Year</Label><Select value={form.academicYearId} onValueChange={(v) => set({ academicYearId: v })}><SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger><SelectContent>{(years.data ?? []).map((y) => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Grade/Class</Label><Select value={form.gradeClassId} onValueChange={(v) => set({ gradeClassId: v })}><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger><SelectContent>{(grades.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Student Count</Label><Input type="number" value={form.studentCount ?? 0} onChange={(e) => set({ studentCount: +e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Description</Label><Input placeholder="Description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.academicYearId || !form.gradeClassId}><Plus className="h-4 w-4" /> {cohort ? "Save changes" : "Create cohort"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
