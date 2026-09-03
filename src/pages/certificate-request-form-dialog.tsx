import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCertificateRequest, useStudents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CertificateRequest, CertificateType, CertRequestStatus } from "@/lib/types";

const CERT_TYPES: CertificateType[] = ["transfer", "character", "migration", "provisional", "bonafide", "other"];
const STATUSES: CertRequestStatus[] = ["pending", "approved", "issued", "rejected"];

export function CertificateRequestFormDialog({ open, onOpenChange, request }: { open: boolean; onOpenChange: (o: boolean) => void; request?: CertificateRequest }) {
  const save = useSaveCertificateRequest();
  const students = useStudents();
  const [form, setForm] = useState<Partial<CertificateRequest>>({});

  useEffect(() => {
    if (open) setForm(request ?? { studentRef: "", studentName: "", certificateType: "transfer", purpose: "", status: "pending", requestedOn: new Date().toISOString().slice(0, 10) });
  }, [open, request]);

  const set = (patch: Partial<CertificateRequest>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentRef || !form.certificateType || !form.purpose || !form.status || !form.requestedOn) return;
    const now = new Date().toISOString();
    const studentName = students.data?.find((s) => s.id === form.studentRef)?.personName ?? form.studentName ?? "";
    save.mutate(
      {
        ...(request ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        studentName,
        updatedOn: now,
      } as CertificateRequest,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{request ? `Edit request — ${request.studentName}` : "Create certificate request"}</DialogTitle>
          <DialogDescription>Guardian / student request for a certificate (M09.05).</DialogDescription>
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
            <Label>Certificate Type</Label>
            <Select value={form.certificateType} onValueChange={(v) => set({ certificateType: v as CertificateType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CERT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CertRequestStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Purpose</Label>
            <Input placeholder="e.g. Admission to new school" value={form.purpose ?? ""} onChange={(e) => set({ purpose: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Requested On</Label>
            <Input type="date" value={form.requestedOn ? form.requestedOn.slice(0, 10) : ""} onChange={(e) => set({ requestedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.studentRef || !form.certificateType || !form.purpose || !form.status || !form.requestedOn}>
            <Plus className="h-4 w-4" /> {request ? "Save changes" : "Create request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
