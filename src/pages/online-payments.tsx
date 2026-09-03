import { useMemo, useState } from "react";
import { CreditCard, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useOnlinePaymentTransactions, useDeleteOnlinePaymentTransaction } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { OnlinePaymentTransaction } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  processing: "info",
  completed: "success",
  failed: "warning",
  refunded: "secondary",
};

const gatewayVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  esewa: "success",
  khalti: "purple",
  imepay: "info",
  bank_transfer: "secondary",
  cod: "warning",
};

export default function OnlinePaymentsPage() {
  const query = useOnlinePaymentTransactions();
  const del = useDeleteOnlinePaymentTransaction();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<OnlinePaymentTransaction | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.gateway.toLowerCase().includes(s) || p.transactionRef.toLowerCase().includes(s) || p.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const completed = (query.data ?? []).filter((p) => p.status === "completed").length;
  const pending = (query.data ?? []).filter((p) => p.status === "pending" || p.status === "processing").length;
  const failed = (query.data ?? []).filter((p) => p.status === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={CreditCard} title="Online Payments" titleNe="अनलाइन भुक्तानी" microModule="M12.11" description="Digital payment gateway integration, eSewa, Khalti and IME Pay." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Transaction</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CreditCard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Transactions</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CreditCard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CreditCard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-rose-100 p-2 text-rose-600"><CreditCard className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Failed</p><p className="text-lg font-bold">{failed}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search transactions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="transactions">
        <TabsList><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="gateways">Gateways</TabsTrigger><TabsTrigger value="reconciliation">Reconciliation</TabsTrigger></TabsList>

        <TabsContent value="transactions" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Amount</TableHead><TableHead>Gateway</TableHead><TableHead>Ref</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.studentName}</TableCell><TableCell><span className="text-sm font-mono">NPR {p.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant={gatewayVariant[p.gateway] ?? "secondary"} className="capitalize">{p.gateway.replace("_", " ")}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.transactionRef}</code></TableCell><TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(p.initiatedAt)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(p); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(p)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="gateways" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">eSewa</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.gateway === "esewa").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Khalti</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.gateway === "khalti").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">IME Pay</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.gateway === "imepay").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="reconciliation" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Payment reconciliation with bank statements is handled in Bank Reconciliation (M12.18).</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
