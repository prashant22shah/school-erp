import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePortalAccessLog } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PortalAccessLog, PortalKind } from "@/lib/types";

const PORTALS: PortalKind[] = ["student", "parent", "teacher", "admin", "kiosk"];

export function PortalAccessLogFormDialog({ open, onOpenChange, log }: { open: boolean; onOpenChange: (o: boolean) => void; log?: PortalAccessLog }) {
  const save = useSavePortalAccessLog();
  const [form, setForm] = useState<Partial<PortalAccessLog>>({});

  useEffect(() => {
    if (open) {
      setForm(
        log ?? {
          portal: "student",
          userRef: "",
          userName: "",
          action: "",
          ip: "",
          accessedOn: new Date().toISOString().slice(0, 10),
        }
      );
    }
  }, [open, log]);

  const set = (patch: Partial<PortalAccessLog>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.portal || !form.userRef || !form.userName || !form.action || !form.accessedOn) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: log?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: log?.createdOn ?? now,
        updatedOn: now,
        portal: form.portal!,
        userRef: form.userRef!,
        userName: form.userName!,
        action: form.action!,
        ip: form.ip || undefined,
        accessedOn: form.accessedOn!,
      } as PortalAccessLog,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{log ? `Edit access log — ${log.userName}` : "Create access log"}</DialogTitle>
          <DialogDescription>Record portal access events (M11.02 / M11.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Portal</Label>
            <Select value={form.portal} onValueChange={(v) => set({ portal: v as PortalKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PORTALS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Action</Label>
            <Input placeholder="e.g. login, view_report" value={form.action ?? ""} onChange={(e) => set({ action: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>User Ref</Label>
            <Input placeholder="e.g. usr-001" value={form.userRef ?? ""} onChange={(e) => set({ userRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>User Name</Label>
            <Input placeholder="e.g. Anish Karki" value={form.userName ?? ""} onChange={(e) => set({ userName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>IP (optional)</Label>
            <Input placeholder="e.g. 192.168.1.10" value={form.ip ?? ""} onChange={(e) => set({ ip: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Accessed On</Label>
            <Input type="date" value={form.accessedOn ? form.accessedOn.slice(0, 10) : ""} onChange={(e) => set({ accessedOn: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.portal || !form.userRef || !form.userName || !form.action || !form.accessedOn}>
            <Plus className="h-4 w-4" /> {log ? "Save changes" : "Create log"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
