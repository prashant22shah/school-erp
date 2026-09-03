import { useMemo, useState } from "react";
import { Receipt, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useAccountsReceivable, useDeleteAccountsReceivable } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { AccountsReceivable } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  current: "success",
  overdue: "warning",
  written_off: "secondary",
  in_collection: "info",
};

export default function AccountsReceivablePage() {
  const query = useAccountsReceivable();
  const del = useDeleteAccountsReceivable();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AccountsReceivable | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.invoiceNumber.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const totalAR = (query.data ?? []).reduce((s, r) => s + r.balanceAmount, 0);
  const current = (query.data ?? []).filter((r) => r.status === "current").length;
  const overdue = (query.data ?? []).filter((r) => r.status === "overdue").length;
  const writtenOff = (query.data ?? []).filter((r) => r.status === "written_off").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Receipt} title="Accounts Receivable" titleNe="बक्सा खाता" microModule="M12.08" description="Outstanding student balances, aging and collection tracking." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="accountsReceivable">New Entry</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total AR</p><p className="text-lg font-bold">NPR {totalAR.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Current</p><p className="text-lg font-bold">{current}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Overdue</p><p className="text-lg font-bold">{overdue}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Written Off</p><p className="text-lg font-bold">{writtenOff}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search receivables…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="receivables">
        <TabsList><TabsTrigger value="receivables">Receivables</TabsTrigger><TabsTrigger value="aging">Aging</TabsTrigger><TabsTrigger value="collections">Collections</TabsTrigger></TabsList>

        <TabsContent value="receivables" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Invoice</TableHead><TableHead>Total</TableHead><TableHead>Balance</TableHead><TableHead>Due Date</TableHead><TableHead>Aging Days</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.invoiceNumber}</code></TableCell><TableCell><span className="text-sm font-mono">{r.totalAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{r.balanceAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.dueDate)}</span></TableCell><TableCell><span className="text-sm">{r.agingDays}</span></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="accountsReceivable" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="aging" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">0-30 days</p><p className="text-lg font-bold">{(query.data ?? []).filter((r) => r.agingDays <= 30 && r.status !== "written_off").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">31-60 days</p><p className="text-lg font-bold">{(query.data ?? []).filter((r) => r.agingDays > 30 && r.agingDays <= 60).length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">61-90 days</p><p className="text-lg font-bold">{(query.data ?? []).filter((r) => r.agingDays > 60 && r.agingDays <= 90).length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">90+ days</p><p className="text-lg font-bold">{(query.data ?? []).filter((r) => r.agingDays > 90).length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Collection actions and dunning history are managed in the Dunning & Collections module (M12.13).</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
