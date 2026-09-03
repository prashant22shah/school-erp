import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCertificate, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Certificate, CertificateType, CertificateStatus } from "@/lib/types";

const TYPES: CertificateType[] = ["transfer", "character", "migration", "provisional", "bonafide", "other"];
const STATUSES: CertificateStatus[] = ["draft", "issued", "revoked", "expired"];

export function CertificateFormDialog({ open, onOpenChange, certificate }: { open: boolean; onOpenChange: (o: boolean) => void; certificate?: Certificate }) {
  const save = useSaveCertificate();
  const students = useStudents();
  const [form, setForm] = useState<Partial<Certificate>>({});

  useEffect(() => {
    if (open) setForm(certificate ?? { studentRef: "", studentName: "", type: "transfer", serial: "", status: "draft", issuedOn: new Date().toISOString().slice(0, 10), validUntil: "" });
  }, [open, certificate]);

  const set = (patch: Partial<Certificate>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.type || !form.serial || !form.status || !form.issuedOn) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(certificate ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as Certificate,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{certificate ? `Edit certificate — ${certificate.serial}` : "Create certificate"}</DialogTitle>
          <DialogDescription>Issue transfer, character or other certificates (M09.05).</DialogDescription>
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
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as CertificateType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Serial</Label>
            <Input placeholder="e.g. CER-2082-045" value={form.serial ?? ""} onChange={(e) => set({ serial: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CertificateStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issued On</Label>
            <Input type="date" value={form.issuedOn ? form.issuedOn.slice(0, 10) : ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Valid Until (optional)</Label>
            <Input type="date" value={form.validUntil ? form.validUntil.slice(0, 10) : ""} onChange={(e) => set({ validUntil: e.target.value || undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.type || !form.serial || !form.status || !form.issuedOn}>
            <Plus className="h-4 w-4" /> {certificate ? "Save changes" : "Create certificate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
