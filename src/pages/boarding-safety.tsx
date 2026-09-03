import { useMemo, useState } from "react";
import { ShieldCheck, Search, Plus, Pencil, Trash2, Bus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { BoardingLogFormDialog } from "@/pages/boarding-log-form-dialog";
import { useBoardingLogs, useDeleteBoardingLog } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { BoardingLog } from "@/lib/types";

const boardingVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  boarded: "success",
  alighted: "info",
  absent: "warning",
  no_show: "destructive",
};

const mockSafetyChecklist = [
  { id: "sc1", item: "Seatbelts functional", status: "pass", lastChecked: "2082-06-10" },
  { id: "sc2", item: "First aid kit present", status: "pass", lastChecked: "2082-06-10" },
  { id: "sc3", item: "Fire extinguisher valid", status: "pass", lastChecked: "2082-06-09" },
  { id: "sc4", item: "Driver license valid", status: "pass", lastChecked: "2082-06-01" },
  { id: "sc5", item: "Emergency exit clear", status: "fail", lastChecked: "2082-06-10" },
  { id: "sc6", item: "Vehicle fitness certificate", status: "pass", lastChecked: "2082-05-15" },
];

const mockIncidents = [
  { id: "in1", date: "2082-06-08", vehicle: "Ba 1 KHA 2345", description: "Minor tyre puncture near Baneshwor", severity: "low", status: "resolved" },
  { id: "in2", date: "2082-06-05", vehicle: "Ba 2 PA 6789", description: "Student minor injury during boarding", severity: "medium", status: "resolved" },
  { id: "in3", date: "2082-06-02", vehicle: "Ba 1 KHA 2345", description: "Engine overheating on hill route", severity: "high", status: "in_progress" },
];

const checklistVariant: Record<string, "success" | "destructive"> = {
  pass: "success",
  fail: "destructive",
};

const incidentVariant: Record<string, "default" | "warning" | "destructive" | "success"> = {
  low: "default",
  medium: "warning",
  high: "destructive",
};

export default function BoardingSafetyPage() {
  const query = useBoardingLogs();
  const del = useDeleteBoardingLog();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BoardingLog | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.riderName.toLowerCase().includes(s) || b.boardingStatus.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const boarded = (query.data ?? []).filter((b) => b.boardingStatus === "boarded").length;
  const alighted = (query.data ?? []).filter((b) => b.boardingStatus === "alighted").length;
  const incidents = mockIncidents.length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldCheck}
        title="Boarding & Safety"
        titleNe="बोर्डिङ तथा सुरक्षा"
        microModule="M17.04"
        description="Boarding logs, safety checklists and incident tracking."
        actions={
          <Button onClick={() => { setEditing(undefined); setOpen(true); }}>
            <Plus className="h-4 w-4" /> New Boarding Log
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Boardings Today</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Boarded</p><p className="text-lg font-bold">{boarded}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Bus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Alighted</p><p className="text-lg font-bold">{alighted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Incidents</p><p className="text-lg font-bold">{incidents}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search boarding logs by rider name or status…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="boarding">
        <TabsList>
          <TabsTrigger value="boarding">Boarding Log</TabsTrigger>
          <TabsTrigger value="safety">Safety Checklist</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="boarding" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Rider</TableHead><TableHead>Route</TableHead><TableHead>Vehicle</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Recorded On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5"><span className="font-medium">{b.riderName}</span></TableCell><TableCell><span className="text-sm">{b.routeId ?? "—"}</span></TableCell><TableCell><span className="text-sm">{b.vehicleId ?? "—"}</span></TableCell><TableCell><span className="text-sm">{fmtDate(b.logDate)}</span></TableCell><TableCell><Badge variant={boardingVariant[b.boardingStatus] ?? "secondary"} className="capitalize">{b.boardingStatus.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(b.recordedOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(b); setOpen(true); }}><Pencil /> Edit log</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(b)}><Trash2 /> Delete log</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="safety" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Checklist Item</TableHead><TableHead>Status</TableHead><TableHead>Last Checked</TableHead></TableRow></TableHeader><TableBody>{mockSafetyChecklist.map((sc) => (<TableRow key={sc.id}><TableCell className="pl-5"><span className="font-medium">{sc.item}</span></TableCell><TableCell><Badge variant={checklistVariant[sc.status] ?? "secondary"} className="capitalize">{sc.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(sc.lastChecked)}</span></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Date</TableHead><TableHead>Vehicle</TableHead><TableHead>Description</TableHead><TableHead>Severity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockIncidents.map((inc) => (<TableRow key={inc.id}><TableCell className="pl-5"><span className="text-sm">{fmtDate(inc.date)}</span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{inc.vehicle}</code></TableCell><TableCell><span className="text-sm">{inc.description}</span></TableCell><TableCell><Badge variant={incidentVariant[inc.severity] ?? "secondary"} className="capitalize">{inc.severity}</Badge></TableCell><TableCell><Badge variant={inc.status === "resolved" ? "success" : "warning"} className="capitalize">{inc.status.replace("_", " ")}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <BoardingLogFormDialog open={open} onOpenChange={setOpen} boardingLog={editing} />
    </div>
  );
}
