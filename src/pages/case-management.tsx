import { useMemo, useState } from "react";
import { Ticket, Clock, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ServiceCaseFormDialog } from "@/pages/service-case-form-dialog";
import { useServiceCases, useCaseActivities, useSlaClocks, useDeleteServiceCase, useDeleteCaseActivity, useDeleteSlaClock } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ServiceCase, CaseActivity, SlaClock } from "@/lib/types";

const caseStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  open: "default", in_progress: "warning", resolved: "success", closed: "info",
};
const casePriorityVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  low: "default", medium: "info", high: "warning", urgent: "destructive",
};

export default function CaseManagementPage() {
  const caseQuery = useServiceCases();
  const actQuery = useCaseActivities();
  const slaQuery = useSlaClocks();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceCase | undefined>();

  const filteredCase = useMemo(() => {
    let list = caseQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.category.toLowerCase().includes(s)); }
    return list;
  }, [caseQuery.data, q]);

  const filteredAct = useMemo(() => {
    let list = actQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.name.toLowerCase().includes(s) || a.type.toLowerCase().includes(s)); }
    return list;
  }, [actQuery.data, q]);

  const filteredSla = useMemo(() => {
    let list = slaQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sl) => sl.metric.toLowerCase().includes(s) || sl.caseId.toLowerCase().includes(s)); }
    return list;
  }, [slaQuery.data, q]);

  const totalCase = caseQuery.data?.length ?? 0;
  const openCase = (caseQuery.data ?? []).filter((c) => c.status === "open").length;
  const totalAct = actQuery.data?.length ?? 0;
  const totalSla = slaQuery.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Ticket}
        title="Case & Ticket Management"
        titleNe="केस तथा टिकट व्यवस्थापन"
        microModule="M23.05"
        description="Manage service cases, activities and SLA tracking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="serviceCases"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Case</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Ticket className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Cases</p><p className="text-lg font-bold">{totalCase}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Cases</p><p className="text-lg font-bold">{openCase}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Activities</p><p className="text-lg font-bold">{totalAct}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Clock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">SLA Clocks</p><p className="text-lg font-bold">{totalSla}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Service Cases</TabsTrigger>
          <TabsTrigger value="activities">Case Activities</TabsTrigger>
          <TabsTrigger value="slaClocks">SLA Clocks</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-4">
          {caseQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Category</TableHead><TableHead>Requester</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCase.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.category}</Badge></TableCell><TableCell><span className="text-sm">{c.requesterRef}</span></TableCell><TableCell><Badge variant={casePriorityVariant[c.priority] ?? "default"} className="capitalize">{c.priority}</Badge></TableCell><TableCell><Badge variant={caseStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="serviceCases" onEdit={() => { setEditing(c); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="activities" className="mt-4">
          {actQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Case</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Occurred At</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAct.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.caseId}</code></TableCell><TableCell><span className="font-medium">{a.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.type}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(a.occurredAt)}</span></TableCell><TableCell><Badge variant={a.status === "completed" ? "success" : "default"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="caseActivities" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="slaClocks" className="mt-4">
          {slaQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Case</TableHead><TableHead>Metric</TableHead><TableHead>Due At</TableHead><TableHead>Paused Duration</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSla.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.caseId}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{s.metric}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(s.dueAt)}</span></TableCell><TableCell><span className="text-sm">{s.pausedDuration || "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="slaClocks" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ServiceCaseFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
