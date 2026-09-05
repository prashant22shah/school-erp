import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useSaveCounselingSession } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { CounselingSession, CounselingType, CounselingStatus } from "@/lib/types";

const TYPES: CounselingType[] = ["career", "academic", "personal", "behavioral", "parent"];
const STATUSES: CounselingStatus[] = ["scheduled", "completed", "cancelled", "no_show"];

export function CounselingSessionFormDialog({ open, onOpenChange, session }: { open: boolean; onOpenChange: (v: boolean) => void; session?: CounselingSession }) {
  const save = useSaveCounselingSession();
  const [form, setForm] = useState<Partial<CounselingSession>>({});

  useEffect(() => {
    if (open) {
      setForm(session ?? { studentRef: "", studentName: "", counselorRef: "", counselorName: "", type: "academic" as CounselingType, scheduledOn: "", duration: 30, notes: "", outcome: "", followUpRequired: false, status: "scheduled" as CounselingStatus, createdOn: todayISO() });
    }
  }, [open, session]);

  const set = (patch: Partial<CounselingSession>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName || !form.counselorName || !form.scheduledOn) return;
    save.mutate(
      { ...(session ?? { id: uid() }), ...form, tenantId: "tenant-default" } as CounselingSession,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{session ? `Edit counseling session` : "Create counseling session"}</DialogTitle>
          <DialogDescription>Schedule or update a counseling session (M04.02).</DialogDescription>
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
            <Label>Counselor name</Label>
            <Input placeholder="Counselor name" value={form.counselorName ?? ""} onChange={(e) => set({ counselorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Counselor ref</Label>
            <Input placeholder="Counselor ID" value={form.counselorRef ?? ""} onChange={(e) => set({ counselorRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as CounselingType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled on</Label>
            <Input type="datetime-local" value={form.scheduledOn ?? ""} onChange={(e) => set({ scheduledOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (minutes)</Label>
            <Input type="number" placeholder="30" value={form.duration ?? ""} onChange={(e) => set({ duration: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CounselingStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Session notes" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Outcome</Label>
            <Input placeholder="Session outcome" value={form.outcome ?? ""} onChange={(e) => set({ outcome: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.followUpRequired ?? false} onCheckedChange={(v) => set({ followUpRequired: v })} />
            <Label>Follow-up required</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentName || !form.counselorName || !form.scheduledOn}>
            <Plus className="h-4 w-4" /> {session ? "Save changes" : "Create session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
