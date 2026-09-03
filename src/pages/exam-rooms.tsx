import { useMemo, useState } from "react";
import { Building2, Search, Plus, Pencil, Trash2, MapPin } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ExamRoomFormDialog } from "@/pages/exam-room-form-dialog";
import { SeatAllocationFormDialog } from "@/pages/seat-allocation-form-dialog";
import { InvigilationDutyFormDialog } from "@/pages/invigilation-duty-form-dialog";
import { useExamRooms, useSeatAllocations, useInvigilationDuties, useDeleteExamRoom, useDeleteSeatAllocation, useDeleteInvigilationDuty } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { ExamRoom, SeatAllocation, InvigilationDuty } from "@/lib/types";

export default function ExamRoomsPage() {
  const rooms = useExamRooms();
  const allocations = useSeatAllocations();
  const duties = useInvigilationDuties();
  const deleteRoom = useDeleteExamRoom();
  const deleteAllocation = useDeleteSeatAllocation();
  const deleteDuty = useDeleteInvigilationDuty();
  const [q, setQ] = useState("");
  const [roomOpen, setRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<ExamRoom | undefined>();
  const [allocOpen, setAllocOpen] = useState(false);
  const [editingAlloc, setEditingAlloc] = useState<SeatAllocation | undefined>();
  const [dutyOpen, setDutyOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState<InvigilationDuty | undefined>();

  const filteredRooms = useMemo(() => {
    let list = rooms.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => (r.locationName ?? "").toLowerCase().includes(s) || (r.examName ?? "").toLowerCase().includes(s) || r.locationRef.toLowerCase().includes(s)); }
    return list;
  }, [rooms.data, q]);

  const filteredAllocs = useMemo(() => {
    let list = allocations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.seatNo.toLowerCase().includes(s) || (a.roomName ?? "").toLowerCase().includes(s)); }
    return list;
  }, [allocations.data, q]);

  const filteredDuties = useMemo(() => {
    let list = duties.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.staffName.toLowerCase().includes(s) || d.role.toLowerCase().includes(s) || (d.roomName ?? "").toLowerCase().includes(s)); }
    return list;
  }, [duties.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Building2} title="Exam Venues & Seating" titleNe="परीक्षा स्थल" microModule="M08.04" description="Exam rooms, seat allocations and invigilation duties." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingRoom(undefined); setRoomOpen(true); }}><Plus className="h-4 w-4" /> New Room</Button><Button variant="outline" onClick={() => { setEditingAlloc(undefined); setAllocOpen(true); }}><Plus className="h-4 w-4" /> Allocate Seat</Button><Button onClick={() => { setEditingDuty(undefined); setDutyOpen(true); }}><Plus className="h-4 w-4" /> Assign Duty</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Exam Rooms</p><p className="text-lg font-bold">{rooms.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><MapPin className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Seat Allocations</p><p className="text-lg font-bold">{allocations.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Invigilation Duties</p><p className="text-lg font-bold">{duties.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search rooms, seats or duties…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="rooms">
        <TabsList><TabsTrigger value="rooms">Exam Rooms</TabsTrigger><TabsTrigger value="allocations">Seat Allocations</TabsTrigger><TabsTrigger value="duties">Invigilation Duties</TabsTrigger></TabsList>

        <TabsContent value="rooms" className="mt-4">
          {rooms.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Exam</TableHead><TableHead>Location</TableHead><TableHead>Capacity</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRooms.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{r.examName ?? r.examId}</Badge></TableCell><TableCell className="font-medium">{r.locationName ?? r.locationRef}</TableCell><TableCell><span className="text-sm font-mono">{r.capacity}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingRoom(r); setRoomOpen(true); }}><Pencil /> Edit room</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRoom.mutate(r)}><Trash2 /> Delete room</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="allocations" className="mt-4">
          {allocations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Room</TableHead><TableHead>Seat No</TableHead><TableHead>Exam</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAllocs.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.studentName}</TableCell><TableCell><Badge variant="secondary">{a.roomName ?? a.roomId}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.seatNo}</code></TableCell><TableCell><span className="text-sm text-muted-foreground">{a.examId}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingAlloc(a); setAllocOpen(true); }}><Pencil /> Edit allocation</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAllocation.mutate(a)}><Trash2 /> Delete allocation</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="duties" className="mt-4">
          {duties.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Room</TableHead><TableHead>Role</TableHead><TableHead>Exam</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDuties.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5 font-medium">{d.staffName}</TableCell><TableCell><Badge variant="secondary">{d.roomName ?? d.roomId}</Badge></TableCell><TableCell><Badge variant={d.role==="chief"?"default":d.role==="assistant"?"secondary":"info"} className="capitalize">{d.role}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{d.examId}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingDuty(d); setDutyOpen(true); }}><Pencil /> Edit duty</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteDuty.mutate(d)}><Trash2 /> Delete duty</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ExamRoomFormDialog open={roomOpen} onOpenChange={setRoomOpen} room={editingRoom} />
      <SeatAllocationFormDialog open={allocOpen} onOpenChange={setAllocOpen} allocation={editingAlloc} />
      <InvigilationDutyFormDialog open={dutyOpen} onOpenChange={setDutyOpen} duty={editingDuty} />
    </div>
  );
}
