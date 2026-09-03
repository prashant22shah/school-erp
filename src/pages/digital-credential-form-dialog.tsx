import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDigitalCredential, useCertificates } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { DigitalCredential, CredentialStatus } from "@/lib/types";

const STATUSES: CredentialStatus[] = ["active", "revoked", "expired"];

export function DigitalCredentialFormDialog({ open, onOpenChange, credential }: { open: boolean; onOpenChange: (o: boolean) => void; credential?: DigitalCredential }) {
  const save = useSaveDigitalCredential();
  const certificates = useCertificates();
  const [form, setForm] = useState<Partial<DigitalCredential>>({});

  useEffect(() => {
    if (open) setForm(credential ?? { certificateId: "", credentialCode: "", status: "active", issuedOn: new Date().toISOString().slice(0, 10), verifiedOn: "" });
  }, [open, credential]);

  const set = (patch: Partial<DigitalCredential>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.certificateId || !form.credentialCode || !form.status || !form.issuedOn) return;
    const now = new Date().toISOString();
    const cert = certificates.data?.find((c) => c.id === form.certificateId);
    save.mutate(
      {
        ...(credential ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        certificateSerial: cert?.serial ?? form.certificateSerial,
        studentName: cert?.studentName ?? form.studentName,
        verifiedOn: form.verifiedOn || undefined,
        updatedOn: now,
      } as DigitalCredential,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{credential ? `Edit credential — ${credential.credentialCode}` : "Create digital credential"}</DialogTitle>
          <DialogDescription>Verifiable digital credential for a certificate (M09.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Certificate</Label>
            <Select value={form.certificateId} onValueChange={(v) => set({ certificateId: v })}>
              <SelectTrigger><SelectValue placeholder="Select certificate" /></SelectTrigger>
              <SelectContent>{(certificates.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.serial} — {c.studentName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Credential Code</Label>
            <Input placeholder="e.g. CRED-9F3A2B1C" value={form.credentialCode ?? ""} onChange={(e) => set({ credentialCode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CredentialStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issued On</Label>
            <Input type="date" value={form.issuedOn ? form.issuedOn.slice(0, 10) : ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Verified On (optional)</Label>
            <Input type="date" value={form.verifiedOn ? form.verifiedOn.slice(0, 10) : ""} onChange={(e) => set({ verifiedOn: e.target.value || undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.certificateId || !form.credentialCode || !form.status || !form.issuedOn}>
            <Plus className="h-4 w-4" /> {credential ? "Save changes" : "Create credential"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
