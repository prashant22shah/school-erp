import { useMemo, useState } from "react";
import { PieChart, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useCommitmentRecords, useDeleteCommitmentRecord } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { CommitmentRecord } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pledged: "info",
  received: "success",
  cancelled: "secondary",
};

export default function BudgetingCommitmentsPage() {
  const query = useCommitmentRecords();
  const del = useDeleteCommitmentRecord();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<CommitmentRecord | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.donorName.toLowerCase().includes(s) || c.fundName.toLowerCase().includes(s) || c.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const pledged = (query.data ?? []).filter((c) => c.status === "pledged").length;
  const received = (query.data ?? []).filter((c) => c.status === "received").length;
  const totalAmount = (query.data ?? []).reduce((s, c) => s + c.amount, 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={PieChart} title="Budgeting & Commitments" titleNe="बजेट" microModule="M12.19" description="Donor commitments, fund pledges and budget tracking." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Commitment</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Commitments</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pledged</p><p className="text-lg font-bold">{pledged}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Received</p><p className="text-lg font-bold">{received}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><PieChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Value</p><p className="text-lg font-bold">NPR {totalAmount.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search commitments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="commitments">
        <TabsList><TabsTrigger value="commitments">Commitments</TabsTrigger><TabsTrigger value="funds">Funds</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="commitments" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Donor</TableHead><TableHead>Fund</TableHead><TableHead>Amount</TableHead><TableHead>Pledge Date</TableHead><TableHead>Expected</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.donorName}</TableCell><TableCell><Badge variant="secondary">{c.fundName}</Badge></TableCell><TableCell><span className="text-sm font-mono">NPR {c.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.pledgeDate)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.expectedDate)}</span></TableCell><TableCell><Badge variant={statusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(c); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(c)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="funds" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Fund accounts are managed in Fund Accounting (M12.22).</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Pledged Amount</p><p className="text-lg font-bold">NPR {(query.data ?? []).filter((c) => c.status === "pledged").reduce((s, c) => s + c.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Received Amount</p><p className="text-lg font-bold">NPR {(query.data ?? []).filter((c) => c.status === "received").reduce((s, c) => s + c.amount, 0).toLocaleString()}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Collection Rate</p><p className="text-lg font-bold">{totalAmount > 0 ? Math.round(((query.data ?? []).filter((c) => c.status === "received").reduce((s, c) => s + c.amount, 0) / totalAmount) * 100) : 0}%</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
