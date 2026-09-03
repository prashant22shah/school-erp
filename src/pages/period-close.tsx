import { useMemo, useState } from "react";
import { Lock, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { usePeriodCloseChecklists, useDeletePeriodCloseChecklist } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { PeriodCloseChecklist } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  open: "info",
  closing: "warning",
  closed: "success",
};

export default function PeriodClosePage() {
  const query = usePeriodCloseChecklists();
  const del = useDeletePeriodCloseChecklist();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<PeriodCloseChecklist | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.periodName.toLowerCase().includes(s) || p.fiscalYearName.toLowerCase().includes(s) || p.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const closed = (query.data ?? []).filter((p) => p.status === "closed").length;
  const closing = (query.data ?? []).filter((p) => p.status === "closing").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Lock} title="Period Close" titleNe="अवधि बन्द" microModule="M12.23" description="Period-end closing checklists, reconciliation verification and audit readiness." actions={<CanCreate resource="periodClose"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Checklist</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Lock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Periods</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Lock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Closed</p><p className="text-lg font-bold">{closed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Lock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Closing</p><p className="text-lg font-bold">{closing}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search periods…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="checklists">
        <TabsList><TabsTrigger value="checklists">Checklists</TabsTrigger><TabsTrigger value="open">Open</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="checklists" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Period</TableHead><TableHead>Fiscal Year</TableHead><TableHead>Journals</TableHead><TableHead>Posted</TableHead><TableHead>Reconciled</TableHead><TableHead>Accruals</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.periodName}</TableCell><TableCell><span className="text-sm">{p.fiscalYearName}</span></TableCell><TableCell><span className="text-sm">{p.totalJournalEntries}</span></TableCell><TableCell><span className="text-sm">{p.postedEntries}</span></TableCell><TableCell><Badge variant={p.reconciliationsComplete ? "success" : "warning"}>{p.reconciliationsComplete ? "Yes" : "No"}</Badge></TableCell><TableCell><Badge variant={p.accrualsComplete ? "success" : "warning"}>{p.accrualsComplete ? "Yes" : "No"}</Badge></TableCell><TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="periodClose" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="open" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{total - closed} period(s) are still open or in closing process. Complete all checklist items before closing.</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Total Journal Entries</p><p className="text-lg font-bold">{(query.data ?? []).reduce((s, p) => s + p.totalJournalEntries, 0)}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Total Posted</p><p className="text-lg font-bold">{(query.data ?? []).reduce((s, p) => s + p.postedEntries, 0)}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">All Reconciled</p><p className="text-lg font-bold">{(query.data ?? []).filter((p) => p.reconciliationsComplete).length}/{total}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
