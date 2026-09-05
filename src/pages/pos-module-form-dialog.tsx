import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePOSModule } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { POSModule, POSTerminalType } from "@/lib/types";

const TERMINAL_TYPES: POSTerminalType[] = ["canteen", "stationery", "printing", "vending"];
const STATUSES: POSModule["status"][] = ["active", "inactive", "maintenance"];

export function POSModuleFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: POSModule }) {
  const save = useSavePOSModule();
  const [form, setForm] = useState<Partial<POSModule>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { terminalCode: "", location: "", type: "canteen", vendor: "", status: "active", lastSyncDate: todayISO(), createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<POSModule>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.terminalCode || !form.location || !form.vendor) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as POSModule,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit POS terminal — ${editing.terminalCode}` : "Create POS terminal"}</DialogTitle>
          <DialogDescription>Configure a campus point-of-sale terminal (M18.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Terminal code</Label>
            <Input placeholder="e.g. POS-CAN-01" value={form.terminalCode ?? ""} onChange={(e) => set({ terminalCode: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="e.g. Main Canteen" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as POSTerminalType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TERMINAL_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <Input placeholder="Vendor name" value={form.vendor ?? ""} onChange={(e) => set({ vendor: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as POSModule["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Last sync date</Label>
            <Input type="date" value={form.lastSyncDate ?? ""} onChange={(e) => set({ lastSyncDate: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.terminalCode || !form.location || !form.vendor}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create terminal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
