import { useMemo, useState } from "react";
import { Calculator, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PayrollRunFormDialog } from "@/pages/payroll-run-form-dialog";
import { usePayrollRuns, useDeletePayrollRun } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { PayrollRun } from "@/lib/types";

const payrollStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive" | "purple"> = {
  draft: "secondary",
  computed: "info",
  approved: "success",
  paid: "purple",
  cancelled: "destructive",
};

export default function PayrollRulesPage() {
  const payrollRuns = usePayrollRuns();
  const deleteRun = useDeletePayrollRun();
  const [q, setQ] = useState("");
  const [runOpen, setRunOpen] = useState(false);
  const [editingRun, setEditingRun] = useState<PayrollRun | undefined>();

  const filteredRuns = useMemo(() => {
    let list = payrollRuns.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => `${r.month}/${r.year}`.includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [payrollRuns.data, q]);

  const activeRules = 6;
  const lastRunTotal = (payrollRuns.data ?? []).length > 0
    ? (payrollRuns.data ?? []).sort((a, b) => b.runOn.localeCompare(a.runOn))[0].totalAmount
    : 0;
  const pendingReview = (payrollRuns.data ?? []).filter((r) => r.status === "computed").length;
  const approvalsNeeded = (payrollRuns.data ?? []).filter((r) => r.status === "computed" || r.status === "draft").length;

  const earningsComponents = [
    { name: "Basic Salary", label: "मूल तलब", type: "Earning" },
    { name: "Dearness Allowance (DA)", label: "महँगी भत्ता", type: "Earning" },
    { name: "Travel Allowance (TA)", label: "यात्रा भत्ता", type: "Earning" },
    { name: "House Rent Allowance", label: "घर भाडा भत्ता", type: "Earning" },
  ];

  const deductionsComponents = [
    { name: "EPF Contribution", label: "कर्मचारी कोष", type: "Deduction" },
    { name: "Income Tax", label: "आय कर", type: "Deduction" },
    { name: "Social Security", label: "सामाजिक सुरक्षा", type: "Deduction" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={Calculator} title="Payroll Rules & Calculation" titleNe="तलब नियम" microModule="M13.07/M13.08" description="Payroll rules configuration, runs and approval workflow." actions={<Button onClick={() => { setEditingRun(undefined); setRunOpen(true); }}><CanCreate resource="payrollRules">New Payroll Run</CanCreate></Button>} />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Calculator className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Rules</p><p className="text-lg font-bold">{activeRules}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Calculator className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Last Run Total</p><p className="text-lg font-bold">{lastRunTotal.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Calculator className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Review</p><p className="text-lg font-bold">{pendingReview}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Calculator className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approvals Needed</p><p className="text-lg font-bold">{approvalsNeeded}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search payroll runs…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="runs">
        <TabsList><TabsTrigger value="runs">Payroll Runs</TabsTrigger><TabsTrigger value="rules">Rules Configuration</TabsTrigger><TabsTrigger value="review">Review & Approve</TabsTrigger></TabsList>

        <TabsContent value="runs" className="mt-4">
          {payrollRuns.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Status</TableHead><TableHead>Total Amount</TableHead><TableHead>Run On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRuns.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{r.month}/{r.year}</Badge></TableCell><TableCell><Badge variant={payrollStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.totalAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.runOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="payrollRules" /></TableCell></TableRow>))}{filteredRuns.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No payroll runs found.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Earnings Components</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Component</TableHead><TableHead>Label</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{earningsComponents.map((ec) => (<TableRow key={ec.name}><TableCell className="pl-5 font-medium">{ec.name}</TableCell><TableCell><span className="text-sm text-muted-foreground">{ec.label}</span></TableCell><TableCell className="pr-5" /></TableRow>))}</TableBody></Table></CardContent></Card>
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Deductions Components</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Component</TableHead><TableHead>Label</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{deductionsComponents.map((dc) => (<TableRow key={dc.name}><TableCell className="pl-5 font-medium">{dc.name}</TableCell><TableCell><span className="text-sm text-muted-foreground">{dc.label}</span></TableCell><TableCell className="pr-5" /></TableRow>))}</TableBody></Table></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="review" className="mt-4">
          {payrollRuns.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Status</TableHead><TableHead>Total Amount</TableHead><TableHead>Run On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{(payrollRuns.data ?? []).filter((r) => r.status === "computed" || r.status === "draft").map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{r.month}/{r.year}</Badge></TableCell><TableCell><Badge variant={payrollStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.totalAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.runOn)}</span></TableCell><TableCell className="pr-5 text-right"><Button variant="outline" size="sm">Approve</Button></TableCell></TableRow>))}{(payrollRuns.data ?? []).filter((r) => r.status === "computed" || r.status === "draft").length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No payroll runs pending review.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <PayrollRunFormDialog open={runOpen} onOpenChange={setRunOpen} payrollRun={editingRun} />
    </div>
  );
}
