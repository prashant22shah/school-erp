import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveModerationRecord, useExams, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ModerationRecord, ModerationAction, ModerationStatus } from "@/lib/types";

const ACTIONS: ModerationAction[] = ["scaled", "grace", "remarked", "no_change"];
const STATUSES: ModerationStatus[] = ["pending", "approved", "rejected"];

export function ModerationRecordFormDialog({ open, onOpenChange, record }: { open: boolean; onOpenChange: (o: boolean) => void; record?: ModerationRecord }) {
  const save = useSaveModerationRecord();
  const exams = useExams();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<ModerationRecord>>({});

  useEffect(() => {
    if (open) setForm(record ?? { examId: "", subjectRef: "", action: "scaled", reason: "", adjustment: 0, status: "pending" });
  }, [open, record]);

  const set = (patch: Partial<ModerationRecord>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.subjectRef || !form.action || form.adjustment == null) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(record ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        adjustment: Number(form.adjustment),
        updatedOn: now,
      } as ModerationRecord,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{record ? `Edit moderation — ${record.action}` : "Create moderation record"}</DialogTitle>
          <DialogDescription>Moderation and grace actions with adjustments (M08.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Exam</Label>
            <Select value={form.examId} onValueChange={(v) => set({ examId: v })}>
              <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
              <SelectContent>{(exams.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.code} — {e.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectRef} onValueChange={(v) => set({ subjectRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(subjects.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Action</Label>
            <Select value={form.action} onValueChange={(v) => set({ action: v as ModerationAction })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ACTIONS.map((a) => <SelectItem key={a} value={a} className="capitalize">{a.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ModerationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Adjustment</Label>
            <Input type="number" value={form.adjustment ?? 0} onChange={(e) => set({ adjustment: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for moderation…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.subjectRef || !form.action}>
            <Plus className="h-4 w-4" /> {record ? "Save changes" : "Create moderation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
