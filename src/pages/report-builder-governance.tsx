import { useMemo, useState } from "react";
import { FileBarChart, Search, Plus, Calendar } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ReportBuilderFormDialog } from "@/pages/report-builder-form-dialog";
import { ReportScheduleFormDialog } from "@/pages/report-schedule-form-dialog";
import { useReportBuilders, useReportSchedules, useDeleteReportBuilder, useDeleteReportSchedule } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ReportBuilder, ReportSchedule } from "@/lib/types";

const builderStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  draft: "default", published: "success", archived: "info",
};
const scheduleStatusVariant: Record<string, "default" | "info" | "warning" | "success" | "destructive"> = {
  active: "success", paused: "warning", completed: "info", failed: "destructive",
};

export default function ReportBuilderGovernancePage() {
  const builderQuery = useReportBuilders();
  const scheduleQuery = useReportSchedules();
  const deleteBuilder = useDeleteReportBuilder();
  const deleteSchedule = useDeleteReportSchedule();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ReportBuilder | ReportSchedule | undefined>();
  const [dialogType, setDialogType] = useState<"builder" | "schedule">("builder");

  const filteredBuilder = useMemo(() => {
    let list = builderQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.category.toLowerCase().includes(s)); }
    return list;
  }, [builderQuery.data, q]);

  const filteredSchedule = useMemo(() => {
    let list = scheduleQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.reportName.toLowerCase().includes(s) || r.frequency.toLowerCase().includes(s)); }
    return list;
  }, [scheduleQuery.data, q]);

  const builders = builderQuery.data ?? [];
  const schedules = scheduleQuery.data ?? [];
  const publishedCount = builders.filter((b) => b.status === "published").length;
  const activeSchedules = schedules.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileBarChart}
        title="Report Builder"
        titleNe="रिपोर्ट निर्माण"
        microModule="M24.07"
        description="Create custom reports and schedule automated report generation."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="reportBuilders"><Button onClick={() => { setEditing(undefined); setDialogType("builder"); setOpen(true); }}><Plus className="h-4 w-4" /> New Report Builder</Button></CanCreate>
            <CanCreate resource="reportBuilders"><Button variant="outline" onClick={() => { setEditing(undefined); setDialogType("schedule"); setOpen(true); }}><Calendar className="h-4 w-4" /> New Schedule</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileBarChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Builders</p><p className="text-lg font-bold">{builders.length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileBarChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Calendar className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Schedules</p><p className="text-lg font-bold">{activeSchedules}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="builders">
        <TabsList>
          <TabsTrigger value="builders">Report Builders</TabsTrigger>
          <TabsTrigger value="schedules">Report Schedules</TabsTrigger>
        </TabsList>

        <TabsContent value="builders" className="mt-4">
          {builderQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Category</TableHead><TableHead>Data Source</TableHead><TableHead>Chart</TableHead><TableHead>Status</TableHead><TableHead>Created By</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBuilder.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5"><span className="font-medium">{b.name}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{b.category}</Badge></TableCell><TableCell><span className="text-sm">{b.dataSource}</span></TableCell><TableCell><Badge variant="outline" className="capitalize">{b.chartType}</Badge></TableCell><TableCell><Badge variant={builderStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell><span className="text-sm">{b.createdBy || "—"}</span></TableCell><TableCell><RowActionMenu resource="reportBuilders" onEdit={() => { setEditing(b); setDialogType("builder"); setOpen(true); }} onDelete={() => deleteBuilder.mutate(b)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="schedules" className="mt-4">
          {scheduleQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Report</TableHead><TableHead>Frequency</TableHead><TableHead>Format</TableHead><TableHead>Recipients</TableHead><TableHead>Last Run</TableHead><TableHead>Next Run</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSchedule.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><span className="font-medium">{s.reportName}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{s.frequency}</Badge></TableCell><TableCell><Badge variant="outline" className="uppercase">{s.format}</Badge></TableCell><TableCell><span className="text-sm truncate max-w-[200px] block">{s.recipients}</span></TableCell><TableCell><span className="text-sm">{fmtDate(s.lastRun)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(s.nextRun)}</span></TableCell><TableCell><Badge variant={scheduleStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell><TableCell><RowActionMenu resource="reportBuilders" onEdit={() => { setEditing(s); setDialogType("schedule"); setOpen(true); }} onDelete={() => deleteSchedule.mutate(s)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ReportBuilderFormDialog open={open && dialogType === "builder"} onOpenChange={setOpen} editing={editing && "dataSource" in editing ? editing : undefined} />
      <ReportScheduleFormDialog open={open && dialogType === "schedule"} onOpenChange={setOpen} editing={editing && "frequency" in editing ? editing : undefined} />
    </div>
  );
}
