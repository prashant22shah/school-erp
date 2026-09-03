import { useMemo, useState } from "react";
import { CalendarDays, Users, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CommunityEventFormDialog } from "@/pages/community-event-form-dialog";
import { useCommunityEvents, useEventRegistrations, useDeleteCommunityEvent, useDeleteEventRegistration } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { CommunityEvent, EventRegistration } from "@/lib/types";

const eventStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  planned: "secondary", open: "info", full: "warning", ongoing: "warning", completed: "success", cancelled: "secondary",
};
const regStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  registered: "info", confirmed: "success", waitlisted: "warning", cancelled: "secondary",
};

export default function EventsRegistrationPage() {
  const events = useCommunityEvents();
  const registrations = useEventRegistrations();
  const deleteEvent = useDeleteCommunityEvent();
  const deleteReg = useDeleteEventRegistration();
  const [q, setQ] = useState("");
  const [eventOpen, setEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CommunityEvent | undefined>();
  const [regOpen, setRegOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<EventRegistration | undefined>();

  const filteredEvents = useMemo(() => {
    let list = events.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.name.toLowerCase().includes(s) || e.type.toLowerCase().includes(s) || e.status.toLowerCase().includes(s)); }
    return list;
  }, [events.data, q]);

  const filteredRegs = useMemo(() => {
    let list = registrations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.participantName.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [registrations.data, q]);

  const openEvents = (events.data ?? []).filter((e) => e.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarDays} title="Events & Registration" titleNe="कार्यक्रम" microModule="M20.01" description="School community events and participant registration." actions={<div className="flex gap-2"><CanCreate resource="communityEvents"><Button variant="outline" onClick={() => { setEditingEvent(undefined); setEventOpen(true); }}><Plus className="h-4 w-4" /> New Event</Button></CanCreate><CanCreate resource="eventRegistrations"><Button onClick={() => { setEditingReg(undefined); setRegOpen(true); }}><Plus className="h-4 w-4" /> New Registration</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Events</p><p className="text-lg font-bold">{events.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open</p><p className="text-lg font-bold">{openEvents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Registrations</p><p className="text-lg font-bold">{registrations.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search events or registrations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="events">
        <TabsList><TabsTrigger value="events">Events</TabsTrigger><TabsTrigger value="registrations">Registrations</TabsTrigger></TabsList>
        <TabsContent value="events" className="mt-4">
          {events.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Type</TableHead><TableHead>Venue</TableHead><TableHead>Dates</TableHead><TableHead>Registered</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredEvents.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5 font-medium">{e.name}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{e.type}</Badge></TableCell><TableCell><span className="text-sm">{e.venue}</span></TableCell><TableCell><span className="text-sm font-mono">{e.startDate} → {e.endDate}</span></TableCell><TableCell><span className="text-sm">{e.registered}/{e.capacity}</span></TableCell><TableCell><Badge variant={eventStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="communityEvents" onEdit={() => { setEditingEvent(e); setEventOpen(true); }} onDelete={() => deleteEvent.mutate(e)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="registrations" className="mt-4">
          {registrations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Participant</TableHead><TableHead>Event</TableHead><TableHead>Registered</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRegs.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.participantName}</TableCell><TableCell><Badge variant="secondary">{r.eventRef}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.registeredDate}</span></TableCell><TableCell><Badge variant={regStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="eventRegistrations" onEdit={() => { setEditingReg(r); setRegOpen(true); }} onDelete={() => deleteReg.mutate(r)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <CommunityEventFormDialog open={eventOpen} onOpenChange={setEventOpen} event={editingEvent} />
      <CommunityEventFormDialog open={regOpen} onOpenChange={setRegOpen} registration={editingReg} />
    </div>
  );
}
