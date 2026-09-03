import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveOfflineSyncLog } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { OfflineSyncLog, SyncStatus } from "@/lib/types";

const STATUSES: SyncStatus[] = ["pending", "synced", "failed"];

export function OfflineSyncLogFormDialog({ open, onOpenChange, log }: { open: boolean; onOpenChange: (o: boolean) => void; log?: OfflineSyncLog }) {
  const save = useSaveOfflineSyncLog();
  const [form, setForm] = useState<Partial<OfflineSyncLog>>({});

  useEffect(() => {
    if (open) {
      setForm(
        log ?? {
          deviceId: "",
          deviceName: "",
          entityType: "",
          recordsSynced: 0,
          status: "pending",
          syncedOn: "",
        }
      );
    }
  }, [open, log]);

  const set = (patch: Partial<OfflineSyncLog>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.deviceId || !form.entityType || form.recordsSynced == null || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: log?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: log?.createdOn ?? now,
        updatedOn: now,
        deviceId: form.deviceId!,
        deviceName: form.deviceName || undefined,
        entityType: form.entityType!,
        recordsSynced: Number(form.recordsSynced),
        status: form.status!,
        syncedOn: form.syncedOn || undefined,
      } as OfflineSyncLog,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{log ? `Edit sync log — ${log.entityType}` : "Create sync log"}</DialogTitle>
          <DialogDescription>Track offline synchronization (M11.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Device ID</Label>
            <Input placeholder="e.g. dev-001" value={form.deviceId ?? ""} onChange={(e) => set({ deviceId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Device Name (optional)</Label>
            <Input placeholder="e.g. Sunita's iPhone" value={form.deviceName ?? ""} onChange={(e) => set({ deviceName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Entity Type</Label>
            <Input placeholder="e.g. attendance, marks" value={form.entityType ?? ""} onChange={(e) => set({ entityType: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Records Synced</Label>
            <Input type="number" min={0} value={form.recordsSynced ?? 0} onChange={(e) => set({ recordsSynced: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SyncStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Synced On (optional)</Label>
            <Input type="date" value={form.syncedOn ? form.syncedOn.slice(0, 10) : ""} onChange={(e) => set({ syncedOn: e.target.value || undefined })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.deviceId || !form.entityType || form.recordsSynced == null || !form.status}>
            <Plus className="h-4 w-4" /> {log ? "Save changes" : "Create sync log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
