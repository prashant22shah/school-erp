import { useMemo, useState } from "react";
import { ClipboardList, Search, Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RollCallFormDialog } from "@/pages/roll-call-form-dialog";
import { ResidenceIncidentFormDialog } from "@/pages/residence-incident-form-dialog";
import { useRollCalls, useResidenceIncidents, useDeleteRollCall, useDeleteResidenceIncident } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { RollCall, ResidenceIncident } from "@/lib/types";

const rollCallStatusVariant: Record<string, "info" | "success"> = {
  draft: "info", submitted: "success",
};
const incidentTypeVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  discipline: "warning", health: "info", safety: "destructive", damage: "secondary", theft: "destructive", other: "secondary",
};
const severityVariant: Record<string, "info" | "warning" | "destructive"> = {
  minor: "info", moderate: "warning", major: "destructive",
};
const incidentStatusVariant: Record<string, "info" | "warning" | "success" | "secondary"> = {
  reported: "info", investigating: "warning", resolved: "success", closed: "secondary",
};

export default function ResidenceOperations() {
  const rollCalls = useRollCalls();
  const incidents = useResidenceIncidents();
  const deleteRollCall = useDeleteRollCall();
  const deleteIncident = useDeleteResidenceIncident();
  const [q, setQ] = useState("");
  const [rollDialogOpen, setRollDialogOpen] = useState(false);
  const [editingRoll, setEditingRoll] = useState<RollCall | undefined>();
  const [incidentDialogOpen, setIncidentDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<ResidenceIncident | undefined>();

  const filteredRollCalls = useMemo(() => {
    let list = rollCalls.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.takenBy.toLowerCase().includes(s) || r.notes.toLowerCase().includes(s) || r.date.includes(s)); }
    return list;
  }, [rollCalls.data, q]);

  const filteredIncidents = useMemo(() => {
    let list = incidents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.reportedBy.toLowerCase().includes(s) || i.description.toLowerCase().includes(s) || i.type.includes(s)); }
    return list;
  }, [incidents.data, q]);

  const totalRollCalls = rollCalls.data?.length ?? 0;
  const totalIncidents = incidents.data?.length ?? 0;
  const openIncidents = (incidents.data ?? []).filter((i) => i.status === "reported" || i.status === "investigating").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Residence Operations"
        titleNe="निवास सञ्चालन"
        microModule="M18.03"
        description="Track residence roll calls and report/manage residence incidents."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="hostel">
              <Button variant="outline" onClick={() => { setEditingRoll(undefined); setRollDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New roll call
              </Button>
            </CanCreate>
            <CanCreate resource="hostel">
              <Button onClick={() => { setEditingIncident(undefined); setIncidentDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New incident
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardList className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total roll calls</p><p className="text-lg font-bold">{totalRollCalls}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total incidents</p><p className="text-lg font-bold">{totalIncidents}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Open incidents</p><p className="text-lg font-bold">{openIncidents}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search roll calls, incidents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="rollcalls">
        <TabsList>
          <TabsTrigger value="rollcalls">Roll Calls</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="rollcalls" className="mt-4">
          {rollCalls.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Date</TableHead>
                      <TableHead>Taken By</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRollCalls.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5"><span className="text-sm">{fmtDate(r.date)}</span></TableCell>
                        <TableCell><span className="text-sm">{r.takenBy}</span></TableCell>
                        <TableCell><Badge variant="success">{r.presentCount}</Badge></TableCell>
                        <TableCell><Badge variant="warning">{r.absentCount}</Badge></TableCell>
                        <TableCell><Badge variant="info">{r.lateCount}</Badge></TableCell>
                        <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{r.notes || "—"}</span></TableCell>
                        <TableCell><Badge variant={rollCallStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="hostel" onEdit={() => { setEditingRoll(r); setRollDialogOpen(true); }} onDelete={() => deleteRollCall.mutate(r)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="incidents" className="mt-4">
          {incidents.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reported By</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Action Taken</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((i) => (
                      <TableRow key={i.id} className="group">
                        <TableCell className="pl-5"><span className="text-xs">{fmtDate(i.incidentDate)}</span></TableCell>
                        <TableCell><Badge variant={incidentTypeVariant[i.type] ?? "secondary"} className="capitalize">{i.type}</Badge></TableCell>
                        <TableCell><span className="text-sm">{i.reportedBy}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{i.description}</span></TableCell>
                        <TableCell><Badge variant={severityVariant[i.severity] ?? "secondary"} className="capitalize">{i.severity}</Badge></TableCell>
                        <TableCell><span className="text-sm max-w-[180px] truncate inline-block">{i.actionTaken || "—"}</span></TableCell>
                        <TableCell><Badge variant={incidentStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="hostel" onEdit={() => { setEditingIncident(i); setIncidentDialogOpen(true); }} onDelete={() => deleteIncident.mutate(i)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <RollCallFormDialog open={rollDialogOpen} onOpenChange={setRollDialogOpen} editing={editingRoll} />
      <ResidenceIncidentFormDialog open={incidentDialogOpen} onOpenChange={setIncidentDialogOpen} editing={editingIncident} />
    </div>
  );
}
