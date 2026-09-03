import { useMemo, useState } from "react";
import { Smartphone, RefreshCw, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MobileDeviceFormDialog } from "@/pages/mobile-device-form-dialog";
import { OfflineSyncLogFormDialog } from "@/pages/offline-sync-log-form-dialog";
import { useMobileDevices, useOfflineSyncLogs, useDeleteMobileDevice, useDeleteOfflineSyncLog } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { MobileDevice, OfflineSyncLog } from "@/lib/types";

const platformVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  android: "success",
  ios: "info",
  web: "secondary",
};
const deviceStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  blocked: "warning",
  expired: "secondary",
};
const syncStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  synced: "success",
  failed: "warning",
};

export default function MobileDevicesPage() {
  const devices = useMobileDevices();
  const syncLogs = useOfflineSyncLogs();
  const deleteDevice = useDeleteMobileDevice();
  const deleteSync = useDeleteOfflineSyncLog();
  const [q, setQ] = useState("");
  const [deviceOpen, setDeviceOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<MobileDevice | undefined>();
  const [syncOpen, setSyncOpen] = useState(false);
  const [editingSync, setEditingSync] = useState<OfflineSyncLog | undefined>();

  const filteredDevices = useMemo(() => {
    let list = devices.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((d) => d.deviceName.toLowerCase().includes(s) || d.platform.toLowerCase().includes(s) || d.userName.toLowerCase().includes(s) || d.status.toLowerCase().includes(s));
    }
    return list;
  }, [devices.data, q]);

  const filteredSyncs = useMemo(() => {
    let list = syncLogs.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((l) => (l.deviceName ?? "").toLowerCase().includes(s) || l.deviceId.toLowerCase().includes(s) || l.entityType.toLowerCase().includes(s) || l.status.toLowerCase().includes(s));
    }
    return list;
  }, [syncLogs.data, q]);

  const activeDevices = (devices.data ?? []).filter((d) => d.status === "active").length;
  const synced = (syncLogs.data ?? []).filter((l) => l.status === "synced").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Smartphone} title="Mobile & Sync" titleNe="मोबाइल र सिङ्क" microModule="M11.06" description="Manage mobile devices and offline synchronization logs." actions={<div className="flex gap-2"><CanCreate resource="mobileDevices"><Button variant="outline" onClick={() => { setEditingDevice(undefined); setDeviceOpen(true); }}>New Device</Button></CanCreate><CanCreate resource="mobileDevices"><Button onClick={() => { setEditingSync(undefined); setSyncOpen(true); }}>New Sync Log</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Smartphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Mobile Devices</p><p className="text-lg font-bold">{devices.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Smartphone className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Devices</p><p className="text-lg font-bold">{activeDevices}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><RefreshCw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Offline Sync Logs</p><p className="text-lg font-bold">{syncLogs.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search devices or sync logs…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="devices">
        <TabsList><TabsTrigger value="devices">Mobile Devices</TabsTrigger><TabsTrigger value="syncs">Offline Sync Logs</TabsTrigger></TabsList>

        <TabsContent value="devices" className="mt-4">
          {devices.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Device</TableHead><TableHead>User</TableHead><TableHead>Platform</TableHead><TableHead>Last Sync</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDevices.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5 font-medium">{d.deviceName}</TableCell><TableCell><div className="flex flex-col"><span className="text-sm font-medium">{d.userName}</span><code className="text-xs text-muted-foreground">{d.userRef}</code></div></TableCell><TableCell><Badge variant={platformVariant[d.platform] ?? "secondary"} className="capitalize">{d.platform}</Badge></TableCell><TableCell><span className="text-sm">{d.lastSyncOn ? fmtDate(d.lastSyncOn) : "—"}</span></TableCell><TableCell><Badge variant={deviceStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="mobileDevices" onEdit={() => { setEditingDevice(d); setDeviceOpen(true); }} onDelete={() => deleteDevice.mutate(d)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="syncs" className="mt-4">
          {syncLogs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Device</TableHead><TableHead>Entity Type</TableHead><TableHead>Records</TableHead><TableHead>Status</TableHead><TableHead>Synced On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSyncs.map((l) => (<TableRow key={l.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{l.deviceName ?? l.deviceId}</span><code className="text-xs text-muted-foreground">{l.deviceId}</code></div></TableCell><TableCell><Badge variant="secondary">{l.entityType}</Badge></TableCell><TableCell><span className="text-sm font-mono">{l.recordsSynced}</span></TableCell><TableCell><Badge variant={syncStatusVariant[l.status] ?? "secondary"} className="capitalize">{l.status}</Badge></TableCell><TableCell><span className="text-sm">{l.syncedOn ? fmtDate(l.syncedOn) : "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="mobileDevices" onEdit={() => { setEditingSync(l); setSyncOpen(true); }} onDelete={() => deleteSync.mutate(l)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <MobileDeviceFormDialog open={deviceOpen} onOpenChange={setDeviceOpen} device={editingDevice} />
      <OfflineSyncLogFormDialog open={syncOpen} onOpenChange={setSyncOpen} log={editingSync} />
    </div>
  );
}
