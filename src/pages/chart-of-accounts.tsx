import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useChartOfAccounts, useDeleteChartOfAccount } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { ChartOfAccount } from "@/lib/types";

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  asset: "info",
  liability: "warning",
  equity: "success",
  revenue: "default",
  expense: "secondary",
};

export default function ChartOfAccountsPage() {
  const query = useChartOfAccounts();
  const del = useDeleteChartOfAccount();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ChartOfAccount | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.code.toLowerCase().includes(s) || c.name.toLowerCase().includes(s) || c.type.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const assets = (query.data ?? []).filter((c) => c.type === "asset").length;
  const liabilities = (query.data ?? []).filter((c) => c.type === "liability").length;
  const expenses = (query.data ?? []).filter((c) => c.type === "expense").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={BookOpen} title="Chart of Accounts" titleNe="खाता चार्ट" microModule="M12.02" description="Account heads, types and grouping for double-entry bookkeeping." actions={<CanCreate resource="chartOfAccounts"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Account</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total accounts</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Assets</p><p className="text-lg font-bold">{assets}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Liabilities</p><p className="text-lg font-bold">{liabilities}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-rose-100 p-2 text-rose-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Expenses</p><p className="text-lg font-bold">{expenses}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search accounts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code></TableCell><TableCell><span className="text-sm font-medium">{c.name}</span></TableCell><TableCell><Badge variant={typeVariant[c.type] ?? "secondary"} className="capitalize">{c.type}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{c.parentId ?? "—"}</span></TableCell><TableCell><Badge variant={c.isActive ? "success" : "secondary"} className="capitalize">{c.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="chartOfAccounts" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
