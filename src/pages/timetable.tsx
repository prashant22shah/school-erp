import { useMemo, useState } from "react";
import { CalendarRange, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { TimetableFormDialog } from "@/pages/timetable-form-dialog";
import { TimetableSlotFormDialog } from "@/pages/timetable-slot-form-dialog";
import { TimetableAssignmentFormDialog } from "@/pages/timetable-assignment-form-dialog";
import { useTimetables, useTimetableSlots, useTimetableAssignments, useDeleteTimetable, useDeleteTimetableSlot, useDeleteTimetableAssignment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Timetable, TimetableSlot, TimetableAssignment } from "@/lib/types";

const timetableStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", approved: "info", published: "success", archived: "warning",
};

export default function TimetablePage() {
  const timetables = useTimetables();
  const slots = useTimetableSlots();
  const assignments = useTimetableAssignments();
  const deleteTimetable = useDeleteTimetable();
  const deleteSlot = useDeleteTimetableSlot();
  const deleteAssignment = useDeleteTimetableAssignment();
  const [q, setQ] = useState("");
  const [ttDialogOpen, setTtDialogOpen] = useState(false);
  const [editingTt, setEditingTt] = useState<Timetable | undefined>();
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | undefined>();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingAssign, setEditingAssign] = useState<TimetableAssignment | undefined>();

  const filteredTimetables = useMemo(() => {
    let list = timetables.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.name.toLowerCase().includes(s) || t.status.toLowerCase().includes(s)); }
    return list;
  }, [timetables.data, q]);

  const filteredSlots = useMemo(() => {
    let list = slots.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sl) => sl.dayPattern.toLowerCase().includes(s) || sl.startTime.includes(s)); }
    return list;
  }, [slots.data, q]);

  const filteredAssignments = useMemo(() => {
    let list = assignments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.sectionName.toLowerCase().includes(s) || a.offeringName.toLowerCase().includes(s) || a.staffName.toLowerCase().includes(s)); }
    return list;
  }, [assignments.data, q]);

  const published = (timetables.data ?? []).filter((t) => t.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarRange}
        title="Timetable Planning"
        titleNe="समय तालिका योजना"
        microModule="M07.01"
        description="Versioned timetables, slots and assignments with conflict handling."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingTt(undefined); setTtDialogOpen(true); }}><Plus className="h-4 w-4" /> New Timetable</Button>
            <Button variant="outline" onClick={() => { setEditingSlot(undefined); setSlotDialogOpen(true); }}><Plus className="h-4 w-4" /> New Slot</Button>
            <Button onClick={() => { setEditingAssign(undefined); setAssignDialogOpen(true); }}><Plus className="h-4 w-4" /> New Assignment</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarRange className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Timetables</p><p className="text-lg font-bold">{timetables.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarRange className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{published}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CalendarRange className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Assignments</p><p className="text-lg font-bold">{assignments.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search timetables, slots, assignments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="timetables">
        <TabsList><TabsTrigger value="timetables">Timetables</TabsTrigger><TabsTrigger value="slots">Slots</TabsTrigger><TabsTrigger value="assignments">Assignments</TabsTrigger></TabsList>

        <TabsContent value="timetables" className="mt-4">
          {timetables.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Campus</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTimetables.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5 font-medium">{t.name}</TableCell><TableCell><Badge variant="secondary">{t.campusName ?? t.campusId}</Badge></TableCell><TableCell><span className="text-sm font-mono">v{t.version}</span></TableCell><TableCell><Badge variant={timetableStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingTt(t); setTtDialogOpen(true); }}><Pencil /> Edit timetable</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteTimetable.mutate(t)}><Trash2 /> Delete timetable</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="slots" className="mt-4">
          {slots.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Day</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead>Timetable</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSlots.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{s.dayPattern}</Badge></TableCell><TableCell><span className="text-sm font-mono">{s.startTime}</span></TableCell><TableCell><span className="text-sm font-mono">{s.endTime}</span></TableCell><TableCell><span className="text-sm text-muted-foreground">{s.timetableName ?? s.timetableId}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingSlot(s); setSlotDialogOpen(true); }}><Pencil /> Edit slot</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteSlot.mutate(s)}><Trash2 /> Delete slot</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          {assignments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Section</TableHead><TableHead>Offering</TableHead><TableHead>Slot</TableHead><TableHead>Staff</TableHead><TableHead>Location</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAssignments.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{a.sectionName}</Badge></TableCell><TableCell><Badge variant="secondary">{a.offeringName}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.slotLabel ?? a.slotId}</span></TableCell><TableCell><span className="text-sm">{a.staffName}</span></TableCell><TableCell><span className="text-sm text-muted-foreground">{a.locationName ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingAssign(a); setAssignDialogOpen(true); }}><Pencil /> Edit assignment</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAssignment.mutate(a)}><Trash2 /> Delete assignment</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <TimetableFormDialog open={ttDialogOpen} onOpenChange={setTtDialogOpen} timetable={editingTt} />
      <TimetableSlotFormDialog open={slotDialogOpen} onOpenChange={setSlotDialogOpen} slot={editingSlot} />
      <TimetableAssignmentFormDialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen} assignment={editingAssign} />
    </div>
  );
}
