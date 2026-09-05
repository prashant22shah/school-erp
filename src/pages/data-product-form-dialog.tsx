import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDataProduct } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

interface DataProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any;
  dialogType?: "product" | "run" | "quality";
}

const CLASSIFICATION_OPTIONS = ["public", "internal", "confidential", "restricted"] as const;

export function DataProductFormDialog({ open, onOpenChange, editing }: DataProductFormDialogProps) {
  const save = useSaveDataProduct();
  const [form, setForm] = useState({ id: "", code: "", name: "", owner: "", sla: "", classification: "internal" });

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ id: editing.id, code: editing.code ?? "", name: editing.name ?? "", owner: editing.owner ?? editing.ownerName ?? "", sla: editing.sla ?? "", classification: editing.classification ?? "internal" });
      } else {
        setForm({ id: uid(), code: "", name: "", owner: "", sla: "", classification: "internal" });
      }
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate(form as any, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Data Product" : "Create Data Product"}</DialogTitle>
          <DialogDescription>Define a data product in the warehouse (M24.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. DP-ENROLL" value={form.code} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Enrollment Dataset" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Owner</Label>
            <Input placeholder="e.g. Data Team" value={form.owner} onChange={(e) => set({ owner: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>SLA</Label>
            <Input placeholder="e.g. 99.5% uptime, 1h refresh" value={form.sla} onChange={(e) => set({ sla: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Classification</Label>
            <Select value={form.classification} onValueChange={(v) => set({ classification: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CLASSIFICATION_OPTIONS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
