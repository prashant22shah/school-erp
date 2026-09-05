import { useMemo, useState } from "react";
import { CalendarCheck, MapPin, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { BookingFormDialog } from "@/pages/booking-form-dialog";
import { useBookings, useBookingAttendees, useDeleteBooking, useDeleteBookingAttendee } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Booking, BookingAttendee } from "@/lib/types";

const bookingStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  pending: "info", confirmed: "success", cancelled: "destructive", completed: "default",
};
const attendeeStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  invited: "default", confirmed: "success", declined: "destructive", attended: "info", no_show: "destructive",
};

export default function RoomBookingPage() {
  const bookingQuery = useBookings();
  const attendeeQuery = useBookingAttendees();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | BookingAttendee | undefined>();

  const filteredBookings = useMemo(() => {
    let list = bookingQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((b) => b.venueName.toLowerCase().includes(s) || b.bookedByName.toLowerCase().includes(s)); }
    return list;
  }, [bookingQuery.data, q]);

  const filteredAttendees = useMemo(() => {
    let list = attendeeQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.attendeeName.toLowerCase().includes(s) || a.bookingTitle.toLowerCase().includes(s)); }
    return list;
  }, [attendeeQuery.data, q]);

  const totalBookings = bookingQuery.data?.length ?? 0;
  const confirmedBookings = (bookingQuery.data ?? []).filter((b) => b.status === "confirmed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarCheck}
        title="Room & Resource Booking"
        titleNe="कोठा तथा स्रोत बुकिङ"
        microModule="M22.03"
        description="Manage room bookings, attendees and resource reservations."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="bookings"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Booking</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Bookings</p><p className="text-lg font-bold">{totalBookings}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><MapPin className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Confirmed</p><p className="text-lg font-bold">{confirmedBookings}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CalendarCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Attendees</p><p className="text-lg font-bold">{attendeeQuery.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><MapPin className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(bookingQuery.data ?? []).filter((b) => b.status === "pending").length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings, attendees…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-4">
          {bookingQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Resource</TableHead><TableHead>Requester</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead>Status</TableHead><TableHead>Purpose</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBookings.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5"><span className="font-medium">{b.venueName}</span></TableCell><TableCell><span className="text-sm">{b.bookedByName || b.bookedBy}</span></TableCell><TableCell><span className="text-sm">{fmtDate(b.startDate)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(b.endDate)}</span></TableCell><TableCell><Badge variant={bookingStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell><span className="text-sm">{b.purpose}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="bookings" onEdit={() => { setEditing(b); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="attendees" className="mt-4">
          {attendeeQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Booking</TableHead><TableHead>Subject</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAttendees.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><span className="font-medium">{a.bookingTitle}</span></TableCell><TableCell><span className="text-sm">{a.attendeeName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.role}</Badge></TableCell><TableCell><Badge variant={attendeeStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="bookingAttendees" onEdit={() => { setEditing(a); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <BookingFormDialog open={open} onOpenChange={setOpen} editing={editing as Booking} />
    </div>
  );
}
