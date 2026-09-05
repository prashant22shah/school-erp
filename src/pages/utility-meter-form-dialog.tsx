import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveUtilityMeter } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { UtilityMeter } from "@/lib/types";

const TYPES = ["electricity", "water", "gas", "internet", "telephone", "sewage"] as const;

export function UtilityMeterFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: UtilityMeter }) {
  const save = useSaveUtilityMeter();
  const [form, setForm] = useState<Partial<UtilityMeter>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          meterNo: "", utilityType: "electricity",
          location: "", installedOn: "",
          lastReadingValue: 0, lastReadingDate: "",
          unit: "kWh", provider: "",
          status: "active",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<UtilityMeter>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.meterNo || !form.utilityType || !form.location || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        meterNo: form.meterNo!,
        utilityType: form.utilityType!,
        location: form.location!,
        installedOn: form.installedOn || "",
        lastReadingValue: form.lastReadingValue || 0,
        lastReadingDate: form.lastReadingDate || "",
        unit: form.unit || "",
        provider: form.provider || "",
        status: form.status!,
      } as UtilityMeter,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Utility Meter" : "Add Utility Meter"}</DialogTitle>
          <DialogDescription>Register a campus utility meter (M22.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name / Meter No</Label>
            <Input placeholder="Meter number" value={form.meterNo ?? ""} onChange={(e) => set({ meterNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="Building / Room" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.utilityType} onValueChange={(v) => set({ utilityType: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.meterNo || !form.utilityType || !form.location || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Add Meter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
