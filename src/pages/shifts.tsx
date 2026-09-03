import { useMemo, useState } from "react";
import { Clock3, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ShiftFormDialog } from "@/pages/shift-form-dialog";
import { StaffRosterFormDialog } from "@/pages/staff-roster-form-dialog";
import { TimeEntryFormDialog } from "@/pages/time-entry-form-dialog";
import { TimeAdjustmentFormDialog } from "@/pages/time-adjustment-form-dialog";
import { useShifts, useStaffRosters, useTimeEntries, useTimeAdjustments, useDeleteShift, useDeleteStaffRoster, useDeleteTimeEntry, useDeleteTimeAdjustment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { Shift, StaffRoster, TimeEntry, TimeAdjustment } from "@/lib/types";

export default function ShiftsPage() {
  const shifts = useShifts();
  const rosters = useStaffRosters();
  const entries = useTimeEntries();
  const adjustments = useTimeAdjustments();
  const deleteShift = useDeleteShift();
  const deleteRoster = useDeleteStaffRoster();
  const deleteEntry = useDeleteTimeEntry();
  const deleteAdj = useDeleteTimeAdjustment();
  const [q, setQ] = useState("");
  const [shiftOpen, setShiftOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | undefined>();
  const [rosterOpen, setRosterOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<StaffRoster | undefined>();
  const [entryOpen, setEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | undefined>();
  const [adjOpen, setAdjOpen] = useState(false);
  const [editingAdj, setEditingAdj] = useState<TimeAdjustment | undefined>();

  const filteredShifts = useMemo(() => {
    let list = shifts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s)); }
    return list;
  }, [shifts.data, q]);
  const filteredRosters = useMemo(() => {
    let list = rosters.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.staffName.toLowerCase().includes(s) || r.localDate.includes(s)); }
    return list;
  }, [rosters.data, q]);
  const filteredEntries = useMemo(() => {
    let list = entries.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.staffName.toLowerCase().includes(s) || e.source.toLowerCase().includes(s)); }
    return list;
  }, [entries.data, q]);
  const filteredAdjs = useMemo(() => {
    let list = adjustments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => (a.reason ?? "").toLowerCase().includes(s) || a.status.toLowerCase().includes(s)); }
    return list;
  }, [adjustments.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Clock3} title="Staff Time & Shifts" titleNe="समय र पालो" microModule="M07.05" description="Shifts, rosters and time capture with adjustments." actions={<div className="flex flex-wrap gap-2"><CanCreate resource="shifts"><Button variant="outline" onClick={() => { setEditingShift(undefined); setShiftOpen(true); }}><Plus className="h-4 w-4" /> New Shift</Button></CanCreate><CanCreate resource="shifts"><Button variant="outline" onClick={() => { setEditingRoster(undefined); setRosterOpen(true); }}><Plus className="h-4 w-4" /> New Roster</Button></CanCreate><CanCreate resource="shifts"><Button variant="outline" onClick={() => { setEditingEntry(undefined); setEntryOpen(true); }}><Plus className="h-4 w-4" /> New Time Entry</Button></CanCreate><CanCreate resource="shifts"><Button onClick={() => { setEditingAdj(undefined); setAdjOpen(true); }}><Plus className="h-4 w-4" /> New Adjustment</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Clock3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Shifts</p><p className="text-lg font-bold">{shifts.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Clock3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Rosters</p><p className="text-lg font-bold">{rosters.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Clock3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Time Entries</p><p className="text-lg font-bold">{entries.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Adjustments</p><p className="text-lg font-bold">{adjustments.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search shifts, rosters, entries…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="shifts">
        <TabsList><TabsTrigger value="shifts">Shifts</TabsTrigger><TabsTrigger value="rosters">Rosters</TabsTrigger><TabsTrigger value="entries">Time Entries</TabsTrigger><TabsTrigger value="adjustments">Adjustments</TabsTrigger></TabsList>

        <TabsContent value="shifts" className="mt-4">
          {shifts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Campus</TableHead><TableHead>Window</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredShifts.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.code}</code></TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell><Badge variant="secondary">{s.campusName ?? s.campusId}</Badge></TableCell><TableCell><span className="text-sm font-mono">{s.startTime}–{s.endTime}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="shifts" onEdit={() => { setEditingShift(s); setShiftOpen(true); }} onDelete={() => deleteShift.mutate(s)} editLabel="Edit shift" deleteLabel="Delete shift" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="rosters" className="mt-4">
          {rosters.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Date</TableHead><TableHead>Shift</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRosters.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.staffName}</TableCell><TableCell><span className="text-sm font-mono">{r.localDate}</span></TableCell><TableCell><Badge variant="secondary">{r.shiftName ?? r.shiftId}</Badge></TableCell><TableCell><Badge variant={r.status==="completed"?"success":r.status==="absent"?"warning":"secondary"} className="capitalize">{r.status.replace("_"," ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="shifts" onEdit={() => { setEditingRoster(r); setRosterOpen(true); }} onDelete={() => deleteRoster.mutate(r)} editLabel="Edit roster" deleteLabel="Delete roster" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="entries" className="mt-4">
          {entries.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Occurred At</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredEntries.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5 font-medium">{e.staffName}</TableCell><TableCell><span className="text-sm font-mono">{e.occurredAt.replace("T"," ")}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{e.source}</Badge></TableCell><TableCell><Badge variant={e.status==="approved"?"success":e.status==="pending"?"warning":"secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="shifts" onEdit={() => { setEditingEntry(e); setEntryOpen(true); }} onDelete={() => deleteEntry.mutate(e)} editLabel="Edit entry" deleteLabel="Delete entry" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="adjustments" className="mt-4">
          {adjustments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Time Entry</TableHead><TableHead>Reason</TableHead><TableHead>Approval</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAdjs.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.timeEntryId.slice(0,8)}</code></TableCell><TableCell><span className="line-clamp-1 text-sm">{a.reason}</span></TableCell><TableCell><span className="text-sm">{a.approval ?? "—"}</span></TableCell><TableCell><Badge variant={a.status==="approved"?"success":a.status==="pending"?"warning":"secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="shifts" onEdit={() => { setEditingAdj(a); setAdjOpen(true); }} onDelete={() => deleteAdj.mutate(a)} editLabel="Edit adjustment" deleteLabel="Delete adjustment" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ShiftFormDialog open={shiftOpen} onOpenChange={setShiftOpen} shift={editingShift} />
      <StaffRosterFormDialog open={rosterOpen} onOpenChange={setRosterOpen} roster={editingRoster} />
      <TimeEntryFormDialog open={entryOpen} onOpenChange={setEntryOpen} entry={editingEntry} />
      <TimeAdjustmentFormDialog open={adjOpen} onOpenChange={setAdjOpen} adjustment={editingAdj} />
    </div>
  );
}
