import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveBooking } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Booking } from "@/lib/types";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

export function BookingFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: Booking }) {
  const save = useSaveBooking();
  const [form, setForm] = useState<Partial<Booking>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          venueName: "", venueRef: "",
          bookedBy: "", purpose: "",
          startDate: "", endDate: "",
          startTime: "", endTime: "",
          expectedAttendees: 0, actualAttendees: 0,
          setupRequired: "",
          status: "pending",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<Booking>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.venueName || !form.startDate || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        venueName: form.venueName!,
        venueRef: form.venueRef || "",
        bookedBy: form.bookedBy || "",
        bookedByName: form.bookedByName || form.bookedBy || "",
        purpose: form.purpose || "",
        startDate: form.startDate!,
        endDate: form.endDate || form.startDate || "",
        startTime: form.startTime || "",
        endTime: form.endTime || "",
        expectedAttendees: form.expectedAttendees || 0,
        actualAttendees: form.actualAttendees || 0,
        setupRequired: form.setupRequired || "",
        status: form.status!,
      } as Booking,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Booking" : "Create Booking"}</DialogTitle>
          <DialogDescription>Reserve a room or resource for a meeting or event (M22.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Resource</Label>
            <Input placeholder="Room / venue name" value={form.venueName ?? ""} onChange={(e) => set({ venueName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Requester</Label>
            <Input placeholder="Requester name" value={form.bookedBy ?? ""} onChange={(e) => set({ bookedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start</Label>
            <Input type="datetime-local" value={form.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End</Label>
            <Input type="datetime-local" value={form.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Setup Required</Label>
            <Input placeholder="e.g. projector, chairs" value={form.setupRequired ?? ""} onChange={(e) => set({ setupRequired: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Purpose</Label>
            <Textarea placeholder="Purpose of booking…" value={form.purpose ?? ""} onChange={(e) => set({ purpose: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.venueName || !form.startDate || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
