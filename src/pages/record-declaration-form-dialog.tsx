import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveRecordDeclaration } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { RecordDeclaration } from "@/lib/types";

const CLASSIFICATIONS = ["public", "internal", "confidential", "restricted"] as const;

export function RecordDeclarationFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: RecordDeclaration }) {
  const save = useSaveRecordDeclaration();
  const [form, setForm] = useState<Partial<RecordDeclaration>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          documentId: "", classification: "internal",
          declaredAt: "",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<RecordDeclaration>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.documentId || !form.classification) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        documentId: form.documentId!,
        classification: form.classification!,
        declaredAt: form.declaredAt || new Date().toISOString(),
      } as RecordDeclaration,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Record Declaration" : "Create Record Declaration"}</DialogTitle>
          <DialogDescription>Declare a record for retention (M23.08).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Document ID</Label>
            <Input placeholder="Document identifier" value={form.documentId ?? ""} onChange={(e) => set({ documentId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Classification</Label>
            <Select value={form.classification} onValueChange={(v) => set({ classification: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CLASSIFICATIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Declared At</Label>
            <Input type="datetime-local" value={form.declaredAt ? form.declaredAt.slice(0, 16) : ""} onChange={(e) => set({ declaredAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.documentId || !form.classification}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Declaration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
