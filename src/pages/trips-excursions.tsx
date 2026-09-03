import { useMemo, useState } from "react";
import { Map, Navigation, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { TripFormDialog } from "@/pages/trip-form-dialog";
import { useTrips, useTripParticipants, useDeleteTrip, useDeleteTripParticipant } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { Trip, TripParticipant } from "@/lib/types";

const tripStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  planned: "secondary", approved: "info", ongoing: "warning", completed: "success", cancelled: "secondary",
};
const participantStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  enrolled: "info", confirmed: "success", checked_in: "warning", completed: "success",
};

export default function TripsExcursionsPage() {
  const trips = useTrips();
  const participants = useTripParticipants();
  const deleteTrip = useDeleteTrip();
  const deleteParticipant = useDeleteTripParticipant();
  const [q, setQ] = useState("");
  const [tripOpen, setTripOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();
  const [participantOpen, setParticipantOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<TripParticipant | undefined>();

  const filteredTrips = useMemo(() => {
    let list = trips.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.name.toLowerCase().includes(s) || t.destination.toLowerCase().includes(s) || t.status.toLowerCase().includes(s)); }
    return list;
  }, [trips.data, q]);

  const filteredParticipants = useMemo(() => {
    let list = participants.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [participants.data, q]);

  const completedTrips = (trips.data ?? []).filter((t) => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Map} title="Trips & Excursions" titleNe="भ्रमण" microModule="M20.04" description="School trips, excursions and participant management." actions={<div className="flex gap-2"><CanCreate resource="trips"><Button variant="outline" onClick={() => { setEditingTrip(undefined); setTripOpen(true); }}><Plus className="h-4 w-4" /> New Trip</Button></CanCreate><CanCreate resource="tripParticipants"><Button onClick={() => { setEditingParticipant(undefined); setParticipantOpen(true); }}><Plus className="h-4 w-4" /> Add Participant</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Map className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Trips</p><p className="text-lg font-bold">{trips.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Navigation className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedTrips}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Navigation className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Participants</p><p className="text-lg font-bold">{participants.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search trips…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="trips">
        <TabsList><TabsTrigger value="trips">Trips</TabsTrigger><TabsTrigger value="participants">Participants</TabsTrigger></TabsList>
        <TabsContent value="trips" className="mt-4">
          {trips.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Destination</TableHead><TableHead>Dates</TableHead><TableHead>Students</TableHead><TableHead>Cost</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTrips.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5 font-medium">{t.name}</TableCell><TableCell><span className="text-sm">{t.destination}</span></TableCell><TableCell><span className="text-sm font-mono">{t.startDate} → {t.endDate}</span></TableCell><TableCell><span className="text-sm">{t.enrolledStudents}/{t.maxStudents}</span></TableCell><TableCell><span className="text-sm font-mono">₹{t.cost.toLocaleString()}</span></TableCell><TableCell><Badge variant={tripStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="trips" onEdit={() => { setEditingTrip(t); setTripOpen(true); }} onDelete={() => deleteTrip.mutate(t)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="participants" className="mt-4">
          {participants.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Trip</TableHead><TableHead>Consent</TableHead><TableHead>Payment</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredParticipants.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.studentName}</TableCell><TableCell><Badge variant="secondary">{p.tripRef}</Badge></TableCell><TableCell><span className="text-sm capitalize">{p.consentStatus}</span></TableCell><TableCell><Badge variant={p.paymentStatus === "paid" ? "success" : "warning"} className="capitalize">{p.paymentStatus}</Badge></TableCell><TableCell><Badge variant={participantStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="tripParticipants" onEdit={() => { setEditingParticipant(p); setParticipantOpen(true); }} onDelete={() => deleteParticipant.mutate(p)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <TripFormDialog open={tripOpen} onOpenChange={setTripOpen} trip={editingTrip} />
      <TripFormDialog open={participantOpen} onOpenChange={setParticipantOpen} participant={editingParticipant} />
    </div>
  );
}
