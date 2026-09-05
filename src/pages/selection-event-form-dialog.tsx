import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSelectionEvent, useApplications } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { SelectionEvent, SelectionEventType } from "@/lib/types";

const EVENT_TYPES: SelectionEventType[] = ["entrance_test", "interview", "both"];
const STATUSES: SelectionEvent["status"][] = ["scheduled", "completed", "cancelled", "rescheduled"];

export function SelectionEventFormDialog({ open, onOpenChange, event }: { open: boolean; onOpenChange: (v: boolean) => void; event?: SelectionEvent }) {
  const save = useSaveSelectionEvent();
  const applications = useApplications();
  const [form, setForm] = useState<Partial<SelectionEvent>>({});

  useEffect(() => {
    if (open) {
      setForm(event ?? { applicationId: "", applicationName: "", type: "entrance_test" as SelectionEventType, scheduledDate: "", scheduledTime: "", venue: "", panelMembers: "", status: "scheduled", createdOn: todayISO() });
    }
  }, [open, event]);

  const set = (patch: Partial<SelectionEvent>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.applicationId || !form.type || !form.scheduledDate) return;
    const appName = (applications.data ?? []).find((a) => a.id === form.applicationId)?.studentName ?? form.applicationName ?? "";
    save.mutate(
      { ...(event ?? { id: uid() }), ...form, applicationName: appName, tenantId: "tenant-default" } as SelectionEvent,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? `Edit selection event` : "Create selection event"}</DialogTitle>
          <DialogDescription>Schedule an entrance test or interview (M04.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Application</Label>
            <Select value={form.applicationId ?? ""} onValueChange={(v) => set({ applicationId: v })}>
              <SelectTrigger><SelectValue placeholder="Select application" /></SelectTrigger>
              <SelectContent>{(applications.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.studentName ?? a.id}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Event type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as SelectionEventType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{EVENT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled date</Label>
            <Input type="date" value={form.scheduledDate ?? ""} onChange={(e) => set({ scheduledDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Scheduled time</Label>
            <Input type="time" value={form.scheduledTime ?? ""} onChange={(e) => set({ scheduledTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Venue</Label>
            <Input placeholder="Venue" value={form.venue ?? ""} onChange={(e) => set({ venue: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SelectionEvent["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Panel members</Label>
            <Input placeholder="Comma-separated names" value={form.panelMembers ?? ""} onChange={(e) => set({ panelMembers: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.applicationId || !form.type || !form.scheduledDate}>
            <Plus className="h-4 w-4" /> {event ? "Save changes" : "Create event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
