import { useMemo, useState } from "react";
import { Wallet, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PaymentFormDialog } from "@/pages/payment-form-dialog";
import { usePayments, useDeletePayment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Payment } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  completed: "success",
  failed: "warning",
  refunded: "secondary",
};

const methodVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  cash: "secondary",
  bank: "info",
  online: "success",
  wallet: "purple",
};

export default function CollectionsPage() {
  const query = usePayments();
  const del = useDeletePayment();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Payment | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => (p.invoiceNo ?? p.invoiceId).toLowerCase().includes(s) || (p.studentName ?? "").toLowerCase().includes(s) || p.method.toLowerCase().includes(s) || p.status.toLowerCase().includes(s) || (p.reference ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const completed = (query.data ?? []).filter((p) => p.status === "completed").length;
  const pending = (query.data ?? []).filter((p) => p.status === "pending").length;
  const totalAmount = (query.data ?? []).filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={Wallet} title="Collections & Payments" titleNe="सङ्कलन" microModule="M12.10/M12.11/M12.13" description="Receipts, payment methods and collection summary." actions={<CanCreate resource="payments"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Payment</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Payments</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Wallet className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Collected Amount</p><p className="text-lg font-bold">{totalAmount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search payments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="payments">
        <TabsList><TabsTrigger value="payments">Payments</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="payments" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Invoice</TableHead><TableHead>Student</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Paid On</TableHead><TableHead>Status</TableHead><TableHead>Reference</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{p.invoiceNo ?? p.invoiceId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm">{p.studentName ?? "—"}</span></TableCell><TableCell><span className="text-sm font-mono">{p.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant={methodVariant[p.method] ?? "secondary"} className="capitalize">{p.method}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.paidOn)}</span></TableCell><TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{p.reference ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="payments" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">By Cash</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.method === "cash" && p.status === "completed").reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">By Bank</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.method === "bank" && p.status === "completed").reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">By Online / Wallet</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => (p.method === "online" || p.method === "wallet") && p.status === "completed").reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Summary aggregates completed payments by method. Use Payments tab to manage individual receipts (M12.13).</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <PaymentFormDialog open={open} onOpenChange={setOpen} payment={editing} />
    </div>
  );
}
