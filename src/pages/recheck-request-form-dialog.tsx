import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRecheckRequest, useMarkEntries, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { RecheckRequest, RecheckStatus } from "@/lib/types";

const STATUSES: RecheckStatus[] = ["pending", "in_review", "approved", "rejected", "completed"];

export function RecheckRequestFormDialog({ open, onOpenChange, request }: { open: boolean; onOpenChange: (o: boolean) => void; request?: RecheckRequest }) {
  const save = useSaveRecheckRequest();
  const marks = useMarkEntries();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<RecheckRequest>>({});

  useEffect(() => {
    if (open) setForm(request ?? { markEntryId: "", subjectRef: "", reason: "", status: "pending", requestedOn: new Date().toISOString().slice(0, 10) });
  }, [open, request]);

  const set = (patch: Partial<RecheckRequest>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.markEntryId || !form.subjectRef || !form.reason || !form.status) return;
    const now = new Date().toISOString();
    const studentName = marks.data?.find((m) => m.id === form.markEntryId)?.studentName ?? "";
    save.mutate(
      {
        ...(request ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName: (form as any).studentName ?? studentName,
        requestedOn: form.requestedOn ?? now.slice(0, 10),
        updatedOn: now,
      } as RecheckRequest,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{request ? `Edit recheck request` : "Create recheck request"}</DialogTitle>
          <DialogDescription>Request re-totalling or re-assessment of marks (M08.09).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Mark Entry</Label>
            <Select value={form.markEntryId} onValueChange={(v) => set({ markEntryId: v })}>
              <SelectTrigger><SelectValue placeholder="Select mark entry" /></SelectTrigger>
              <SelectContent>{(marks.data ?? []).map((m) => <SelectItem key={m.id} value={m.id}>{m.studentName ?? m.registrationId} — {m.subjectName ?? m.subjectRef} ({m.marksObtained}/{m.maxMarks})</SelectItem>)}</SelectContent>
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
            <Label>Requested On</Label>
            <Input type="date" value={form.requestedOn ?? ""} onChange={(e) => set({ requestedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RecheckStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Textarea placeholder="Reason for recheck…" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.markEntryId || !form.subjectRef || !form.reason || !form.status}>
            <Plus className="h-4 w-4" /> {request ? "Save changes" : "Create request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
