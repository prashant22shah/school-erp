import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveModelVersion } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

interface ModelVersionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any;
  dialogType?: "version" | "score";
}

const APPROVAL_OPTIONS = ["draft", "approved", "rejected"] as const;
const STATUS_OPTIONS = ["active", "archived"] as const;

export function ModelVersionFormDialog({ open, onOpenChange, editing }: ModelVersionFormDialogProps) {
  const save = useSaveModelVersion();
  const [form, setForm] = useState({ id: "", useCase: "", name: "", version: 1, approval: "draft", status: "active" });

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ id: editing.id, useCase: editing.useCase ?? editing.type ?? "", name: editing.name ?? editing.modelName ?? "", version: editing.version ?? 1, approval: editing.approval ?? "draft", status: editing.status ?? "active" });
      } else {
        setForm({ id: uid(), useCase: "", name: "", version: 1, approval: "draft", status: "active" });
      }
    }
  }, [open, editing]);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.useCase || !form.name) return;
    save.mutate(form as any, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Model Version" : "Create Model Version"}</DialogTitle>
          <DialogDescription>Register an AI/ML model version (M24.05-06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Use Case</Label>
            <Input placeholder="e.g. Student Attrition Prediction" value={form.useCase} onChange={(e) => set({ useCase: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. attrition-v2" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version} onChange={(e) => set({ version: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approval</Label>
            <Select value={form.approval} onValueChange={(v) => set({ approval: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{APPROVAL_OPTIONS.map((a) => <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.useCase || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
