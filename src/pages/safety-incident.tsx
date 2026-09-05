import { useMemo, useState } from "react";
import { ShieldAlert, AlertTriangle, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SafetyIncidentFormDialog } from "@/pages/safety-incident-form-dialog";
import { useSafetyIncidents, useEmergencyActions, useDeleteSafetyIncident, useDeleteEmergencyAction } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { SafetyIncident, EmergencyAction } from "@/lib/types";

const incidentStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  reported: "default", investigating: "info", contained: "warning", resolved: "success", closed: "info",
};
const severityVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  minor: "info", moderate: "warning", major: "destructive", critical: "destructive",
};
const actionStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  planned: "default", in_progress: "warning", completed: "success", cancelled: "destructive",
};

export default function SafetyIncidentPage() {
  const incidentQuery = useSafetyIncidents();
  const actionQuery = useEmergencyActions();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SafetyIncident | EmergencyAction | undefined>();

  const filteredIncidents = useMemo(() => {
    let list = incidentQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.title.toLowerCase().includes(s) || i.location.toLowerCase().includes(s)); }
    return list;
  }, [incidentQuery.data, q]);

  const filteredActions = useMemo(() => {
    let list = actionQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.description.toLowerCase().includes(s) || a.actionType.toLowerCase().includes(s)); }
    return list;
  }, [actionQuery.data, q]);

  const totalIncidents = incidentQuery.data?.length ?? 0;
  const openIncidents = (incidentQuery.data ?? []).filter((i) => i.status === "reported" || i.status === "investigating").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldAlert}
        title="Safety, Incident & Emergency"
        titleNe="सुरक्षा, घटना तथा आपतकालीन"
        microModule="M22.04"
        description="Track safety incidents, emergency actions and response protocols."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="safetyIncidents"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Incident</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Incidents</p><p className="text-lg font-bold">{totalIncidents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Incidents</p><p className="text-lg font-bold">{openIncidents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Emergency Actions</p><p className="text-lg font-bold">{actionQuery.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{(actionQuery.data ?? []).filter((a) => a.status === "completed").length}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents, actions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="incidents">
        <TabsList>
          <TabsTrigger value="incidents">Safety Incidents</TabsTrigger>
          <TabsTrigger value="actions">Emergency Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="mt-4">
          {incidentQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Location</TableHead><TableHead>Type</TableHead><TableHead>Severity</TableHead><TableHead>Occurred</TableHead><TableHead>Reported By</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredIncidents.map((i) => (<TableRow key={i.id} className="group"><TableCell className="pl-5"><span className="font-medium">{i.location}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{i.category.replace("_", " ")}</Badge></TableCell><TableCell><Badge variant={severityVariant[i.severity] ?? "secondary"} className="capitalize">{i.severity}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(i.occurredOn)}</span></TableCell><TableCell><span className="text-sm">{i.reportedByName || i.reportedBy}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="safetyIncidents" onEdit={() => { setEditing(i); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          {actionQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Incident</TableHead><TableHead>Action Type</TableHead><TableHead>Owner</TableHead><TableHead>Occurred</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredActions.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.incidentNo}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.actionType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{a.performedByName || a.performedBy}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.startedAt)}</span></TableCell><TableCell><Badge variant={actionStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="emergencyActions" onEdit={() => { setEditing(a); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <SafetyIncidentFormDialog open={open} onOpenChange={setOpen} editing={editing as SafetyIncident} />
    </div>
  );
}
