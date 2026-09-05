import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSignatureRequest } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SignatureRequest } from "@/lib/types";

const STATUSES = ["pending", "signed", "rejected", "expired"] as const;

export function SignatureRequestFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: SignatureRequest }) {
  const save = useSaveSignatureRequest();
  const [form, setForm] = useState<Partial<SignatureRequest>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          documentId: "", signerRef: "", status: "pending",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<SignatureRequest>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.documentId || !form.signerRef || !form.status) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        documentId: form.documentId!,
        signerRef: form.signerRef!,
        status: form.status!,
      } as SignatureRequest,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Signature Request" : "Create Signature Request"}</DialogTitle>
          <DialogDescription>Request a signature on a document (M23.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Document ID</Label>
            <Input placeholder="Document identifier" value={form.documentId ?? ""} onChange={(e) => set({ documentId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Signer Reference</Label>
            <Input placeholder="Signer ID or email" value={form.signerRef ?? ""} onChange={(e) => set({ signerRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.documentId || !form.signerRef || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
