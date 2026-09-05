import { useMemo, useState } from "react";
import { TrendingUp, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LearningMetricFormDialog } from "@/pages/learning-metric-form-dialog";
import { InterventionAlertFormDialog } from "@/pages/intervention-alert-form-dialog";
import { useLearningMetrics, useInterventionAlerts, useDeleteLearningMetric, useDeleteInterventionAlert } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { LearningMetric, InterventionAlert } from "@/lib/types";

const riskLevelVariant: Record<string, "success" | "warning" | "destructive"> = {
  low: "success", medium: "warning", high: "destructive",
};

const severityVariant: Record<string, "info" | "warning" | "destructive"> = {
  info: "info", warning: "warning", critical: "destructive",
};

const alertStatusVariant: Record<string, "warning" | "info" | "success"> = {
  open: "warning", acknowledged: "info", resolved: "success",
};

export default function LearningAnalyticsPage() {
  const metrics = useLearningMetrics();
  const alerts = useInterventionAlerts();
  const deleteMetric = useDeleteLearningMetric();
  const deleteAlert = useDeleteInterventionAlert();
  const [q, setQ] = useState("");
  const [metricOpen, setMetricOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<LearningMetric | undefined>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<InterventionAlert | undefined>();

  const filteredMetrics = useMemo(() => {
    const list = metrics.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((m: LearningMetric) => m.studentName.toLowerCase().includes(s) || m.riskLevel.toLowerCase().includes(s));
  }, [metrics.data, q]);

  const filteredAlerts = useMemo(() => {
    const list = alerts.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((a: InterventionAlert) => a.studentName.toLowerCase().includes(s) || a.alertType.toLowerCase().includes(s));
  }, [alerts.data, q]);

  const highRiskCount = (metrics.data ?? []).filter((m) => m.riskLevel === "high").length;
  const openAlerts = (alerts.data ?? []).filter((a) => a.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={TrendingUp}
        title="Learning Analytics"
        titleNe="विश्लेषण"
        microModule="M10.06"
        description="Student engagement metrics and intervention alerts."
        actions={<div className="flex gap-2"><CanCreate resource="learningMetrics"><Button variant="outline" onClick={() => { setEditingMetric(undefined); setMetricOpen(true); }}><Plus className="h-4 w-4" /> New Metric</Button></CanCreate><CanCreate resource="learningMetrics"><Button onClick={() => { setEditingAlert(undefined); setAlertOpen(true); }}><Plus className="h-4 w-4" /> New Alert</Button></CanCreate></div>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><TrendingUp className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Metrics</p><p className="text-lg font-bold">{metrics.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingUp className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">High Risk</p><p className="text-lg font-bold">{highRiskCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><TrendingUp className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Alerts</p><p className="text-lg font-bold">{openAlerts}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search metrics or alerts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="metrics">
        <TabsList><TabsTrigger value="metrics">Metrics</TabsTrigger><TabsTrigger value="alerts">Alerts</TabsTrigger></TabsList>

        <TabsContent value="metrics" className="mt-4">
          {metrics.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Logins</TableHead><TableHead>Content</TableHead><TableHead>Assign %</TableHead><TableHead>Quiz Avg</TableHead><TableHead>Attendance</TableHead><TableHead>Risk</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMetrics.map((m) => (
              <TableRow key={m.id} className="group">
                <TableCell className="pl-5 font-medium">{m.studentName}</TableCell>
                <TableCell><span className="text-sm font-mono">{m.loginCount}</span></TableCell>
                <TableCell><span className="text-sm font-mono">{m.contentAccessed}</span></TableCell>
                <TableCell><span className="text-sm font-mono">{m.assignmentCompletion}%</span></TableCell>
                <TableCell><span className="text-sm font-mono">{m.quizAverage}</span></TableCell>
                <TableCell><span className="text-sm font-mono">{m.attendanceRate}%</span></TableCell>
                <TableCell><Badge variant={riskLevelVariant[m.riskLevel] ?? "secondary"} className="capitalize">{m.riskLevel}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="learningMetrics" onEdit={() => { setEditingMetric(m); setMetricOpen(true); }} onDelete={() => deleteMetric.mutate(m.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          {alerts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Severity</TableHead><TableHead>Message</TableHead><TableHead>Assigned To</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAlerts.map((a) => (
              <TableRow key={a.id} className="group">
                <TableCell className="pl-5 font-medium">{a.studentName}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{a.alertType.replace(/_/g, " ")}</Badge></TableCell>
                <TableCell><Badge variant={severityVariant[a.severity] ?? "secondary"} className="capitalize">{a.severity}</Badge></TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{a.message}</TableCell>
                <TableCell className="text-sm">{a.assignedTo}</TableCell>
                <TableCell><Badge variant={alertStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="learningMetrics" onEdit={() => { setEditingAlert(a); setAlertOpen(true); }} onDelete={() => deleteAlert.mutate(a.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <LearningMetricFormDialog open={metricOpen} onOpenChange={setMetricOpen} editing={editingMetric} />
      <InterventionAlertFormDialog open={alertOpen} onOpenChange={setAlertOpen} editing={editingAlert} />
    </div>
  );
}
