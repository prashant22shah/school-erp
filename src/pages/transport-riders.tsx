import { useMemo, useState } from "react";
import { Users, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RiderAssignmentFormDialog } from "@/pages/rider-assignment-form-dialog";
import { BoardingLogFormDialog } from "@/pages/boarding-log-form-dialog";
import { useRiderAssignments, useBoardingLogs, useDeleteRiderAssignment, useDeleteBoardingLog } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { RiderAssignment, BoardingLog } from "@/lib/types";

const assignmentStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  inactive: "secondary",
  pending: "warning",
  cancelled: "destructive",
};

const riderTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  student: "info",
  staff: "warning",
};

const boardingStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  boarded: "success",
  alighted: "info",
  absent: "warning",
  no_show: "destructive",
};

export default function TransportRidersPage() {
  const assignments = useRiderAssignments();
  const logs = useBoardingLogs();
  const deleteAssignment = useDeleteRiderAssignment();
  const deleteLog = useDeleteBoardingLog();
  const [q, setQ] = useState("");
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<RiderAssignment | undefined>();
  const [logOpen, setLogOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<BoardingLog | undefined>();

  const filteredAssignments = useMemo(() => {
    let list = assignments.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.riderName.toLowerCase().includes(s) || a.riderType.toLowerCase().includes(s) || (a.routeName ?? "").toLowerCase().includes(s) || (a.stopName ?? "").toLowerCase().includes(s) || a.status.toLowerCase().includes(s));
    }
    return list;
  }, [assignments.data, q]);

  const filteredLogs = useMemo(() => {
    let list = logs.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((l) => l.riderName.toLowerCase().includes(s) || l.boardingStatus.toLowerCase().includes(s) || (l.remarks ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [logs.data, q]);

  const activeAssignments = (assignments.data ?? []).filter((a) => a.status === "active").length;
  const boarded = (logs.data ?? []).filter((l) => l.boardingStatus === "boarded").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Rider Assignment & Boarding"
        titleNe="यात्रु तथा बोर्डिङ"
        microModule="M17.03/M17.04"
        description="Rider assignments to routes/stops and daily boarding safety logs."
        actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingAssignment(undefined); setAssignmentOpen(true); }}><CanCreate resource="riderAssignments">New Assignment</CanCreate></Button><Button onClick={() => { setEditingLog(undefined); setLogOpen(true); }}> New Boarding Log</Button></div>}
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Assignments</p><p className="text-lg font-bold">{assignments.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Riders</p><p className="text-lg font-bold">{activeAssignments}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Boarding Logs</p><p className="text-lg font-bold">{logs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Boarded</p><p className="text-lg font-bold">{boarded}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search riders or logs…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="assignments">
        <TabsList><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="logs">Boarding Logs</TabsTrigger></TabsList>

        <TabsContent value="assignments" className="mt-4">
          {assignments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Rider</TableHead><TableHead>Type</TableHead><TableHead>Route</TableHead><TableHead>Stop</TableHead><TableHead>Pickup Time</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAssignments.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{a.riderName}</span><code className="text-xs text-muted-foreground">{a.riderRef}</code></div></TableCell><TableCell><Badge variant={riderTypeVariant[a.riderType] ?? "secondary"} className="capitalize">{a.riderType}</Badge></TableCell><TableCell><Badge variant="secondary">{a.routeName ?? a.routeId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm">{a.stopName ?? "—"}</span></TableCell><TableCell><span className="text-sm font-mono">{a.pickupTime ?? "—"}</span></TableCell><TableCell><Badge variant={assignmentStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="riderAssignments" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          {logs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Rider</TableHead><TableHead>Route / Vehicle</TableHead><TableHead>Log Date</TableHead><TableHead>Status</TableHead><TableHead>Remarks</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredLogs.map((l) => (<TableRow key={l.id} className="group"><TableCell className="pl-5 font-medium">{l.riderName}</TableCell><TableCell><div className="flex flex-col"><span className="text-xs"><Badge variant="secondary" className="mr-1">{l.routeId ? l.routeId.slice(0, 8) : "—"}</Badge>{l.vehicleId ? <code className="text-xs text-muted-foreground">{l.vehicleId.slice(0, 8)}</code> : "—"}</span></div></TableCell><TableCell><span className="text-sm">{fmtDate(l.logDate)}</span></TableCell><TableCell><Badge variant={boardingStatusVariant[l.boardingStatus] ?? "secondary"} className="capitalize">{l.boardingStatus.replace("_", " ")}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{l.remarks ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="boardingLogs" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <RiderAssignmentFormDialog open={assignmentOpen} onOpenChange={setAssignmentOpen} riderAssignment={editingAssignment} />
      <BoardingLogFormDialog open={logOpen} onOpenChange={setLogOpen} boardingLog={editingLog} />
    </div>
  );
}
