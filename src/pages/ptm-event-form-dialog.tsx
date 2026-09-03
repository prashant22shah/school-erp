import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePtmEvent, useSavePtmBooking, usePtmEvents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { PTMEvent, PTMBooking } from "@/lib/types";

const PTM_STATUSES: PTMEvent["status"][] = ["planned", "open", "ongoing", "completed"];
const BOOKING_STATUSES: PTMBooking["status"][] = ["booked", "confirmed", "completed", "cancelled", "no_show"];

export function PtmEventFormDialog({ open, onOpenChange, ptm, booking }: { open: boolean; onOpenChange: (o: boolean) => void; ptm?: PTMEvent; booking?: PTMBooking }) {
  const savePtm = useSavePtmEvent();
  const saveBooking = useSavePtmBooking();
  const ptmEvents = usePtmEvents();
  const [ptmForm, setPtmForm] = useState<Partial<PTMEvent>>({});
  const [bookingForm, setBookingForm] = useState<Partial<PTMBooking>>({});
  const isPtm = !booking;

  useEffect(() => {
    if (open) {
      if (ptm) setPtmForm(ptm);
      else setPtmForm({ name: "", startDate: "", endDate: "", venue: "", totalSlots: 0, bookedSlots: 0, status: "planned" });
      if (booking) setBookingForm(booking);
      else setBookingForm({ ptmEventRef: "", parentName: "", studentName: "", teacherName: "", slotTime: "", status: "booked" });
    }
  }, [open, ptm, booking]);

  const setPtm = (patch: Partial<PTMEvent>) => setPtmForm((f) => ({ ...f, ...patch }));
  const setBooking = (patch: Partial<PTMBooking>) => setBookingForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (isPtm) {
      if (!ptmForm.name || !ptmForm.startDate || !ptmForm.endDate) return;
      savePtm.mutate({ ...(ptm ?? { id: uid(), createdOn: now }), ...ptmForm } as PTMEvent, { onSuccess: () => onOpenChange(false) });
    } else {
      if (!bookingForm.parentName || !bookingForm.studentName || !bookingForm.teacherName) return;
      saveBooking.mutate({ ...(booking ?? { id: uid(), createdOn: now }), ...bookingForm } as PTMBooking, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isPtm ? (ptm ? `Edit PTM — ${ptm.name}` : "Create PTM event") : (booking ? `Edit booking — ${booking.parentName}` : "Create booking")}</DialogTitle>
          <DialogDescription>{isPtm ? "Schedule a parent-teacher meeting event (M20.05)." : "Book a parent-teacher meeting slot (M20.05)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isPtm ? (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. Term 1 PTM" value={ptmForm.name ?? ""} onChange={(e) => setPtm({ name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Venue</Label><Input placeholder="e.g. Classrooms" value={ptmForm.venue ?? ""} onChange={(e) => setPtm({ venue: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={ptmForm.status} onValueChange={(v) => setPtm({ status: v as PTMEvent["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PTM_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={ptmForm.startDate ?? ""} onChange={(e) => setPtm({ startDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={ptmForm.endDate ?? ""} onChange={(e) => setPtm({ endDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Total Slots</Label><Input type="number" value={ptmForm.totalSlots ?? 0} onChange={(e) => setPtm({ totalSlots: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Booked Slots</Label><Input type="number" value={ptmForm.bookedSlots ?? 0} onChange={(e) => setPtm({ bookedSlots: Number(e.target.value) })} /></div>
            </>
          ) : (
            <>
              <div className="space-y-1.5"><Label>Parent Name</Label><Input placeholder="e.g. Ram Shrestha" value={bookingForm.parentName ?? ""} onChange={(e) => setBooking({ parentName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Student Name</Label><Input placeholder="e.g. Sita Shrestha" value={bookingForm.studentName ?? ""} onChange={(e) => setBooking({ studentName: e.target.value })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Teacher</Label><Input placeholder="e.g. Mr. Sharma" value={bookingForm.teacherName ?? ""} onChange={(e) => setBooking({ teacherName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>PTM Event</Label><Select value={bookingForm.ptmEventRef} onValueChange={(v) => setBooking({ ptmEventRef: v })}><SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger><SelectContent>{(ptmEvents.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Slot Time</Label><Input placeholder="e.g. 10:00 - 10:15" value={bookingForm.slotTime ?? ""} onChange={(e) => setBooking({ slotTime: e.target.value })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Status</Label><Select value={bookingForm.status} onValueChange={(v) => setBooking({ status: v as PTMBooking["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BOOKING_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(isPtm ? savePtm : saveBooking).isPending}>
            <Plus className="h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
