import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSyllabusPlan, useCurriculumOfferings, useAcademicYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SyllabusPlan, SyllabusStatus } from "@/lib/types";

const STATUSES: SyllabusStatus[] = ["draft", "approved", "published", "archived"];

export function SyllabusPlanFormDialog({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (o: boolean) => void; plan?: SyllabusPlan }) {
  const save = useSaveSyllabusPlan();
  const offerings = useCurriculumOfferings();
  const years = useAcademicYears();
  const [form, setForm] = useState<Partial<SyllabusPlan>>({});

  useEffect(() => {
    if (open) {
      setForm(plan ?? { offeringRef: "", academicPeriodRef: "", name: "", status: "draft" });
    }
  }, [open, plan]);

  const set = (patch: Partial<SyllabusPlan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.offeringRef || !form.academicPeriodRef || !form.name) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(plan ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as SyllabusPlan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan ? `Edit syllabus plan — ${plan.name}` : "Create syllabus plan"}</DialogTitle>
          <DialogDescription>Define a syllabus plan for an offering and academic period (M06.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Offering Ref</Label>
            <Select value={form.offeringRef} onValueChange={(v) => set({ offeringRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select offering" /></SelectTrigger>
              <SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName} - {o.gradeClassName}</SelectItem>)}</SelectContent>
            </Select>
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
            <Input placeholder="e.g. Grade 10 Mathematics Syllabus" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SyllabusStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.offeringRef || !form.academicPeriodRef || !form.name}>
            <Plus className="h-4 w-4" /> {plan ? "Save changes" : "Create plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
