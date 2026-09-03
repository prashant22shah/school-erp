import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveCurriculumOffering, useSubjects, useGradeClasses, useStreams } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CurriculumOffering } from "@/lib/types";

export function CurriculumOfferingFormDialog({ open, onOpenChange, offering }: { open: boolean; onOpenChange: (o: boolean) => void; offering?: CurriculumOffering }) {
  const save = useSaveCurriculumOffering();
  const subjects = useSubjects();
  const gradeClasses = useGradeClasses();
  const streams = useStreams();
  const [form, setForm] = useState<Partial<CurriculumOffering>>({});

  useEffect(() => {
    if (open) {
      setForm(offering ?? { subjectId: "", subjectName: "", gradeClassId: "", gradeClassName: "", streamId: "", streamName: "", isCompulsory: true, fullMarks: 100, passMarks: 40, creditHours: 0, isActive: true });
    }
  }, [open, offering]);

  const set = (patch: Partial<CurriculumOffering>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.subjectId || !form.gradeClassId) return;
    const subjectName = (subjects.data ?? []).find((s) => s.id === form.subjectId)?.name ?? "";
    const gradeClassName = (gradeClasses.data ?? []).find((g) => g.id === form.gradeClassId)?.name ?? "";
    const streamName = form.streamId ? (streams.data ?? []).find((s) => s.id === form.streamId)?.name : undefined;
    save.mutate(
      { ...(offering ?? { id: uid() }), ...form, subjectName, gradeClassName, streamName } as CurriculumOffering,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{offering ? `Edit offering — ${offering.subjectName}` : "Create curriculum offering"}</DialogTitle>
          <DialogDescription>Map a subject to a grade/class with marks and credit configuration (M03.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={form.subjectId} onValueChange={(v) => set({ subjectId: v })}>
              <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
              <SelectContent>{(subjects.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Grade/class</Label>
            <Select value={form.gradeClassId} onValueChange={(v) => set({ gradeClassId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade/class" /></SelectTrigger>
              <SelectContent>{(gradeClasses.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stream (optional)</Label>
            <Select value={form.streamId ?? ""} onValueChange={(v) => set({ streamId: v || undefined })}>
              <SelectTrigger><SelectValue placeholder="All streams" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">All streams</SelectItem>
                {(streams.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Full marks</Label>
            <Input type="number" min={0} value={form.fullMarks ?? 100} onChange={(e) => set({ fullMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Pass marks</Label>
            <Input type="number" min={0} value={form.passMarks ?? 40} onChange={(e) => set({ passMarks: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Credit hours</Label>
            <Input type="number" min={0} value={form.creditHours ?? 0} onChange={(e) => set({ creditHours: +e.target.value })} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.isCompulsory ?? true} onCheckedChange={(v) => set({ isCompulsory: v })} />
            <Label>Compulsory</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.subjectId || !form.gradeClassId}>
            <Plus className="h-4 w-4" /> {offering ? "Save changes" : "Create offering"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
