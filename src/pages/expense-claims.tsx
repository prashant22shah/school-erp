import { useMemo, useState } from "react";
import { ReceiptIndianRupee, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useExpenseClaims, useDeleteExpenseClaim } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { ExpenseClaim } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  submitted: "info",
  approved: "success",
  rejected: "warning",
  draft: "secondary",
};

export default function ExpenseClaimsPage() {
  const query = useExpenseClaims();
  const del = useDeleteExpenseClaim();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ExpenseClaim | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((e) => e.staffName.toLowerCase().includes(s) || e.category.toLowerCase().includes(s) || e.description?.toLowerCase().includes(s) || e.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const totalAmount = (query.data ?? []).reduce((sum, e) => sum + e.amount, 0);
  const approved = (query.data ?? []).filter((e) => e.status === "approved").length;
  const pending = (query.data ?? []).filter((e) => e.status === "submitted").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={ReceiptIndianRupee} title="Expense Claims" titleNe="खर्च दावी" microModule="M12.15" description="Staff expense submissions, approvals and reimbursements." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="expenseClaims">New Claim</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ReceiptIndianRupee className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total claims</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ReceiptIndianRupee className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total amount</p><p className="text-lg font-bold">NPR {totalAmount.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ReceiptIndianRupee className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending / Approved</p><p className="text-lg font-bold">{pending} / {approved}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search claims…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5"><span className="text-sm font-medium">{e.staffName}</span></TableCell><TableCell><Badge variant="info">{e.category}</Badge></TableCell><TableCell><span className="text-sm font-mono">NPR {e.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(e.claimDate)}</span></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{e.description ?? "—"}</span></TableCell><TableCell><Badge variant={statusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="expenseClaims" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
