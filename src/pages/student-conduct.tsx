import { useMemo, useState } from "react";
import { ShieldAlert, Gavel, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ConductIncidentFormDialog } from "@/pages/conduct-incident-form-dialog";
import { useConductIncidents, useConductActions, useDeleteConductIncident, useDeleteConductAction } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ConductIncident, ConductAction } from "@/lib/types";

const incidentStatusVariant: Record<string, "default" | "info" | "warning" | "destructive"> = {
  reported: "default", investigating: "info", resolved: "warning", escalated: "destructive",
};

const incidentCategoryVariant: Record<string, "default" | "info" | "warning" | "destructive"> = {
  minor: "default", major: "info", serious: "warning", critical: "destructive",
};

const actionStatusVariant: Record<string, "default" | "info" | "warning" | "secondary"> = {
  issued: "default", serving: "info", completed: "warning", appealed: "secondary",
};

export default function StudentConductPage() {
  const incidents = useConductIncidents();
  const actions = useConductActions();
  const deleteIncident = useDeleteConductIncident();
  const deleteAction = useDeleteConductAction();
  const [q, setQ] = useState("");
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<ConductIncident | undefined>();
  const [actionOpen, setActionOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<ConductAction | undefined>();

  const filteredIncidents = useMemo(() => {
    let list = incidents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.studentName.toLowerCase().includes(s) || i.category.toLowerCase().includes(s) || i.location.toLowerCase().includes(s)); }
    return list;
  }, [incidents.data, q]);

  const filteredActions = useMemo(() => {
    let list = actions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.incidentRef.toLowerCase().includes(s) || a.actionType.toLowerCase().includes(s)); }
    return list;
  }, [actions.data, q]);

  const escalatedIncidents = (incidents.data ?? []).filter((i) => i.status === "escalated").length;
  const servingActions = (actions.data ?? []).filter((a) => a.status === "serving").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldAlert}
        title="Discipline & Conduct"
        titleNe="व्यवहार तथा अनुशासन"
        microModule="M19.05"
        description="Student conduct incidents and disciplinary actions."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="conductIncidents"><Button variant="outline" onClick={() => { setEditingIncident(undefined); setIncidentOpen(true); }}><Plus className="h-4 w-4" /> New Incident</Button></CanCreate>
            <CanCreate resource="conductActions"><Button onClick={() => { setEditingAction(undefined); setActionOpen(true); }}><Plus className="h-4 w-4" /> New Action</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Incidents</p><p className="text-lg font-bold">{incidents.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ShieldAlert className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Escalated</p><p className="text-lg font-bold">{escalatedIncidents}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Gavel className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Disciplinary Actions</p><p className="text-lg font-bold">{actions.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Gavel className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Currently Serving</p><p className="text-lg font-bold">{servingActions}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search incidents or actions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="incidents">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="mt-4">
          {incidents.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Date</TableHead><TableHead>Category</TableHead><TableHead>Location</TableHead><TableHead>Reported By</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredIncidents.map((i) => (<TableRow key={i.id} className="group"><TableCell className="pl-5"><span className="font-medium">{i.studentName}</span><br /><span className="text-xs text-muted-foreground">{i.studentRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(i.incidentDate)}</span></TableCell><TableCell><Badge variant={incidentCategoryVariant[i.category] ?? "secondary"} className="capitalize">{i.category}</Badge></TableCell><TableCell><span className="text-sm">{i.location}</span></TableCell><TableCell><span className="text-sm">{i.reportedBy}</span></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[150px]">{i.description}</span></TableCell><TableCell><Badge variant={incidentStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="conductIncidents" onEdit={() => { setEditingIncident(i); setIncidentOpen(true); }} onDelete={() => deleteIncident.mutate(i)} editLabel="Edit incident" deleteLabel="Delete incident" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          {actions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Incident Ref</TableHead><TableHead>Action Type</TableHead><TableHead>Description</TableHead><TableHead>Start Date</TableHead><TableHead>End Date</TableHead><TableHead>Approved By</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredActions.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.incidentRef}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.actionType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm line-clamp-1 max-w-[150px]">{a.description}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.startDate)}</span></TableCell><TableCell><span className="text-sm">{a.endDate ? fmtDate(a.endDate) : "—"}</span></TableCell><TableCell><span className="text-sm">{a.approvedBy}</span></TableCell><TableCell><Badge variant={actionStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="conductActions" onEdit={() => { setEditingAction(a); setActionOpen(true); }} onDelete={() => deleteAction.mutate(a)} editLabel="Edit action" deleteLabel="Delete action" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ConductIncidentFormDialog open={incidentOpen} onOpenChange={setIncidentOpen} conductIncident={editingIncident} />
      <ConductIncidentFormDialog open={actionOpen} onOpenChange={setActionOpen} conductAction={editingAction} />
    </div>
  );
}
