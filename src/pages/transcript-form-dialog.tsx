import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTranscript, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Transcript, TranscriptStatus } from "@/lib/types";

const STATUSES: TranscriptStatus[] = ["draft", "issued", "reissued"];

export function TranscriptFormDialog({ open, onOpenChange, transcript }: { open: boolean; onOpenChange: (o: boolean) => void; transcript?: Transcript }) {
  const save = useSaveTranscript();
  const students = useStudents();
  const [form, setForm] = useState<Partial<Transcript>>({});

  useEffect(() => {
    if (open) setForm(transcript ?? { studentRef: "", studentName: "", fromPeriod: "", toPeriod: "", status: "draft", issuedOn: new Date().toISOString().slice(0, 10) });
  }, [open, transcript]);

  const set = (patch: Partial<Transcript>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.fromPeriod || !form.toPeriod || !form.status || !form.issuedOn) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(transcript ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as Transcript,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{transcript ? `Edit transcript — ${transcript.studentName}` : "Create transcript"}</DialogTitle>
          <DialogDescription>Academic transcript covering a period range (M09.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student</Label>
            <Select value={form.studentRef} onValueChange={(v) => {
              const name = students.data?.find((s) => s.id === v)?.personName ?? "";
              set({ studentRef: v, studentName: name });
            }}>
              <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>{(students.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.personName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Student name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>From Period</Label>
            <Input placeholder="e.g. 2081" value={form.fromPeriod ?? ""} onChange={(e) => set({ fromPeriod: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>To Period</Label>
            <Input placeholder="e.g. 2082" value={form.toPeriod ?? ""} onChange={(e) => set({ toPeriod: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as TranscriptStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issued On</Label>
            <Input type="date" value={form.issuedOn ? form.issuedOn.slice(0, 10) : ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.fromPeriod || !form.toPeriod || !form.status || !form.issuedOn}>
            <Plus className="h-4 w-4" /> {transcript ? "Save changes" : "Create transcript"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
