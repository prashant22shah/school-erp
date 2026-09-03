import { useMemo, useState } from "react";
import { MessageSquare, Calendar, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PtmEventFormDialog } from "@/pages/ptm-event-form-dialog";
import { usePtmEvents, usePtmBookings, useDeletePtmEvent, useDeletePtmBooking } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { PTMEvent, PTMBooking } from "@/lib/types";

const ptmStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  planned: "secondary", open: "info", ongoing: "warning", completed: "success",
};
const bookingStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  booked: "info", confirmed: "success", completed: "success", cancelled: "secondary", no_show: "warning",
};

export default function ParentTeacherMeetingsPage() {
  const ptmEvents = usePtmEvents();
  const bookings = usePtmBookings();
  const deletePtm = useDeletePtmEvent();
  const deleteBooking = useDeletePtmBooking();
  const [q, setQ] = useState("");
  const [ptmOpen, setPtmOpen] = useState(false);
  const [editingPtm, setEditingPtm] = useState<PTMEvent | undefined>();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<PTMBooking | undefined>();

  const filteredEvents = useMemo(() => {
    let list = ptmEvents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.name.toLowerCase().includes(s) || e.venue.toLowerCase().includes(s) || e.status.toLowerCase().includes(s)); }
    return list;
  }, [ptmEvents.data, q]);

  const filteredBookings = useMemo(() => {
    let list = bookings.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((b) => b.parentName.toLowerCase().includes(s) || b.teacherName.toLowerCase().includes(s) || b.studentName.toLowerCase().includes(s)); }
    return list;
  }, [bookings.data, q]);

  const openEvents = (ptmEvents.data ?? []).filter((e) => e.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={MessageSquare} title="Parent-Teacher Meetings" titleNe="अभिभावक शिक्षक भेटघाट" microModule="M20.05" description="Schedule and manage parent-teacher meeting events and bookings." actions={<div className="flex gap-2"><CanCreate resource="ptmEvents"><Button variant="outline" onClick={() => { setEditingPtm(undefined); setPtmOpen(true); }}><Plus className="h-4 w-4" /> New PTM Event</Button></CanCreate><CanCreate resource="ptmBookings"><Button onClick={() => { setEditingBooking(undefined); setBookingOpen(true); }}><Plus className="h-4 w-4" /> New Booking</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><MessageSquare className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">PTM Events</p><p className="text-lg font-bold">{ptmEvents.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Calendar className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open</p><p className="text-lg font-bold">{openEvents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Calendar className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Bookings</p><p className="text-lg font-bold">{bookings.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search PTM events or bookings…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="events">
        <TabsList><TabsTrigger value="events">PTM Events</TabsTrigger><TabsTrigger value="bookings">Bookings</TabsTrigger></TabsList>
        <TabsContent value="events" className="mt-4">
          {ptmEvents.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Venue</TableHead><TableHead>Dates</TableHead><TableHead>Slots</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredEvents.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5 font-medium">{e.name}</TableCell><TableCell><span className="text-sm">{e.venue}</span></TableCell><TableCell><span className="text-sm font-mono">{e.startDate} → {e.endDate}</span></TableCell><TableCell><span className="text-sm">{e.bookedSlots}/{e.totalSlots}</span></TableCell><TableCell><Badge variant={ptmStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="ptmEvents" onEdit={() => { setEditingPtm(e); setPtmOpen(true); }} onDelete={() => deletePtm.mutate(e)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="bookings" className="mt-4">
          {bookings.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Parent</TableHead><TableHead>Student</TableHead><TableHead>Teacher</TableHead><TableHead>Slot</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBookings.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5 font-medium">{b.parentName}</TableCell><TableCell><span className="text-sm">{b.studentName}</span></TableCell><TableCell><span className="text-sm">{b.teacherName}</span></TableCell><TableCell><span className="text-sm font-mono">{b.slotTime}</span></TableCell><TableCell><Badge variant={bookingStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="ptmBookings" onEdit={() => { setEditingBooking(b); setBookingOpen(true); }} onDelete={() => deleteBooking.mutate(b)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <PtmEventFormDialog open={ptmOpen} onOpenChange={setPtmOpen} ptm={editingPtm} />
      <PtmEventFormDialog open={bookingOpen} onOpenChange={setBookingOpen} booking={editingBooking} />
    </div>
  );
}
