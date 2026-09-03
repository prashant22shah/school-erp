import { useMemo, useState } from "react";
import { CalendarClock, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useAccrualEntries, useDeleteAccrualEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { AccrualEntry } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning",
  reversed: "secondary",
  posted: "success",
};

export default function AccrualsDeferralsPage() {
  const query = useAccrualEntries();
  const del = useDeleteAccrualEntry();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AccrualEntry | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.description.toLowerCase().includes(s) || a.debitAccount.toLowerCase().includes(s) || a.creditAccount.toLowerCase().includes(s) || a.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const pending = (query.data ?? []).filter((a) => a.status === "pending").length;
  const posted = (query.data ?? []).filter((a) => a.status === "posted").length;
  const totalAmount = (query.data ?? []).reduce((s, a) => s + a.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarClock} title="Accruals & Deferrals" titleNe="उत्क्रमण" microModule="M12.21" description="Accrual entries, deferral schedules and period adjustments." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="accruals">New Accrual</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Entries</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Posted</p><p className="text-lg font-bold">{posted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CalendarClock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Amount</p><p className="text-lg font-bold">NPR {totalAmount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search accruals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="entries">
        <TabsList><TabsTrigger value="entries">Entries</TabsTrigger><TabsTrigger value="pending">Pending</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="entries" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Description</TableHead><TableHead>Debit</TableHead><TableHead>Credit</TableHead><TableHead>Amount</TableHead><TableHead>Reverses On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.description}</TableCell><TableCell><span className="text-sm">{a.debitAccount}</span></TableCell><TableCell><span className="text-sm">{a.creditAccount}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {a.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.reversesOn)}</span></TableCell><TableCell><Badge variant={statusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="accruals" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{pending} accrual entries are pending reversal. They will be automatically reversed on their scheduled dates.</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Pending Amount</p><p className="text-lg font-bold">NPR {(query.data ?? []).filter((a) => a.status === "pending").reduce((s, a) => s + a.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Posted Amount</p><p className="text-lg font-bold">NPR {(query.data ?? []).filter((a) => a.status === "posted").reduce((s, a) => s + a.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Reversed Amount</p><p className="text-lg font-bold">NPR {(query.data ?? []).filter((a) => a.status === "reversed").reduce((s, a) => s + a.amount, 0).toLocaleString()}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
