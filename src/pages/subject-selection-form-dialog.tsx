import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveSubjectSelection, useEnrolments, useCurriculumOfferings } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { SubjectSelection } from "@/lib/types";

export function SubjectSelectionFormDialog({ open, onOpenChange, selection }: { open: boolean; onOpenChange: (o: boolean) => void; selection?: SubjectSelection }) {
  const save = useSaveSubjectSelection();
  const enrolments = useEnrolments();
  const offerings = useCurriculumOfferings();
  const [form, setForm] = useState<Partial<SubjectSelection>>({});
  useEffect(() => {
    if (open) setForm(selection ?? { enrolmentId: "", studentName: "", subjectOfferingRef: "", subjectName: "", isCompulsory: true, status: "selected", createdOn: todayISO() });
  }, [open, selection]);
  const set = (patch: Partial<SubjectSelection>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.enrolmentId || !form.subjectOfferingRef) return;
    const enrol = enrolments.data?.find((e) => e.id === form.enrolmentId);
    const off = offerings.data?.find((o) => o.id === form.subjectOfferingRef);
    save.mutate({ ...(selection ?? { id: uid(), tenantId: "tenant-default" }), ...form, studentName: enrol?.studentName ?? form.studentName ?? "", subjectName: off?.subjectName ?? form.subjectName ?? "", createdOn: form.createdOn ?? todayISO() } as SubjectSelection, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selection ? `Edit subject selection — ${selection.subjectName}` : "Create subject selection"}</DialogTitle>
          <DialogDescription>Student subject choice linked to enrolment (M05.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Enrolment</Label><Select value={form.enrolmentId} onValueChange={(v) => set({ enrolmentId: v })}><SelectTrigger><SelectValue placeholder="Select enrolment" /></SelectTrigger><SelectContent>{(enrolments.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.studentName} — {e.gradeName}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Offering</Label><Select value={form.subjectOfferingRef} onValueChange={(v) => set({ subjectOfferingRef: v })}><SelectTrigger><SelectValue placeholder="Select offering" /></SelectTrigger><SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex items-center gap-2"><Switch checked={form.isCompulsory ?? true} onCheckedChange={(v) => set({ isCompulsory: v })} /><Label>Compulsory</Label></div>
          <div className="space-y-1.5"><Label>Status</Label><Select value={form.status} onValueChange={(v) => set({ status: v as SubjectSelection["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="selected">selected</SelectItem><SelectItem value="dropped">dropped</SelectItem><SelectItem value="completed">completed</SelectItem></SelectContent></Select></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.enrolmentId || !form.subjectOfferingRef}><Plus className="h-4 w-4" /> {selection ? "Save changes" : "Create selection"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
