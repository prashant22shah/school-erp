import { useMemo, useState } from "react";
import { GitBranch, ListChecks, Search, Plus, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { WorkflowDefinitionFormDialog } from "@/pages/workflow-definition-form-dialog";
import { useWorkflowDefinitions, useWorkflowInstances, useWorkflowTasks, useWorkflowTransitions, useDeleteWorkflowDefinition, useDeleteWorkflowInstance, useDeleteWorkflowTask, useDeleteWorkflowTransition } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { WorkflowDefinition, WorkflowInstance, WorkflowTask, WorkflowTransition } from "@/lib/types";

const defStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", active: "success", archived: "info",
};
const instStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  running: "info", completed: "success", failed: "destructive", suspended: "warning",
};
const taskStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  pending: "default", in_progress: "warning", completed: "success", skipped: "info",
};

export default function WorkflowDesignerPage() {
  const defQuery = useWorkflowDefinitions();
  const instQuery = useWorkflowInstances();
  const taskQuery = useWorkflowTasks();
  const transQuery = useWorkflowTransitions();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<WorkflowDefinition | undefined>();

  const filteredDef = useMemo(() => {
    let list = defQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.name.toLowerCase().includes(s) || d.code.toLowerCase().includes(s)); }
    return list;
  }, [defQuery.data, q]);

  const filteredInst = useMemo(() => {
    let list = instQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.businessRef.toLowerCase().includes(s) || i.state.toLowerCase().includes(s)); }
    return list;
  }, [instQuery.data, q]);

  const filteredTask = useMemo(() => {
    let list = taskQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.name.toLowerCase().includes(s) || t.assigneeRole.toLowerCase().includes(s)); }
    return list;
  }, [taskQuery.data, q]);

  const filteredTrans = useMemo(() => {
    let list = transQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.fromState.toLowerCase().includes(s) || t.toState.toLowerCase().includes(s)); }
    return list;
  }, [transQuery.data, q]);

  const totalDef = defQuery.data?.length ?? 0;
  const activeDef = (defQuery.data ?? []).filter((d) => d.status === "active").length;
  const totalInst = instQuery.data?.length ?? 0;
  const runningInst = (instQuery.data ?? []).filter((i) => i.status === "running").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GitBranch}
        title="Workflow Designer"
        titleNe="कार्यप्रवाह डिजाइनर"
        microModule="M23.04"
        description="Design and manage workflow definitions, instances and tasks."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="workflowDefinitions"><Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Definition</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><GitBranch className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Definitions</p><p className="text-lg font-bold">{totalDef}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Definitions</p><p className="text-lg font-bold">{activeDef}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ListChecks className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Instances</p><p className="text-lg font-bold">{totalInst}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Running</p><p className="text-lg font-bold">{runningInst}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search workflows…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="definitions">
        <TabsList>
          <TabsTrigger value="definitions">Definitions</TabsTrigger>
          <TabsTrigger value="instances">Instances</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="transitions">Transitions</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="mt-4">
          {defQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Version</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDef.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.code}</code></TableCell><TableCell><span className="font-medium">{d.name}</span></TableCell><TableCell><span className="text-sm">v{d.version}</span></TableCell><TableCell><Badge variant={defStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workflowDefinitions" onEdit={() => { setEditing(d); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="instances" className="mt-4">
          {instQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Definition</TableHead><TableHead>Business Ref</TableHead><TableHead>State</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredInst.map((i) => (<TableRow key={i.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.definitionId}</code></TableCell><TableCell><span className="text-sm">{i.businessRef}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{i.state}</Badge></TableCell><TableCell><Badge variant={instStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workflowInstances" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="mt-4">
          {taskQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Assignee</TableHead><TableHead>Due At</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTask.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5"><span className="font-medium">{t.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{t.assigneeRole}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(t.dueAt)}</span></TableCell><TableCell><Badge variant={taskStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workflowTasks" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="transitions" className="mt-4">
          {transQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Instance</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Actor</TableHead><TableHead>Occurred At</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTrans.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.instanceId}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{t.fromState}</Badge></TableCell><TableCell><Badge variant="info" className="capitalize">{t.toState}</Badge></TableCell><TableCell><span className="text-sm">{t.actorRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(t.occurredAt)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="workflowTransitions" onEdit={() => {}} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <WorkflowDefinitionFormDialog open={open} onOpenChange={setOpen} editing={editing} />
    </div>
  );
}
