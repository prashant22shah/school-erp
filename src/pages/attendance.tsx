import { useMemo, useState } from "react";
import { ClipboardCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AttendanceSessionFormDialog } from "@/pages/attendance-session-form-dialog";
import { StudentAttendanceFormDialog } from "@/pages/student-attendance-form-dialog";
import { useAttendanceSessions, useStudentAttendances, useDeleteAttendanceSession, useDeleteStudentAttendance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { AttendanceSession, StudentAttendance } from "@/lib/types";

const sessionStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  scheduled: "secondary", open: "info", finalized: "success", cancelled: "warning",
};
const attStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  present: "success", absent: "warning", late: "info", excused: "secondary", leave: "secondary", half_day: "warning", unknown: "secondary",
};

export default function AttendancePage() {
  const sessions = useAttendanceSessions();
  const attendances = useStudentAttendances();
  const deleteSession = useDeleteAttendanceSession();
  const deleteAtt = useDeleteStudentAttendance();
  const [q, setQ] = useState("");
  const [sessionOpen, setSessionOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<AttendanceSession | undefined>();
  const [attOpen, setAttOpen] = useState(false);
  const [editingAtt, setEditingAtt] = useState<StudentAttendance | undefined>();

  const filteredSessions = useMemo(() => {
    let list = sessions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.sectionName.toLowerCase().includes(s) || r.sessionDate.includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [sessions.data, q]);

  const filteredAtts = useMemo(() => {
    let list = attendances.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.status.toLowerCase().includes(s)); }
    return list;
  }, [attendances.data, q]);

  const finalized = (sessions.data ?? []).filter((s) => s.status === "finalized").length;
  const present = (attendances.data ?? []).filter((a) => a.status === "present").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={ClipboardCheck} title="Student Attendance" titleNe="उपस्थिति" microModule="M07.03" description="Daily, period and subject attendance capture." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => { setEditingSession(undefined); setSessionOpen(true); }}><Plus className="h-4 w-4" /> New Session</Button><Button onClick={() => { setEditingAtt(undefined); setAttOpen(true); }}><Plus className="h-4 w-4" /> Record Attendance</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Sessions</p><p className="text-lg font-bold">{sessions.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Finalized</p><p className="text-lg font-bold">{finalized}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Present records</p><p className="text-lg font-bold">{present}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search sessions or attendance…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="sessions">
        <TabsList><TabsTrigger value="sessions">Attendance Sessions</TabsTrigger><TabsTrigger value="records">Student Records</TabsTrigger></TabsList>
        <TabsContent value="sessions" className="mt-4">
          {sessions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Date</TableHead><TableHead>Section</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead>Scheduled</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSessions.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5 text-sm font-mono">{s.sessionDate}</TableCell><TableCell><Badge variant="secondary">{s.sectionName}</Badge></TableCell><TableCell><span className="text-sm">{s.periodNo ?? "—"}</span></TableCell><TableCell><Badge variant={sessionStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell><span className="text-xs text-muted-foreground">{s.scheduledStartAt.slice(11,16)}–{s.scheduledEndAt.slice(11,16)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingSession(s); setSessionOpen(true); }}><Pencil /> Edit session</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteSession.mutate(s)}><Trash2 /> Delete session</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="records" className="mt-4">
          {attendances.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Session</TableHead><TableHead>Status</TableHead><TableHead>Recorded At</TableHead><TableHead>Remarks</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAtts.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.studentName}</TableCell><TableCell><Badge variant="secondary">{a.sessionLabel ?? a.sessionId}</Badge></TableCell><TableCell><Badge variant={attStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_"," ")}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.recordedAt.replace("T"," ")}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{a.remarks ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingAtt(a); setAttOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAtt.mutate(a)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <AttendanceSessionFormDialog open={sessionOpen} onOpenChange={setSessionOpen} session={editingSession} />
      <StudentAttendanceFormDialog open={attOpen} onOpenChange={setAttOpen} attendance={editingAtt} />
    </div>
  );
}
