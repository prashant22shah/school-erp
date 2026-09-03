import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePracticalExam, useExams, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PracticalExam, PracticalType, PracticalStatus } from "@/lib/types";

const TYPES: PracticalType[] = ["practical", "project", "viva"];
const STATUSES: PracticalStatus[] = ["scheduled", "completed", "absent", "cancelled"];

export function PracticalExamFormDialog({ open, onOpenChange, practical }: { open: boolean; onOpenChange: (o: boolean) => void; practical?: PracticalExam }) {
  const save = useSavePracticalExam();
  const exams = useExams();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<PracticalExam>>({});

  useEffect(() => {
    if (open) setForm(practical ?? { examId: "", subjectRef: "", type: "practical", scheduledOn: "", venue: "", status: "scheduled" });
  }, [open, practical]);

  const set = (patch: Partial<PracticalExam>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.examId || !form.subjectRef || !form.type || !form.scheduledOn) return;
    const now = new Date().toISOString();
    const subjectName = subjects.data?.find((s) => s.id === form.subjectRef)?.name ?? "";
    save.mutate(
      {
        ...(practical ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        subjectName,
        updatedOn: now,
      } as PracticalExam,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{practical ? `Edit practical — ${practical.subjectName ?? practical.subjectRef}` : "Create practical exam"}</DialogTitle>
          <DialogDescription>Schedule practical, project or viva exams (M08.07).</DialogDescription>
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
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as PracticalType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PracticalStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled On</Label>
            <Input type="datetime-local" value={form.scheduledOn ?? ""} onChange={(e) => set({ scheduledOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Venue</Label>
            <Input placeholder="e.g. Physics Laboratory" value={form.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.examId || !form.subjectRef || !form.type || !form.scheduledOn}>
            <Plus className="h-4 w-4" /> {practical ? "Save changes" : "Create practical"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
