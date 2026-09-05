import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveMetricDefinition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

interface MetricDefinitionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any;
  dialogType?: "metric" | "dimension" | "policy" | "catalog";
}

export function MetricDefinitionFormDialog({ open, onOpenChange, editing }: MetricDefinitionFormDialogProps) {
  const save = useSaveMetricDefinition();
  const [form, setForm] = useState({ id: "", code: "", name: "", version: 1, grain: "", formula: "", description: "" });

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ id: editing.id, code: editing.code ?? "", name: editing.name ?? "", version: editing.version ?? 1, grain: editing.grain ?? editing.frequency ?? "", formula: editing.formula ?? "", description: editing.description ?? "" });
      } else {
        setForm({ id: uid(), code: "", name: "", version: 1, grain: "", formula: "", description: "" });
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
          <DialogTitle>{editing ? "Edit Metric Definition" : "Create Metric Definition"}</DialogTitle>
          <DialogDescription>Define a metric in the semantic layer (M24.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. MTR-ATT-RATE" value={form.code} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Attendance Rate" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version} onChange={(e) => set({ version: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Grain</Label>
            <Input placeholder="e.g. daily, weekly, per-student" value={form.grain} onChange={(e) => set({ grain: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Formula</Label>
            <Input placeholder="e.g. (present_days / total_days) * 100" value={form.formula} onChange={(e) => set({ formula: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Metric description…" value={form.description} onChange={(e) => set({ description: e.target.value })} />
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
