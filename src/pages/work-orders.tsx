import { useMemo, useState } from "react";
import { Wrench, ClipboardList, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ServiceRequestFormDialog } from "@/pages/service-request-form-dialog";
import { useServiceRequests, useWorkOrders, useWorkOrderActivities, useDeleteServiceRequest, useDeleteWorkOrder, useDeleteWorkOrderActivity } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ServiceRequest, WorkOrder, WorkOrderActivity } from "@/lib/types";

const srStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  open: "default", assigned: "info", in_progress: "warning", resolved: "success", closed: "info", cancelled: "destructive",
};
const woStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  created: "default", scheduled: "info", in_progress: "warning", on_hold: "destructive", completed: "success", cancelled: "destructive",
};
const actStatusVariant: Record<string, "default" | "info" | "warning" | "success"> = {
  planned: "default", in_progress: "warning", completed: "success", skipped: "info",
};

export default function WorkOrdersPage() {
  const srQuery = useServiceRequests();
  const woQuery = useWorkOrders();
  const actQuery = useWorkOrderActivities();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRequest | WorkOrder | WorkOrderActivity | undefined>();
  const [dialogType, setDialogType] = useState<"serviceRequest" | "workOrder" | "activity">("serviceRequest");

  const filteredSR = useMemo(() => {
    let list = srQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.title.toLowerCase().includes(s) || r.category.toLowerCase().includes(s)); }
    return list;
  }, [srQuery.data, q]);

  const filteredWO = useMemo(() => {
    let list = woQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((w) => w.title.toLowerCase().includes(s) || w.workOrderNo.toLowerCase().includes(s)); }
    return list;
  }, [woQuery.data, q]);

  const filteredAct = useMemo(() => {
    let list = actQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.activityType.toLowerCase().includes(s) || a.description.toLowerCase().includes(s)); }
    return list;
  }, [actQuery.data, q]);

  const totalSR = srQuery.data?.length ?? 0;
  const openSR = (srQuery.data ?? []).filter((r) => r.status === "open").length;
  const totalWO = woQuery.data?.length ?? 0;
  const inProgressWO = (woQuery.data ?? []).filter((w) => w.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Wrench}
        title="Service Desk & Work Orders"
        titleNe="सेवा डेस्क तथा कार्य आदेश"
        microModule="M22.01"
        description="Manage service requests, work orders and maintenance activities."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="serviceRequests"><Button onClick={() => { setEditing(undefined); setDialogType("serviceRequest"); setOpen(true); }}><Plus className="h-4 w-4" /> New Service Request</Button></CanCreate>
            <CanCreate resource="workOrders"><Button variant="outline" onClick={() => { setEditing(undefined); setDialogType("workOrder"); setOpen(true); }}><Plus className="h-4 w-4" /> New Work Order</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Wrench className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Requests</p><p className="text-lg font-bold">{totalSR}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Requests</p><p className="text-lg font-bold">{openSR}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Work Orders</p><p className="text-lg font-bold">{totalWO}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">In Progress</p><p className="text-lg font-bold">{inProgressWO}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search service requests, work orders…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="serviceRequests">
        <TabsList>
          <TabsTrigger value="serviceRequests">Service Requests</TabsTrigger>
          <TabsTrigger value="workOrders">Work Orders</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="serviceRequests" className="mt-4">
          {srQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Requested By</TableHead><TableHead>Location</TableHead><TableHead>Reported On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSR.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><span className="font-medium">{r.title}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.category.replace("_", " ")}</Badge></TableCell><TableCell><Badge variant={r.priority === "urgent" ? "destructive" : r.priority === "high" ? "warning" : "default"} className="capitalize">{r.priority}</Badge></TableCell><TableCell><span className="text-sm">{r.requestedByName || r.requestedBy}</span></TableCell><TableCell><span className="text-sm">{r.location}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.reportedOn)}</span></TableCell><TableCell><Badge variant={srStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="serviceRequests" onEdit={() => { setEditing(r); setDialogType("serviceRequest"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="workOrders" className="mt-4">
          {woQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Work Order No</TableHead><TableHead>Title</TableHead><TableHead>Assigned To</TableHead><TableHead>Scheduled</TableHead><TableHead>Est. Cost</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredWO.map((w) => (<TableRow key={w.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{w.workOrderNo}</code></TableCell><TableCell><span className="font-medium">{w.title}</span></TableCell><TableCell><span className="text-sm">{w.assignedToName || w.assignedTo}</span></TableCell><TableCell><span className="text-sm">{fmtDate(w.scheduledDate)}</span></TableCell><TableCell><span className="text-sm">₹{w.estimatedCost.toLocaleString()}</span></TableCell><TableCell><Badge variant={woStatusVariant[w.status] ?? "secondary"} className="capitalize">{w.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workOrders" onEdit={() => { setEditing(w); setDialogType("workOrder"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          {actQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Work Order</TableHead><TableHead>Activity Type</TableHead><TableHead>Description</TableHead><TableHead>Performed By</TableHead><TableHead>Cost</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAct.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.workOrderNo}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.activityType}</Badge></TableCell><TableCell><span className="text-sm">{a.description}</span></TableCell><TableCell><span className="text-sm">{a.performedByName || a.performedBy}</span></TableCell><TableCell><span className="text-sm">₹{a.cost.toLocaleString()}</span></TableCell><TableCell><Badge variant={actStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workOrderActivities" onEdit={() => { setEditing(a); setDialogType("activity"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ServiceRequestFormDialog open={open} onOpenChange={setOpen} serviceRequest={editing} dialogType={dialogType} />
    </div>
  );
}
