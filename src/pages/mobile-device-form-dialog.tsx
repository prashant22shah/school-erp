import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveMobileDevice } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { MobileDevice, DevicePlatform, DeviceStatus } from "@/lib/types";

const PLATFORMS: DevicePlatform[] = ["android", "ios", "web"];
const STATUSES: DeviceStatus[] = ["active", "blocked", "expired"];

export function MobileDeviceFormDialog({ open, onOpenChange, device }: { open: boolean; onOpenChange: (o: boolean) => void; device?: MobileDevice }) {
  const save = useSaveMobileDevice();
  const [form, setForm] = useState<Partial<MobileDevice>>({});

  useEffect(() => {
    if (open) {
      setForm(
        device ?? {
          userRef: "",
          userName: "",
          deviceName: "",
          platform: "android",
          lastSyncOn: "",
          status: "active",
        }
      );
    }
  }, [open, device]);

  const set = (patch: Partial<MobileDevice>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.userRef || !form.userName || !form.deviceName || !form.platform || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: device?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: device?.createdOn ?? now,
        updatedOn: now,
        userRef: form.userRef!,
        userName: form.userName!,
        deviceName: form.deviceName!,
        platform: form.platform!,
        lastSyncOn: form.lastSyncOn || undefined,
        status: form.status!,
      } as MobileDevice,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{device ? `Edit device — ${device.deviceName}` : "Create mobile device"}</DialogTitle>
          <DialogDescription>Register mobile / web device (M11.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>User Ref</Label>
            <Input placeholder="e.g. usr-012" value={form.userRef ?? ""} onChange={(e) => set({ userRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>User Name</Label>
            <Input placeholder="e.g. Sunita Gurung" value={form.userName ?? ""} onChange={(e) => set({ userName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Device Name</Label>
            <Input placeholder="e.g. Sunita's iPhone" value={form.deviceName ?? ""} onChange={(e) => set({ deviceName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <Select value={form.platform} onValueChange={(v) => set({ platform: v as DevicePlatform })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PLATFORMS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Last Sync On (optional)</Label>
            <Input type="date" value={form.lastSyncOn ? form.lastSyncOn.slice(0, 10) : ""} onChange={(e) => set({ lastSyncOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as DeviceStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userRef || !form.userName || !form.deviceName || !form.platform || !form.status}>
            <Plus className="h-4 w-4" /> {device ? "Save changes" : "Create device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
