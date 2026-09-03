import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveKioskSession } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { KioskSession, KioskStatus } from "@/lib/types";

const STATUSES: KioskStatus[] = ["active", "ended", "error"];

export function KioskSessionFormDialog({ open, onOpenChange, session }: { open: boolean; onOpenChange: (o: boolean) => void; session?: KioskSession }) {
  const save = useSaveKioskSession();
  const [form, setForm] = useState<Partial<KioskSession>>({});

  useEffect(() => {
    if (open) {
      setForm(
        session ?? {
          kioskId: "",
          location: "",
          startedAt: new Date().toISOString().slice(0, 10),
          endedAt: "",
          status: "active",
        }
      );
    }
  }, [open, session]);

  const set = (patch: Partial<KioskSession>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.kioskId || !form.location || !form.startedAt || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: session?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: session?.createdOn ?? now,
        updatedOn: now,
        kioskId: form.kioskId!,
        location: form.location!,
        startedAt: form.startedAt!,
        endedAt: form.endedAt || undefined,
        status: form.status!,
      } as KioskSession,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{session ? `Edit kiosk session — ${session.kioskId}` : "Create kiosk session"}</DialogTitle>
          <DialogDescription>Track self-service kiosk sessions (M11.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Kiosk ID</Label>
            <Input placeholder="e.g. KIOSK-01" value={form.kioskId ?? ""} onChange={(e) => set({ kioskId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="e.g. Main Entrance" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Started At</Label>
            <Input type="datetime-local" value={form.startedAt ?? ""} onChange={(e) => set({ startedAt: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Ended At (optional)</Label>
            <Input type="datetime-local" value={form.endedAt ?? ""} onChange={(e) => set({ endedAt: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as KioskStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.kioskId || !form.location || !form.startedAt || !form.status}>
            <Plus className="h-4 w-4" /> {session ? "Save changes" : "Create session"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
