import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveStudentMovement, useEnrolments } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { StudentMovement, MovementType } from "@/lib/types";

const MOVEMENT_TYPES: MovementType[] = ["promotion", "repeat", "transfer_in", "transfer_out", "withdrawal", "re_admission"];

export function StudentMovementFormDialog({ open, onOpenChange, movement }: { open: boolean; onOpenChange: (o: boolean) => void; movement?: StudentMovement }) {
  const save = useSaveStudentMovement();
  const { data: enrolments } = useEnrolments();
  const [form, setForm] = useState<Partial<StudentMovement>>({});

  useEffect(() => {
    if (open) {
      setForm(movement ?? { effectiveDate: todayISO(), createdOn: todayISO() });
    }
  }, [open, movement]);

  const set = (patch: Partial<StudentMovement>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.enrolmentId || !form.type || !form.effectiveDate) return;
    const enrolment = enrolments?.find((e) => e.id === form.enrolmentId);
    save.mutate(
      { ...(movement ?? { id: uid() }), ...form, studentName: enrolment?.studentName ?? "", tenantId: "tenant-default" } as StudentMovement,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{movement ? "Edit movement" : "Create movement"}</DialogTitle>
          <DialogDescription>Record student academic movement — promotion, transfer, withdrawal (M05.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Enrolment *</Label>
            <Select value={form.enrolmentId} onValueChange={(v) => set({ enrolmentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select enrolment" /></SelectTrigger>
              <SelectContent>{enrolments?.map((e) => <SelectItem key={e.id} value={e.id}>{e.studentName} — {e.gradeName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Type *</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as MovementType })}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{MOVEMENT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>From grade</Label>
            <Input placeholder="e.g. Grade 5" value={form.fromGradeName ?? ""} onChange={(e) => set({ fromGradeName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To grade</Label>
            <Input placeholder="e.g. Grade 6" value={form.toGradeName ?? ""} onChange={(e) => set({ toGradeName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>From section</Label>
            <Input placeholder="e.g. A" value={form.fromSectionName ?? ""} onChange={(e) => set({ fromSectionName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To section</Label>
            <Input placeholder="e.g. B" value={form.toSectionName ?? ""} onChange={(e) => set({ toSectionName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Effective date *</Label>
            <Input type="date" value={form.effectiveDate ?? ""} onChange={(e) => set({ effectiveDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approved by</Label>
            <Input placeholder="e.g. Principal" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for movement" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.enrolmentId || !form.type || !form.effectiveDate}>
            <Plus className="h-4 w-4" /> {movement ? "Save changes" : "Create movement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
