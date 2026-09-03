import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveStudentHold, useStudents } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { StudentHold, HoldType } from "@/lib/types";

const HOLD_TYPES: HoldType[] = ["academic", "financial", "disciplinary", "library", "transport", "administrative"];
const STATUSES: StudentHold["status"][] = ["active", "released", "expired"];

export function StudentHoldFormDialog({ open, onOpenChange, hold }: { open: boolean; onOpenChange: (o: boolean) => void; hold?: StudentHold }) {
  const save = useSaveStudentHold();
  const students = useStudents();
  const [form, setForm] = useState<Partial<StudentHold>>({});

  useEffect(() => {
    if (open) {
      setForm(hold ?? { holdType: "academic" as HoldType, status: "active" as const, placedOn: todayISO() });
    }
  }, [open, hold]);

  const set = (patch: Partial<StudentHold>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.holdType || !form.ownerModule || !form.reason || !form.placedBy || !form.status) return;
    const student = students.data?.find((s) => s.id === form.studentId);
    save.mutate(
      { ...(hold ?? { id: uid() }), ...form, studentName: student?.personName ?? "", tenantId: "tenant-default" } as StudentHold,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{hold ? `Edit hold` : "Create hold"}</DialogTitle>
          <DialogDescription>Place or update a student hold (M05.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentId} onValueChange={(v) => set({ studentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{students.data?.map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Hold type</Label>
            <Select value={form.holdType} onValueChange={(v) => set({ holdType: v as HoldType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{HOLD_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Owner module</Label>
            <Input placeholder="e.g. finance" value={form.ownerModule ?? ""} onChange={(e) => set({ ownerModule: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Placed by</Label>
            <Input placeholder="e.g. admin" value={form.placedBy ?? ""} onChange={(e) => set({ placedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for hold" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StudentHold["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.holdType || !form.ownerModule || !form.reason || !form.placedBy || !form.status}>
            <Plus className="h-4 w-4" /> {hold ? "Save changes" : "Create hold"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
