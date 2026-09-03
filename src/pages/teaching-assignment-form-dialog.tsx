import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTeachingAssignment, useSections, useCurriculumOfferings } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TeachingAssignment } from "@/lib/types";

export function TeachingAssignmentFormDialog({ open, onOpenChange, assignment }: { open: boolean; onOpenChange: (o: boolean) => void; assignment?: TeachingAssignment }) {
  const save = useSaveTeachingAssignment();
  const sections = useSections();
  const offerings = useCurriculumOfferings();
  const [form, setForm] = useState<Partial<TeachingAssignment>>({});

  useEffect(() => {
    if (open) {
      setForm(assignment ?? { staffRef: "", staffName: "", sectionRef: "", sectionName: "", offeringRef: "", subjectName: "" });
    }
  }, [open, assignment]);

  const set = (patch: Partial<TeachingAssignment>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.sectionRef || !form.offeringRef) return;
    const sectionName = (sections.data ?? []).find((s) => s.id === form.sectionRef)?.name ?? "";
    const subjectName = (offerings.data ?? []).find((o) => o.id === form.offeringRef)?.subjectName ?? "";
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(assignment ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        sectionName,
        subjectName,
        updatedOn: now,
      } as TeachingAssignment,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignment ? `Edit teaching assignment — ${assignment.staffName}` : "Create teaching assignment"}</DialogTitle>
          <DialogDescription>Assign staff to a subject and section (M06.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="e.g. Ram Sharma" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Input placeholder="e.g. STAFF-001" value={form.staffRef ?? ""} onChange={(e) => set({ staffRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Section</Label>
            <Select value={form.sectionRef} onValueChange={(v) => set({ sectionRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
              <SelectContent>{(sections.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.gradeClassName})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Offering</Label>
            <Select value={form.offeringRef} onValueChange={(v) => set({ offeringRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select offering" /></SelectTrigger>
              <SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.sectionRef || !form.offeringRef}>
            <Plus className="h-4 w-4" /> {assignment ? "Save changes" : "Create assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
