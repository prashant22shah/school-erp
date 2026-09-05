import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveReportDefinition } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";

interface ReportDefinitionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing?: any;
  dialogType?: "definition" | "run";
}

const STATUS_OPTIONS = ["draft", "published", "archived"] as const;

export function ReportDefinitionFormDialog({ open, onOpenChange, editing }: ReportDefinitionFormDialogProps) {
  const save = useSaveReportDefinition();
  const [form, setForm] = useState({ id: "", code: "", name: "", version: 1, owner: "", status: "draft", description: "" });

  useEffect(() => {
    if (open) {
      if (editing) {
        setForm({ id: editing.id, code: editing.code ?? "", name: editing.name ?? "", version: editing.version ?? 1, owner: editing.owner ?? editing.ownerName ?? "", status: editing.status ?? "draft", description: editing.description ?? "" });
      } else {
        setForm({ id: uid(), code: "", name: "", version: 1, owner: "", status: "draft", description: "" });
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
          <DialogTitle>{editing ? "Edit Report Definition" : "Create Report Definition"}</DialogTitle>
          <DialogDescription>Define an operational report (M24.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. RPT-ATT-001" value={form.code} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Attendance Summary" value={form.name} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version} onChange={(e) => set({ version: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Owner</Label>
            <Input placeholder="e.g. Academics Dept" value={form.owner} onChange={(e) => set({ owner: e.target.value })} />
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
            <Input placeholder="Report description…" value={form.description} onChange={(e) => set({ description: e.target.value })} />
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
