import { useMemo, useState } from "react";
import { BarChart3, Search, Plus, DollarSign, Users } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FinanceAnalyticsFormDialog } from "@/pages/finance-analytics-form-dialog";
import { WorkforceAnalyticsFormDialog } from "@/pages/workforce-analytics-form-dialog";
import { useFinanceAnalytics, useWorkforceAnalytics, useDeleteFinanceAnalytics, useDeleteWorkforceAnalytics } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { FinanceAnalytics, WorkforceAnalytics } from "@/lib/types";

export default function FinanceWorkforceAnalyticsPage() {
  const financeQuery = useFinanceAnalytics();
  const workforceQuery = useWorkforceAnalytics();
  const deleteFinance = useDeleteFinanceAnalytics();
  const deleteWorkforce = useDeleteWorkforceAnalytics();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FinanceAnalytics | WorkforceAnalytics | undefined>();
  const [dialogType, setDialogType] = useState<"finance" | "workforce">("finance");

  const filteredFinance = useMemo(() => {
    let list = financeQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.period.toLowerCase().includes(s)); }
    return list;
  }, [financeQuery.data, q]);

  const filteredWorkforce = useMemo(() => {
    let list = workforceQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.period.toLowerCase().includes(s)); }
    return list;
  }, [workforceQuery.data, q]);

  const financeData = financeQuery.data ?? [];
  const workforceData = workforceQuery.data ?? [];
  const totalRevenue = financeData.reduce((sum, f) => sum + f.totalRevenue, 0);
  const avgCollectionRate = financeData.length ? (financeData.reduce((sum, f) => sum + f.feeCollectionRate, 0) / financeData.length).toFixed(1) : "0";
  const totalStaff = workforceData.reduce((max, w) => Math.max(max, w.totalStaff), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BarChart3}
        title="Finance & Workforce Analytics"
        titleNe="वित्त विश्लेषण"
        microModule="M24.06"
        description="Analyze financial performance and workforce metrics across periods."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="financeAnalytics"><Button onClick={() => { setEditing(undefined); setDialogType("finance"); setOpen(true); }}><Plus className="h-4 w-4" /> Add Finance Analytics</Button></CanCreate>
            <CanCreate resource="workforceAnalytics"><Button variant="outline" onClick={() => { setEditing(undefined); setDialogType("workforce"); setOpen(true); }}><Plus className="h-4 w-4" /> Add Workforce Analytics</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Revenue</p><p className="text-lg font-bold">{totalRevenue.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BarChart3 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-lg font-bold">{avgCollectionRate}%</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Staff Count</p><p className="text-lg font-bold">{totalStaff}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search analytics…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="finance">
        <TabsList>
          <TabsTrigger value="finance">Finance Analytics</TabsTrigger>
          <TabsTrigger value="workforce">Workforce Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="finance" className="mt-4">
          {financeQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Revenue</TableHead><TableHead>Expense</TableHead><TableHead>Collection %</TableHead><TableHead>Receivable</TableHead><TableHead>Budget Util %</TableHead><TableHead>Surplus</TableHead><TableHead>Analyzed</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredFinance.map((f) => (<TableRow key={f.id} className="group"><TableCell className="pl-5"><span className="font-medium">{f.period}</span></TableCell><TableCell><span className="text-sm font-mono">{f.totalRevenue.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{f.totalExpense.toLocaleString()}</span></TableCell><TableCell><Badge variant={f.feeCollectionRate >= 80 ? "success" : f.feeCollectionRate >= 50 ? "warning" : "destructive"}>{f.feeCollectionRate.toFixed(1)}%</Badge></TableCell><TableCell><span className="text-sm font-mono">{f.outstandingReceivable.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{f.budgetUtilization.toFixed(1)}%</span></TableCell><TableCell><span className="text-sm font-mono">{f.operatingSurplus.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(f.analyzedOn)}</span></TableCell><TableCell><RowActionMenu resource="financeAnalytics" onEdit={() => { setEditing(f); setDialogType("finance"); setOpen(true); }} onDelete={() => deleteFinance.mutate(f)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="workforce" className="mt-4">
          {workforceQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Total Staff</TableHead><TableHead>Teaching</TableHead><TableHead>Non-Teaching</TableHead><TableHead>Vacancy %</TableHead><TableHead>Attrition %</TableHead><TableHead>Avg Exp</TableHead><TableHead>Training Hrs</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredWorkforce.map((w) => (<TableRow key={w.id} className="group"><TableCell className="pl-5"><span className="font-medium">{w.period}</span></TableCell><TableCell><span className="text-sm font-mono">{w.totalStaff}</span></TableCell><TableCell><span className="text-sm">{w.teachingStaff}</span></TableCell><TableCell><span className="text-sm">{w.nonTeachingStaff}</span></TableCell><TableCell><Badge variant={w.vacancyRate < 10 ? "success" : w.vacancyRate < 20 ? "warning" : "destructive"}>{w.vacancyRate.toFixed(1)}%</Badge></TableCell><TableCell><span className="text-sm">{w.attritionRate.toFixed(1)}%</span></TableCell><TableCell><span className="text-sm">{w.avgExperience.toFixed(1)}y</span></TableCell><TableCell><span className="text-sm">{w.trainingHours.toFixed(0)}</span></TableCell><TableCell><RowActionMenu resource="workforceAnalytics" onEdit={() => { setEditing(w); setDialogType("workforce"); setOpen(true); }} onDelete={() => deleteWorkforce.mutate(w)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <FinanceAnalyticsFormDialog open={open && dialogType === "finance"} onOpenChange={setOpen} editing={editing && "totalRevenue" in editing ? editing : undefined} />
      <WorkforceAnalyticsFormDialog open={open && dialogType === "workforce"} onOpenChange={setOpen} editing={editing && "totalStaff" in editing ? editing : undefined} />
    </div>
  );
}
