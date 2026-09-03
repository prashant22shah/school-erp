import { useMemo, useState } from "react";
import { Banknote, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useDisbursementEntries, useDeleteDisbursementEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { DisbursementEntry } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "info",
  approved: "success",
  processed: "default",
  cancelled: "secondary",
};

const methodLabel: Record<string, string> = {
  bank_transfer: "Bank Transfer",
  cheque: "Cheque",
  cash: "Cash",
  online: "Online",
};

export default function DisbursementsPage() {
  const query = useDisbursementEntries();
  const del = useDeleteDisbursementEntry();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<DisbursementEntry | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((d) => d.vendorName.toLowerCase().includes(s) || d.billNumber.toLowerCase().includes(s) || d.method.toLowerCase().includes(s) || d.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const totalAmount = (query.data ?? []).reduce((sum, d) => sum + d.amount, 0);
  const processed = (query.data ?? []).filter((d) => d.status === "processed").length;
  const pending = (query.data ?? []).filter((d) => d.status === "pending" || d.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Banknote} title="Disbursements" titleNe="वितरण" microModule="M12.16" description="Vendor payment processing, cheque management and disbursement tracking." actions={<CanCreate resource="disbursements"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Disbursement</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Banknote className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total entries</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Banknote className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total amount</p><p className="text-lg font-bold">NPR {totalAmount.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Banknote className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Processed / Pending</p><p className="text-lg font-bold">{processed} / {pending}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search disbursements…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vendor</TableHead><TableHead>Bill No</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Bank Account</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5"><span className="text-sm font-medium">{d.vendorName}</span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{d.billNumber}</code></TableCell><TableCell><span className="text-sm font-mono">NPR {d.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant="info">{methodLabel[d.method] ?? d.method}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{d.bankAccount}</span></TableCell><TableCell><Badge variant={statusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="disbursements" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
