import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDashboard } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

interface DashboardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any;
  dialogType?: "dashboard" | "widget";
}

const PERSONA_OPTIONS = ["principal", "teacher", "accountant", "student", "parent"] as const;
const LAYOUT_OPTIONS = ["grid", "freeform", "tabbed"] as const;
const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

export function DashboardFormDialog({ open, onOpenChange, editing }: DashboardFormDialogProps) {
  const save = useSaveDashboard();
  const [form, setForm] = useState({ id: "", code: "", name: "", persona: "principal", version: 1, layout: "grid", status: "draft", description: "" });

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ id: editing.id, code: editing.code ?? "", name: editing.name ?? "", persona: editing.persona ?? editing.ownerName ?? "principal", version: editing.version ?? 1, layout: editing.layout ?? "grid", status: editing.status ?? "draft", description: editing.description ?? "" });
      } else {
        setForm({ id: uid(), code: "", name: "", persona: "principal", version: 1, layout: "grid", status: "draft", description: "" });
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
          <DialogTitle>{editing ? "Edit Dashboard" : "Create Dashboard"}</DialogTitle>
          <DialogDescription>Configure a management dashboard (M24.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. DBS-PRINC-01" value={form.code} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Principal Overview" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Persona</Label>
            <Select value={form.persona} onValueChange={(v) => set({ persona: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PERSONA_OPTIONS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version} onChange={(e) => set({ version: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Layout</Label>
            <Select value={form.layout} onValueChange={(v) => set({ layout: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LAYOUT_OPTIONS.map((l) => <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Dashboard description…" value={form.description} onChange={(e) => set({ description: e.target.value })} />
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
