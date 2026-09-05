import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveWorkflowDefinition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { WorkflowDefinition } from "@/lib/types";

const STATUSES = ["draft", "active", "archived"] as const;

export function WorkflowDefinitionFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: WorkflowDefinition }) {
  const save = useSaveWorkflowDefinition();
  const [form, setForm] = useState<Partial<WorkflowDefinition>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          code: "", name: "", version: 1,
          status: "draft", configuration: "",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<WorkflowDefinition>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.status) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        code: form.code!,
        name: form.name!,
        version: form.version || 1,
        status: form.status!,
        configuration: form.configuration || "",
      } as WorkflowDefinition,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Workflow Definition" : "Create Workflow Definition"}</DialogTitle>
          <DialogDescription>Define a new workflow (M23.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="WF-001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Workflow name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version ?? 1} onChange={(e) => set({ version: parseInt(e.target.value) || 1 })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Configuration</Label>
            <Textarea placeholder="JSON configuration…" value={form.configuration ?? ""} onChange={(e) => set({ configuration: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Definition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
