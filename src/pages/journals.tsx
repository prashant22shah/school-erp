import { useMemo, useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { JournalEntryFormDialog } from "@/pages/journal-entry-form-dialog";
import { useJournalEntries, useDeleteJournalEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { JournalEntry } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  posted: "success",
  reversed: "warning",
};

export default function JournalsPage() {
  const query = useJournalEntries();
  const del = useDeleteJournalEntry();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JournalEntry | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((j) => j.entryNo.toLowerCase().includes(s) || j.description.toLowerCase().includes(s) || (j.fiscalYearName ?? "").toLowerCase().includes(s) || j.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const posted = (query.data ?? []).filter((j) => j.status === "posted").length;
  const draft = (query.data ?? []).filter((j) => j.status === "draft").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={BookOpen} title="Journal Entries" titleNe="जर्नल प्रविष्टि" microModule="M12.03/M12.04" description="Double-entry journals, posting and reversals." actions={<CanCreate resource="journalEntries"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Journal Entry</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total entries</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Posted</p><p className="text-lg font-bold">{posted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{draft}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search journals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Entry No</TableHead><TableHead>Fiscal Year</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Debit / Credit</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((j) => (<TableRow key={j.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{j.entryNo}</code></TableCell><TableCell><Badge variant="secondary">{j.fiscalYearName ?? j.fiscalYearId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(j.entryDate)}</span></TableCell><TableCell><span className="line-clamp-1 max-w-[260px] text-sm text-muted-foreground">{j.description}</span></TableCell><TableCell><span className="text-sm font-mono">{j.totalDebit.toLocaleString()} / {j.totalCredit.toLocaleString()}</span></TableCell><TableCell><Badge variant={statusVariant[j.status] ?? "secondary"} className="capitalize">{j.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="journalEntries" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <JournalEntryFormDialog open={open} onOpenChange={setOpen} entry={editing} />
    </div>
  );
}
