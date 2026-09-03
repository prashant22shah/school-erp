import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStudentDocument, useStudents } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { StudentDocument, StudentDocType } from "@/lib/types";

const DOC_TYPES: StudentDocType[] = ["birth_certificate", "citizenship", "photo", "transcript", "migration", "character_certificate", "medical", "other"];

const STATUSES: StudentDocument["status"][] = ["pending", "verified", "rejected"];

export function StudentDocumentFormDialog({ open, onOpenChange, document }: { open: boolean; onOpenChange: (o: boolean) => void; document?: StudentDocument }) {
  const save = useSaveStudentDocument();
  const students = useStudents();
  const [form, setForm] = useState<Partial<StudentDocument>>({});

  useEffect(() => {
    if (open) {
      setForm(document ?? { type: "birth_certificate" as StudentDocType, status: "pending" as const, createdOn: todayISO() });
    }
  }, [open, document]);

  const set = (patch: Partial<StudentDocument>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentId || !form.type || !form.documentName || !form.status) return;
    const student = students.data?.find((s) => s.id === form.studentId);
    save.mutate(
      { ...(document ?? { id: uid() }), ...form, studentName: student?.personName ?? "", tenantId: "tenant-default" } as StudentDocument,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document ? `Edit document — ${document.documentName}` : "Create document"}</DialogTitle>
          <DialogDescription>Upload or register student document (M05.03).</DialogDescription>
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
            <Label>Document type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as StudentDocType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{DOC_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Document name</Label>
            <Input placeholder="e.g. Birth Certificate" value={form.documentName ?? ""} onChange={(e) => set({ documentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as StudentDocument["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentId || !form.type || !form.documentName || !form.status}>
            <Plus className="h-4 w-4" /> {document ? "Save changes" : "Create document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
