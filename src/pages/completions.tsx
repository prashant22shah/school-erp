import { useMemo, useState } from "react";
import { Trophy, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CompletionRecordFormDialog } from "@/pages/completion-record-form-dialog";
import { useCompletionRecords, useDeleteCompletionRecord } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { CompletionRecord } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", completed: "success", withheld: "secondary", certified: "info",
};

export default function CompletionsPage() {
  const records = useCompletionRecords();
  const del = useDeleteCompletionRecord();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CompletionRecord | undefined>();

  const filtered = useMemo(() => {
    let list = records.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.type.toLowerCase().includes(s) || r.status.toLowerCase().includes(s) || r.gradeClassRef.toLowerCase().includes(s)); }
    return list;
  }, [records.data, q]);

  const completed = (records.data ?? []).filter((r) => r.status === "completed" || r.status === "certified").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Trophy} title="Completion Records" titleNe="समापन अभिलेख" microModule="M09.07" description="SEE / NEB and school completion attestations." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Record</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Trophy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total records</p><p className="text-lg font-bold">{records.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Trophy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed / Certified</p><p className="text-lg font-bold">{completed}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Trophy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(records.data ?? []).filter((r) => r.status === "pending").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search completions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {records.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Grade</TableHead><TableHead>Period</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Completed On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.gradeClassRef}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.academicPeriodRef}</code></TableCell><TableCell><Badge variant="secondary">{r.type.replace("_", " ")}</Badge></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.completedOn.slice(0, 10)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(r); setOpen(true); }}><Pencil /> Edit record</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(r)}><Trash2 /> Delete record</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <CompletionRecordFormDialog open={open} onOpenChange={setOpen} record={editing} />
    </div>
  );
}
