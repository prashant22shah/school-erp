import { useMemo, useState } from "react";
import { CalendarClock, Settings, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MaintenancePlanFormDialog } from "@/pages/maintenance-plan-form-dialog";
import { useMaintenancePlans, useWorkOrders, useDeleteMaintenancePlan, useDeleteWorkOrder } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { MaintenancePlan, WorkOrder } from "@/lib/types";

const planStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  active: "success", inactive: "default", overdue: "destructive",
};
const woStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  created: "default", scheduled: "info", in_progress: "warning", completed: "success", cancelled: "destructive",
};

export default function PreventiveMaintenancePage() {
  const planQuery = useMaintenancePlans();
  const woQuery = useWorkOrders();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MaintenancePlan | WorkOrder | undefined>();

  const filteredPlans = useMemo(() => {
    let list = planQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.title.toLowerCase().includes(s) || p.assetName.toLowerCase().includes(s)); }
    return list;
  }, [planQuery.data, q]);

  const filteredWO = useMemo(() => {
    let list = woQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((w) => w.title.toLowerCase().includes(s) || w.workOrderNo.toLowerCase().includes(s)); }
    return list;
  }, [woQuery.data, q]);

  const totalPlans = planQuery.data?.length ?? 0;
  const activePlans = (planQuery.data ?? []).filter((p) => p.status === "active").length;
  const totalWO = woQuery.data?.length ?? 0;
  const inProgressWO = (woQuery.data ?? []).filter((w) => w.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarClock}
        title="Preventive Maintenance"
        titleNe="निवारक मर्मत"
        microModule="M22.02"
        description="Manage maintenance plans and scheduled work orders."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="maintenancePlans"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Maintenance Plan</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Plans</p><p className="text-lg font-bold">{totalPlans}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Settings className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Plans</p><p className="text-lg font-bold">{activePlans}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Settings className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Work Orders</p><p className="text-lg font-bold">{totalWO}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">In Progress</p><p className="text-lg font-bold">{inProgressWO}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search maintenance plans, work orders…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Maintenance Plans</TabsTrigger>
          <TabsTrigger value="workOrders">Work Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          {planQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Location</TableHead><TableHead>Cadence</TableHead><TableHead>Next Due</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPlans.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.title}</span></TableCell><TableCell><span className="text-sm">{p.assetName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.frequency.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.nextDueDate)}</span></TableCell><TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="maintenancePlans" onEdit={() => { setEditing(p); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="workOrders" className="mt-4">
          {woQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">ID</TableHead><TableHead>Assignee</TableHead><TableHead>Status</TableHead><TableHead>SLA</TableHead><TableHead>Created</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredWO.map((w) => (<TableRow key={w.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{w.workOrderNo}</code></TableCell><TableCell><span className="text-sm">{w.assignedToName || w.assignedTo}</span></TableCell><TableCell><Badge variant={woStatusVariant[w.status] ?? "secondary"} className="capitalize">{w.status.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{w.status.replace("_", " ")}</span></TableCell><TableCell><span className="text-sm">{fmtDate(w.createdOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workOrders" onEdit={() => { setEditing(w); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <MaintenancePlanFormDialog open={open} onOpenChange={setOpen} editing={editing as MaintenancePlan} />
    </div>
  );
}
