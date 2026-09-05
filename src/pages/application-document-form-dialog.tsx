import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveApplicationDocument, useApplications } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ApplicationDocument, DocumentStatus } from "@/lib/types";

const STATUSES: DocumentStatus[] = ["missing", "received", "verified", "rejected", "expired", "waived"];

export function ApplicationDocumentFormDialog({ open, onOpenChange, document }: { open: boolean; onOpenChange: (v: boolean) => void; document?: ApplicationDocument }) {
  const save = useSaveApplicationDocument();
  const applications = useApplications();
  const [form, setForm] = useState<Partial<ApplicationDocument>>({});

  useEffect(() => {
    if (open) {
      setForm(document ?? { applicationId: "", documentType: "", documentName: "", status: "missing" as DocumentStatus, verifiedBy: "", verifiedOn: "", remarks: "" });
    }
  }, [open, document]);

  const set = (patch: Partial<ApplicationDocument>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.applicationId || !form.documentType || !form.documentName || !form.status) return;
    save.mutate(
      { ...(document ?? { id: uid() }), ...form, tenantId: "tenant-default" } as ApplicationDocument,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{document ? `Edit application document` : "Create application document"}</DialogTitle>
          <DialogDescription>Register or verify an application document (M04.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Application</Label>
            <Select value={form.applicationId ?? ""} onValueChange={(v) => set({ applicationId: v })}>
              <SelectTrigger><SelectValue placeholder="Select application" /></SelectTrigger>
              <SelectContent>{(applications.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.applicantName ?? a.id}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Document type</Label>
            <Input placeholder="e.g. birth_certificate" value={form.documentType ?? ""} onChange={(e) => set({ documentType: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Document name</Label>
            <Input placeholder="Document name" value={form.documentName ?? ""} onChange={(e) => set({ documentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as DocumentStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Verified by</Label>
            <Input placeholder="Staff member" value={form.verifiedBy ?? ""} onChange={(e) => set({ verifiedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Verified on</Label>
            <Input type="date" value={form.verifiedOn ?? ""} onChange={(e) => set({ verifiedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Remarks</Label>
            <Textarea placeholder="Additional remarks" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.applicationId || !form.documentType || !form.documentName || !form.status}>
            <Plus className="h-4 w-4" /> {document ? "Save changes" : "Create document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
