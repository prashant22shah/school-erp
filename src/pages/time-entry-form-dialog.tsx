import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTimeEntry } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { TimeEntry, TimeSource, TimeEntryStatus } from "@/lib/types";

const SOURCES: TimeSource[] = ["manual", "qr", "rfid", "biometric", "device"];
const STATUSES: TimeEntryStatus[] = ["pending", "approved", "rejected"];

export function TimeEntryFormDialog({ open, onOpenChange, entry }: { open: boolean; onOpenChange: (o: boolean) => void; entry?: TimeEntry }) {
  const save = useSaveTimeEntry();
  const [form, setForm] = useState<Partial<TimeEntry>>({});

  useEffect(() => {
    if (open) setForm(entry ?? { staffRef: "", staffName: "", occurredAt: "", source: "manual", status: "pending" });
  }, [open, entry]);

  const set = (patch: Partial<TimeEntry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.staffName || !form.occurredAt || !form.source) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(entry ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        updatedOn: now,
      } as TimeEntry,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry ? `Edit time entry — ${entry.staffName}` : "Create time entry"}</DialogTitle>
          <DialogDescription>Clock/device/manual time fact with source (M07.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff Ref</Label>
            <Select value={form.staffRef} onValueChange={(v) => {
              const names: Record<string,string> = { "uid-5": "Manoj Rai", "uid-2": "Ramesh Shrestha", "uid-4": "Suresh Thapa" };
              set({ staffRef: v, staffName: names[v] ?? v });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uid-5">Manoj Rai</SelectItem>
                <SelectItem value="uid-2">Ramesh Shrestha</SelectItem>
                <SelectItem value="uid-4">Suresh Thapa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Staff Name</Label>
            <Input placeholder="Staff name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Occurred At</Label>
            <Input type="datetime-local" value={form.occurredAt ?? ""} onChange={(e) => set({ occurredAt: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Source</Label>
            <Select value={form.source} onValueChange={(v) => set({ source: v as TimeSource })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as TimeEntryStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.staffName || !form.occurredAt || !form.source}>
            <Plus className="h-4 w-4" /> {entry ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
