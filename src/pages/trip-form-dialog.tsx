import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveTrip, useSaveTripParticipant, useTrips } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Trip, TripParticipant } from "@/lib/types";

const TRIP_STATUSES: Trip["status"][] = ["planned", "approved", "ongoing", "completed", "cancelled"];
const CONSENT_STATUSES: TripParticipant["consentStatus"][] = ["pending", "approved", "denied"];
const PAYMENT_STATUSES: TripParticipant["paymentStatus"][] = ["pending", "paid", "waived"];
const PARTICIPANT_STATUSES: TripParticipant["status"][] = ["enrolled", "confirmed", "checked_in", "completed"];

export function TripFormDialog({ open, onOpenChange, trip, participant }: { open: boolean; onOpenChange: (o: boolean) => void; trip?: Trip; participant?: TripParticipant }) {
  const saveTrip = useSaveTrip();
  const saveParticipant = useSaveTripParticipant();
  const trips = useTrips();
  const [tripForm, setTripForm] = useState<Partial<Trip>>({});
  const [participantForm, setParticipantForm] = useState<Partial<TripParticipant>>({});
  const isTrip = !participant;

  useEffect(() => {
    if (open) {
      if (trip) setTripForm(trip);
      else setTripForm({ name: "", destination: "", startDate: "", endDate: "", purpose: "", maxStudents: 0, enrolledStudents: 0, cost: 0, status: "planned" });
      if (participant) setParticipantForm(participant);
      else setParticipantForm({ tripRef: "", studentName: "", studentRef: "", consentStatus: "pending", paymentStatus: "pending", status: "enrolled" });
    }
  }, [open, trip, participant]);

  const setTrip = (patch: Partial<Trip>) => setTripForm((f) => ({ ...f, ...patch }));
  const setParticipant = (patch: Partial<TripParticipant>) => setParticipantForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (isTrip) {
      if (!tripForm.name || !tripForm.destination || !tripForm.startDate) return;
      saveTrip.mutate({ ...(trip ?? { id: uid(), createdOn: now }), ...tripForm } as Trip, { onSuccess: () => onOpenChange(false) });
    } else {
      if (!participantForm.studentName || !participantForm.tripRef) return;
      saveParticipant.mutate({ ...(participant ?? { id: uid(), createdOn: now }), ...participantForm } as TripParticipant, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isTrip ? (trip ? `Edit trip — ${trip.name}` : "Create trip") : (participant ? `Edit participant — ${participant.studentName}` : "Add participant")}</DialogTitle>
          <DialogDescription>{isTrip ? "Manage a school trip or excursion (M20.04)." : "Add a participant to a trip (M20.04)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isTrip ? (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. Historical Tour" value={tripForm.name ?? ""} onChange={(e) => setTrip({ name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Destination</Label><Input placeholder="e.g. Bhaktapur" value={tripForm.destination ?? ""} onChange={(e) => setTrip({ destination: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={tripForm.status} onValueChange={(v) => setTrip({ status: v as Trip["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TRIP_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={tripForm.startDate ?? ""} onChange={(e) => setTrip({ startDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={tripForm.endDate ?? ""} onChange={(e) => setTrip({ endDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Max Students</Label><Input type="number" value={tripForm.maxStudents ?? 0} onChange={(e) => setTrip({ maxStudents: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Cost (₹)</Label><Input type="number" value={tripForm.cost ?? 0} onChange={(e) => setTrip({ cost: Number(e.target.value) })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Purpose</Label><Input placeholder="Trip purpose" value={tripForm.purpose ?? ""} onChange={(e) => setTrip({ purpose: e.target.value })} /></div>
            </>
          ) : (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Student Name</Label><Input placeholder="e.g. Ram Shrestha" value={participantForm.studentName ?? ""} onChange={(e) => setParticipant({ studentName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Trip</Label><Select value={participantForm.tripRef} onValueChange={(v) => setParticipant({ tripRef: v })}><SelectTrigger><SelectValue placeholder="Select trip" /></SelectTrigger><SelectContent>{(trips.data ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Consent</Label><Select value={participantForm.consentStatus} onValueChange={(v) => setParticipant({ consentStatus: v as TripParticipant["consentStatus"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CONSENT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Payment</Label><Select value={participantForm.paymentStatus} onValueChange={(v) => setParticipant({ paymentStatus: v as TripParticipant["paymentStatus"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PAYMENT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={participantForm.status} onValueChange={(v) => setParticipant({ status: v as TripParticipant["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PARTICIPANT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(isTrip ? saveTrip : saveParticipant).isPending}>
            <Plus className="h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
