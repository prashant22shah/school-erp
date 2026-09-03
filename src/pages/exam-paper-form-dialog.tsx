import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveExamPaper, useAssessments, useSubjects } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ExamPaper, PaperStatus } from "@/lib/types";

const STATUSES: PaperStatus[] = ["draft", "in_review", "approved", "published", "archived"];

export function ExamPaperFormDialog({ open, onOpenChange, paper }: { open: boolean; onOpenChange: (o: boolean) => void; paper?: ExamPaper }) {
  const save = useSaveExamPaper();
  const assessments = useAssessments();
  const subjects = useSubjects();
  const [form, setForm] = useState<Partial<ExamPaper>>({});

  useEffect(() => {
    if (open) setForm(paper ?? { assessmentId: "", subjectRef: "", code: "", title: "", totalMarks: 100, durationMins: 180, status: "draft" });
  }, [open, paper]);

  const set = (patch: Partial<ExamPaper>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.title || !form.subjectRef || !form.assessmentId) return;
    const now = new Date().toISOString();
    const assessmentName = assessments.data?.find((a) => a.id === form.assessmentId)?.name ?? "";
    const subjectName = subjects.data?.find((s) => s.id === form.subjectRef)?.name ?? "";
    save.mutate(
      {
        ...(paper ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        totalMarks: Number(form.totalMarks),
        durationMins: Number(form.durationMins),
        assessmentName,
        subjectName,
        updatedOn: now,
      } as ExamPaper,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{paper ? `Edit paper — ${paper.code}` : "Create exam paper"}</DialogTitle>
          <DialogDescription>Compose a paper linked to assessment and subject (M08.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. PAP-PHY-T1" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectRef} onValueChange={(v) => set({ subjectRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(subjects.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Physics — Class 11 — Terminal Paper A" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assessment</Label>
            <Select value={form.assessmentId} onValueChange={(v) => set({ assessmentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select assessment" /></SelectTrigger>
              <SelectContent>{(assessments.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.code} — {a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Total Marks</Label>
            <Input type="number" min={0} value={form.totalMarks ?? 0} onChange={(e) => set({ totalMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Duration (mins)</Label>
            <Input type="number" min={0} value={form.durationMins ?? 0} onChange={(e) => set({ durationMins: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PaperStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_"," ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.title || !form.subjectRef || !form.assessmentId}>
            <Plus className="h-4 w-4" /> {paper ? "Save changes" : "Create paper"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
