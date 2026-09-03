import { useMemo, useState } from "react";
import { Receipt, Wallet, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PayrollRunFormDialog } from "@/pages/payroll-run-form-dialog";
import { PayslipFormDialog } from "@/pages/payslip-form-dialog";
import { usePayrollRuns, usePayslips, useDeletePayrollRun, useDeletePayslip } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { PayrollRun, Payslip } from "@/lib/types";

const payrollStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive" | "purple"> = {
  draft: "secondary",
  computed: "info",
  approved: "success",
  paid: "purple",
  cancelled: "destructive",
};

const payslipStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  issued: "info",
  paid: "success",
};

export default function PayrollPage() {
  const payrollRuns = usePayrollRuns();
  const payslips = usePayslips();
  const deleteRun = useDeletePayrollRun();
  const deletePayslip = useDeletePayslip();
  const [q, setQ] = useState("");
  const [runOpen, setRunOpen] = useState(false);
  const [editingRun, setEditingRun] = useState<PayrollRun | undefined>();
  const [slipOpen, setSlipOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState<Payslip | undefined>();

  const filteredRuns = useMemo(() => {
    let list = payrollRuns.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => `${r.month}/${r.year}`.includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [payrollRuns.data, q]);

  const filteredSlips = useMemo(() => {
    let list = payslips.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.staffName.toLowerCase().includes(s) || p.status.toLowerCase().includes(s) || (p.payrollMonth ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [payslips.data, q]);

  const totalAmount = (payrollRuns.data ?? []).reduce((sum, r) => sum + r.totalAmount, 0);
  const paidRuns = (payrollRuns.data ?? []).filter((r) => r.status === "paid").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Receipt} title="Payroll" titleNe="तलब" microModule="M13.07/M13.08/M13.09" description="Payroll runs, payslips and salary disbursements." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingRun(undefined); setRunOpen(true); }}><Plus className="h-4 w-4" /> New Payroll Run</Button><Button onClick={() => { setEditingSlip(undefined); setSlipOpen(true); }}><Plus className="h-4 w-4" /> New Payslip</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Payroll Runs</p><p className="text-lg font-bold">{payrollRuns.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Paid Runs</p><p className="text-lg font-bold">{paidRuns}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Payslips</p><p className="text-lg font-bold">{payslips.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Amount</p><p className="text-lg font-bold">{totalAmount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search payroll or payslips…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="runs">
        <TabsList><TabsTrigger value="runs">Payroll Runs</TabsTrigger><TabsTrigger value="payslips">Payslips</TabsTrigger></TabsList>

        <TabsContent value="runs" className="mt-4">
          {payrollRuns.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Month / Year</TableHead><TableHead>Status</TableHead><TableHead>Total Amount</TableHead><TableHead>Run On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRuns.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{r.month}/{r.year}</Badge></TableCell><TableCell><Badge variant={payrollStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.totalAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.runOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingRun(r); setRunOpen(true); }}><Pencil /> Edit run</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRun.mutate(r)}><Trash2 /> Delete run</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="payslips" className="mt-4">
          {payslips.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Payroll</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSlips.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.staffName}</TableCell><TableCell><Badge variant="secondary">{p.payrollMonth ?? p.payrollRunId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{p.gross.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono text-muted-foreground">{p.deductions.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono font-semibold">{p.net.toLocaleString()}</span></TableCell><TableCell><Badge variant={payslipStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingSlip(p); setSlipOpen(true); }}><Pencil /> Edit payslip</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePayslip.mutate(p)}><Trash2 /> Delete payslip</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <PayrollRunFormDialog open={runOpen} onOpenChange={setRunOpen} payrollRun={editingRun} />
      <PayslipFormDialog open={slipOpen} onOpenChange={setSlipOpen} payslip={editingSlip} />
    </div>
  );
}
