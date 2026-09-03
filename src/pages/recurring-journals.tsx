import { useMemo, useState } from "react";
import { Repeat, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useRecurringJournals, useDeleteRecurringJournal } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { RecurringJournal } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  paused: "warning",
  completed: "info",
  cancelled: "secondary",
};

export default function RecurringJournalsPage() {
  const query = useRecurringJournals();
  const del = useDeleteRecurringJournal();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<RecurringJournal | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(s) || r.description.toLowerCase().includes(s) || r.frequency.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const active = (query.data ?? []).filter((r) => r.status === "active").length;
  const paused = (query.data ?? []).filter((r) => r.status === "paused").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Repeat} title="Recurring Journals" titleNe="आवर्ती जर्नल" microModule="M12.04" description="Automated periodic journal entries for depreciation, accruals and allocations." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Recurring Journal</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Repeat className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total templates</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Repeat className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Repeat className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Paused</p><p className="text-lg font-bold">{paused}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search recurring journals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Accounts</TableHead><TableHead>Amount</TableHead><TableHead>Frequency</TableHead><TableHead>Next Run</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><span className="text-sm font-medium">{r.name}</span><p className="text-xs text-muted-foreground line-clamp-1 max-w-[220px]">{r.description}</p></TableCell><TableCell><span className="text-sm">{r.debitAccount} → {r.creditAccount}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {r.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant="info" className="capitalize">{r.frequency}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.nextRunDate)}</span></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(r); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(r)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
