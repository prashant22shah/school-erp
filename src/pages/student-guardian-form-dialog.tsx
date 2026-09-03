import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveStudentGuardian, useStudents, useGuardians } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { StudentGuardian, RelationshipType } from "@/lib/types";

const RELATIONSHIP_TYPES: RelationshipType[] = ["parent", "guardian", "emergency_contact", "pickup_authorized"];

export function StudentGuardianFormDialog({ open, onOpenChange, relationship }: { open: boolean; onOpenChange: (v: boolean) => void; relationship?: StudentGuardian }) {
  const save = useSaveStudentGuardian();
  const { data: students } = useStudents();
  const { data: guardians } = useGuardians();
  const [form, setForm] = useState<Partial<StudentGuardian>>({});

  useEffect(() => {
    if (open) {
      setForm(relationship ?? { type: "parent" as RelationshipType, isPrimary: false, validFrom: todayISO() });
    }
  }, [open, relationship]);

  const set = (patch: Partial<StudentGuardian>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.guardianId || !form.type || !form.validFrom) return;
    save.mutate(
      { ...(relationship ?? { id: uid() }), ...form, tenantId: "tenant-default" } as StudentGuardian,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{relationship ? `Edit relationship` : "Create relationship"}</DialogTitle>
          <DialogDescription>Link student to guardian with relationship type (M05.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentId} onValueChange={(v) => set({ studentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Guardian</Label>
            <Select value={form.guardianId} onValueChange={(v) => set({ guardianId: v })}>
              <SelectTrigger><SelectValue placeholder="Select guardian" /></SelectTrigger>
              <SelectContent>{(guardians ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Relationship type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as RelationshipType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{RELATIONSHIP_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.isPrimary ?? false} onCheckedChange={(v) => set({ isPrimary: v })} />
            <Label>Primary guardian</Label>
          </div>
          <div className="space-y-1.5">
            <Label>Valid from</Label>
            <Input type="date" value={form.validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid to</Label>
            <Input type="date" value={form.validTo ?? ""} onChange={(e) => set({ validTo: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.guardianId || !form.type || !form.validFrom}>
            <Plus className="h-4 w-4" /> {relationship ? "Save changes" : "Create relationship"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
