import { useMemo, useState } from "react";
import { Receipt, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PayslipFormDialog } from "@/pages/payslip-form-dialog";
import { usePayslips, useDeletePayslip } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Payslip } from "@/lib/types";

const payslipStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  issued: "info",
  paid: "success",
};

export default function PayslipManagementPage() {
  const payslips = usePayslips();
  const deletePayslip = useDeletePayslip();
  const [q, setQ] = useState("");
  const [slipOpen, setSlipOpen] = useState(false);
  const [editingSlip, setEditingSlip] = useState<Payslip | undefined>();

  const filteredSlips = useMemo(() => {
    let list = payslips.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.staffName.toLowerCase().includes(s) || p.status.toLowerCase().includes(s) || (p.payrollMonth ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [payslips.data, q]);

  const totalPayslips = payslips.data?.length ?? 0;
  const generatedCount = (payslips.data ?? []).filter((p) => p.status === "issued").length;
  const disbursedCount = (payslips.data ?? []).filter((p) => p.status === "paid").length;
  const pendingCount = (payslips.data ?? []).filter((p) => p.status === "draft").length;

  const disbursedSlips = (payslips.data ?? []).filter((p) => p.status === "paid");

  const historyRecords = useMemo(() => {
    return disbursedSlips.map((p) => ({
      id: p.id,
      staffName: p.staffName,
      period: p.payrollMonth ?? "—",
      amount: p.net,
      disbursedOn: p.updatedOn,
      status: "completed",
    }));
  }, [disbursedSlips]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Receipt} title="Payslips & Disbursement" titleNe="तलबपत्र" microModule="M13.09" description="Generate payslips, manage disbursements and view history." actions={<Button onClick={() => { setEditingSlip(undefined); setSlipOpen(true); }}><CanCreate resource="payslips">New Payslip</CanCreate></Button>} />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Payslips</p><p className="text-lg font-bold">{totalPayslips}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Generated</p><p className="text-lg font-bold">{generatedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Disbursed</p><p className="text-lg font-bold">{disbursedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pendingCount}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search payslips…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="payslips">
        <TabsList><TabsTrigger value="payslips">Payslips</TabsTrigger><TabsTrigger value="disbursement">Disbursement</TabsTrigger><TabsTrigger value="history">History</TabsTrigger></TabsList>

        <TabsContent value="payslips" className="mt-4">
          {payslips.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Period</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSlips.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.staffName}</TableCell><TableCell><Badge variant="secondary">{p.payrollMonth ?? "—"}</Badge></TableCell><TableCell><span className="text-sm font-mono">{p.gross.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono text-muted-foreground">{p.deductions.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono font-semibold">{p.net.toLocaleString()}</span></TableCell><TableCell><Badge variant={payslipStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="payslips" /></TableCell></TableRow>))}{filteredSlips.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No payslips found.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="disbursement" className="mt-4">
          <div className="space-y-4">
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Bank Transfer Batches</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Staff Count</TableHead><TableHead>Total Amount</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{disbursedSlips.length > 0 ? (<TableRow><TableCell className="pl-5"><Badge variant="secondary">{disbursedSlips[0].payrollMonth ?? "—"}</Badge></TableCell><TableCell><span className="text-sm font-mono">{disbursedSlips.length}</span></TableCell><TableCell><span className="text-sm font-mono">{disbursedSlips.reduce((sum, p) => sum + p.net, 0).toLocaleString()}</span></TableCell><TableCell><Badge variant="success">Completed</Badge></TableCell><TableCell className="pr-5" /></TableRow>) : (<TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No disbursement batches available.</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Pending Disbursements</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Net Amount</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{(payslips.data ?? []).filter((p) => p.status === "issued").map((p) => (<TableRow key={p.id}><TableCell className="pl-5 font-medium">{p.staffName}</TableCell><TableCell><span className="text-sm font-mono">{p.net.toLocaleString()}</span></TableCell><TableCell className="pr-5" /></TableRow>))}{(payslips.data ?? []).filter((p) => p.status === "issued").length === 0 && <TableRow><TableCell colSpan={2} className="py-8 text-center text-sm text-muted-foreground">No pending disbursements.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {payslips.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Period</TableHead><TableHead>Amount</TableHead><TableHead>Disbursed On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{historyRecords.map((h) => (<TableRow key={h.id}><TableCell className="pl-5 font-medium">{h.staffName}</TableCell><TableCell><Badge variant="secondary">{h.period}</Badge></TableCell><TableCell><span className="text-sm font-mono">{h.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(h.disbursedOn)}</span></TableCell><TableCell><Badge variant="success">Completed</Badge></TableCell><TableCell className="pr-5" /></TableRow>))}{historyRecords.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">No disbursement history.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <PayslipFormDialog open={slipOpen} onOpenChange={setSlipOpen} payslip={editingSlip} />
    </div>
  );
}
