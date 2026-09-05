import { useMemo, useState } from "react";
import { FileText, BarChart3, Search, Plus, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ReportDefinitionFormDialog } from "@/pages/report-definition-form-dialog";
import { useReportDefinitions, useReportRuns, useDeleteReportDefinition, useDeleteReportRun } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ReportDefinition, ReportRun } from "@/lib/types";

const defStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};
const runStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  queued: "default", running: "warning", completed: "success", failed: "destructive", cancelled: "info",
};

export default function OperationalReportsPage() {
  const defQuery = useReportDefinitions();
  const runQuery = useReportRuns();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ReportDefinition | ReportRun | undefined>();
  const [dialogType, setDialogType] = useState<"definition" | "run">("definition");

  const filteredDef = useMemo(() => {
    let list = defQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s)); }
    return list;
  }, [defQuery.data, q]);

  const filteredRun = useMemo(() => {
    let list = runQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.reportName.toLowerCase().includes(s) || r.requestedBy.toLowerCase().includes(s)); }
    return list;
  }, [runQuery.data, q]);

  const totalDef = defQuery.data?.length ?? 0;
  const publishedDef = (defQuery.data ?? []).filter((r) => r.status === "published").length;
  const totalRun = runQuery.data?.length ?? 0;
  const completedRun = (runQuery.data ?? []).filter((r) => r.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Operational Reports"
        titleNe="सञ्चालन रिपोर्ट"
        microModule="M24.01"
        description="Define, schedule and track operational reports."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="reportDefinitions"><Button onClick={() => { setEditing(undefined); setDialogType("definition"); setOpen(true); }}><Plus className="h-4 w-4" /> New Report Definition</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Definitions</p><p className="text-lg font-bold">{totalDef}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BarChart3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedDef}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BarChart3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Runs</p><p className="text-lg font-bold">{totalRun}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CheckCircle2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed Runs</p><p className="text-lg font-bold">{completedRun}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="definitions">
        <TabsList>
          <TabsTrigger value="definitions">Report Definitions</TabsTrigger>
          <TabsTrigger value="runs">Report Runs</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="mt-4">
          {defQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Data Source</TableHead><TableHead>Format</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDef.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.code}</code></TableCell><TableCell><span className="font-medium">{r.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.category}</Badge></TableCell><TableCell><span className="text-sm">{r.dataSource}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.format}</Badge></TableCell><TableCell><Badge variant={defStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="reportDefinitions" onEdit={() => { setEditing(r); setDialogType("definition"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="runs" className="mt-4">
          {runQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Report</TableHead><TableHead>Requested By</TableHead><TableHead>Started</TableHead><TableHead>Rows</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRun.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><span className="font-medium">{r.reportName}</span></TableCell><TableCell><span className="text-sm">{r.requestedBy}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.startedAt)}</span></TableCell><TableCell><span className="text-sm">{r.rowCount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{r.completedAt && r.startedAt ? `${((new Date(r.completedAt).getTime() - new Date(r.startedAt).getTime()) / 1000).toFixed(1)}s` : "—"}</span></TableCell><TableCell><Badge variant={runStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="reportRuns" onEdit={() => { setEditing(r); setDialogType("run"); setOpen(true); }} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ReportDefinitionFormDialog open={open} onOpenChange={setOpen} editing={editing} dialogType={dialogType} />
    </div>
  );
}
