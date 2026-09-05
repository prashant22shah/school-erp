import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveMaintenancePlan } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { MaintenancePlan } from "@/lib/types";

const FREQUENCIES = ["weekly", "monthly", "quarterly", "annually"] as const;

export function MaintenancePlanFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: MaintenancePlan }) {
  const save = useSaveMaintenancePlan();
  const [form, setForm] = useState<Partial<MaintenancePlan>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          title: "", description: "",
          assetType: "equipment", assetRef: "", assetName: "",
          frequency: "monthly", nextDueDate: "",
          assignedTo: "", estimatedCost: 0,
          status: "active",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<MaintenancePlan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.frequency || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        title: form.title!,
        description: form.description || "",
        assetType: form.assetType || "equipment",
        assetRef: form.assetRef || "",
        assetName: form.assetName || "",
        frequency: form.frequency!,
        nextDueDate: form.nextDueDate || "",
        lastCompletedDate: editing?.lastCompletedDate || "",
        assignedTo: form.assignedTo || "",
        assignedToName: form.assignedToName || "",
        estimatedCost: form.estimatedCost || 0,
        status: form.status!,
      } as MaintenancePlan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Maintenance Plan" : "Create Maintenance Plan"}</DialogTitle>
          <DialogDescription>Schedule preventive maintenance for campus assets (M22.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Plan name" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location / Asset</Label>
            <Input placeholder="Asset or location name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Cadence</Label>
            <Select value={form.frequency} onValueChange={(v) => set({ frequency: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{FREQUENCIES.map((f) => <SelectItem key={f} value={f} className="capitalize">{f}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Next Due</Label>
            <Input type="date" value={form.nextDueDate ?? ""} onChange={(e) => set({ nextDueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the maintenance plan…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.frequency || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
