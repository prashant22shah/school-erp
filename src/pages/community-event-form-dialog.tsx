import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCommunityEvent, useSaveEventRegistration, useCommunityEvents } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CommunityEvent, EventRegistration } from "@/lib/types";

const EVENT_TYPES: CommunityEvent["type"][] = ["academic", "cultural", "sports", "social", "community", "fundraiser"];
const EVENT_STATUSES: CommunityEvent["status"][] = ["planned", "open", "full", "ongoing", "completed", "cancelled"];
const REG_STATUSES: EventRegistration["status"][] = ["registered", "confirmed", "waitlisted", "cancelled"];

export function CommunityEventFormDialog({ open, onOpenChange, event, registration }: { open: boolean; onOpenChange: (o: boolean) => void; event?: CommunityEvent; registration?: EventRegistration }) {
  const saveEvent = useSaveCommunityEvent();
  const saveReg = useSaveEventRegistration();
  const events = useCommunityEvents();
  const [eventForm, setEventForm] = useState<Partial<CommunityEvent>>({});
  const [regForm, setRegForm] = useState<Partial<EventRegistration>>({});
  const isEvent = !registration;

  useEffect(() => {
    if (open) {
      if (event) setEventForm(event);
      else setEventForm({ name: "", type: "academic", startDate: "", endDate: "", venue: "", capacity: 0, registered: 0, description: "", status: "planned" });
      if (registration) setRegForm(registration);
      else setRegForm({ eventRef: "", participantName: "", participantRef: "", registeredDate: "", status: "registered" });
    }
  }, [open, event, registration]);

  const setEvent = (patch: Partial<CommunityEvent>) => setEventForm((f) => ({ ...f, ...patch }));
  const setReg = (patch: Partial<EventRegistration>) => setRegForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (isEvent) {
      if (!eventForm.name || !eventForm.type || !eventForm.startDate || !eventForm.endDate) return;
      saveEvent.mutate(
        { ...(event ?? { id: uid(), createdOn: now }), ...eventForm } as CommunityEvent,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      if (!regForm.participantName || !regForm.eventRef) return;
      saveReg.mutate(
        { ...(registration ?? { id: uid(), createdOn: now }), ...regForm } as EventRegistration,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEvent ? (event ? `Edit event — ${event.name}` : "Create event") : (registration ? `Edit registration — ${registration.participantName}` : "Create registration")}</DialogTitle>
          <DialogDescription>{isEvent ? "Manage a community event (M20.01)." : "Register a participant for an event (M20.01)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isEvent ? (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Name</Label>
                <Input placeholder="e.g. Annual Day" value={eventForm.name ?? ""} onChange={(e) => setEvent({ name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={eventForm.type} onValueChange={(v) => setEvent({ type: v as CommunityEvent["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EVENT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={eventForm.status} onValueChange={(v) => setEvent({ status: v as CommunityEvent["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{EVENT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Venue</Label>
                <Input placeholder="e.g. School Hall" value={eventForm.venue ?? ""} onChange={(e) => setEvent({ venue: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Capacity</Label>
                <Input type="number" value={eventForm.capacity ?? 0} onChange={(e) => setEvent({ capacity: Number(e.target.value) })} />
              </div>
              <div className="space-y-1.5">
                <Label>Start Date</Label>
                <Input type="date" value={eventForm.startDate ?? ""} onChange={(e) => setEvent({ startDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>End Date</Label>
                <Input type="date" value={eventForm.endDate ?? ""} onChange={(e) => setEvent({ endDate: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Input placeholder="Event description" value={eventForm.description ?? ""} onChange={(e) => setEvent({ description: e.target.value })} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Participant Name</Label>
                <Input placeholder="e.g. Ram Shrestha" value={regForm.participantName ?? ""} onChange={(e) => setReg({ participantName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Event</Label>
                <Select value={regForm.eventRef} onValueChange={(v) => setReg({ eventRef: v })}>
                  <SelectTrigger><SelectValue placeholder="Select event" /></SelectTrigger>
                  <SelectContent>{(events.data ?? []).map((ev) => <SelectItem key={ev.id} value={ev.id}>{ev.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={regForm.status} onValueChange={(v) => setReg({ status: v as EventRegistration["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{REG_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Registered Date</Label>
                <Input type="date" value={regForm.registeredDate ?? ""} onChange={(e) => setReg({ registeredDate: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Participant Ref</Label>
                <Input placeholder="e.g. STU-001" value={regForm.participantRef ?? ""} onChange={(e) => setReg({ participantRef: e.target.value })} />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(isEvent ? saveEvent : saveReg).isPending}>
            <Plus className="h-4 w-4" /> {isEvent ? (event ? "Save changes" : "Create event") : (registration ? "Save changes" : "Create registration")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
