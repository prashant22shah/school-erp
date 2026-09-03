import { useMemo, useState } from "react";
import { Scale, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useBankReconciliations, useDeleteBankReconciliation } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { BankReconciliation } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  in_progress: "info",
  completed: "success",
  discrepancy: "warning",
};

export default function BankReconciliationPage() {
  const query = useBankReconciliations();
  const del = useDeleteBankReconciliation();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<BankReconciliation | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.bankName.toLowerCase().includes(s) || b.statementDate.toLowerCase().includes(s) || b.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const completed = (query.data ?? []).filter((b) => b.status === "completed").length;
  const inProgress = (query.data ?? []).filter((b) => b.status === "in_progress").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Scale} title="Bank Reconciliation" titleNe="बैंक समाधान" microModule="M12.18" description="Match bank statements against book balances and resolve discrepancies." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="bankReconciliation">New Reconciliation</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total reconciliations</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">In Progress</p><p className="text-lg font-bold">{inProgress}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search reconciliations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Bank</TableHead><TableHead>Statement Date</TableHead><TableHead>Statement Balance</TableHead><TableHead>Book Balance</TableHead><TableHead>Difference</TableHead><TableHead>Matched</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5"><span className="text-sm font-medium">{b.bankName}</span></TableCell><TableCell><span className="text-sm">{fmtDate(b.statementDate)}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {b.statementBalance.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {b.bookBalance.toLocaleString()}</span></TableCell><TableCell><span className={`text-sm font-mono ${b.difference !== 0 ? "text-destructive font-semibold" : ""}`}>NPR {b.difference.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{b.matchedEntries} / {b.matchedEntries + b.unmatchedEntries}</span></TableCell><TableCell><Badge variant={statusVariant[b.status] ?? "secondary"} className="capitalize">{b.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="bankReconciliation" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
