import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveAssetMaintenance } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { AssetMaintenance } from "@/lib/types";

const MAINT_TYPES = ["preventive", "corrective", "upgrade"] as const;
const STATUSES = ["scheduled", "in_progress", "completed", "cancelled"] as const;

export function AssetMaintenanceFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: AssetMaintenance }) {
  const save = useSaveAssetMaintenance();
  const [form, setForm] = useState<Partial<AssetMaintenance>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { assetName: "", maintenanceType: "preventive", scheduledDate: todayISO(), completedDate: "", cost: 0, vendor: "", description: "", status: "scheduled", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<AssetMaintenance>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assetName || !form.scheduledDate) return;
    save.mutate({ ...(editing ?? { id: uid(), assetRef: "" }), ...form } as AssetMaintenance, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit maintenance — ${editing.assetName}` : "Create maintenance"}</DialogTitle>
          <DialogDescription>Schedule or record asset maintenance work (M15.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Asset name</Label>
            <Input placeholder="Asset name" value={form.assetName ?? ""} onChange={(e) => set({ assetName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Maintenance type</Label>
            <Select value={form.maintenanceType} onValueChange={(v) => set({ maintenanceType: v as AssetMaintenance["maintenanceType"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MAINT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled date</Label>
            <Input type="date" value={form.scheduledDate ?? ""} onChange={(e) => set({ scheduledDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Completed date</Label>
            <Input type="date" value={form.completedDate ?? ""} onChange={(e) => set({ completedDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.cost ?? ""} onChange={(e) => set({ cost: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <Input placeholder="Vendor / service provider" value={form.vendor ?? ""} onChange={(e) => set({ vendor: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AssetMaintenance["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Maintenance description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assetName || !form.scheduledDate}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create maintenance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
