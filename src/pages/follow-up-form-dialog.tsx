import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveFollowUp } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { FollowUp, FollowUpStatus } from "@/lib/types";

const STATUSES: FollowUpStatus[] = ["pending", "completed", "overdue", "cancelled"];

export function FollowUpFormDialog({ open, onOpenChange, followUp }: { open: boolean; onOpenChange: (v: boolean) => void; followUp?: FollowUp }) {
  const save = useSaveFollowUp();
  const [form, setForm] = useState<Partial<FollowUp>>({});

  useEffect(() => {
    if (open) {
      setForm(followUp ?? { sessionRef: "", studentRef: "", studentName: "", assignedTo: "", action: "", dueDate: "", completedDate: "", notes: "", status: "pending" as FollowUpStatus, createdOn: todayISO() });
    }
  }, [open, followUp]);

  const set = (patch: Partial<FollowUp>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.assignedTo || !form.action || !form.dueDate) return;
    save.mutate(
      { ...(followUp ?? { id: uid() }), ...form } as FollowUp,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{followUp ? `Edit follow-up` : "Create follow-up"}</DialogTitle>
          <DialogDescription>Create or update a counseling follow-up action (M04.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student ref</Label>
            <Input placeholder="Student ID" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned to</Label>
            <Input placeholder="Staff member" value={form.assignedTo ?? ""} onChange={(e) => set({ assignedTo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Session ref</Label>
            <Input placeholder="Session ID (optional)" value={form.sessionRef ?? ""} onChange={(e) => set({ sessionRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due date</Label>
            <Input type="date" value={form.dueDate ?? ""} onChange={(e) => set({ dueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as FollowUpStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Action</Label>
            <Textarea placeholder="Follow-up action required" value={form.action ?? ""} onChange={(e) => set({ action: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.assignedTo || !form.action || !form.dueDate}>
            <Plus className="h-4 w-4" /> {followUp ? "Save changes" : "Create follow-up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
