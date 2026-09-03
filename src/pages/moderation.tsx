import { useMemo, useState } from "react";
import { Scale, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ModerationRecordFormDialog } from "@/pages/moderation-record-form-dialog";
import { useModerationRecords, useDeleteModerationRecord } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { ModerationRecord } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", approved: "success", rejected: "secondary",
};
const actionVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  scaled: "info", grace: "success", remarked: "warning", no_change: "secondary",
};

export default function ModerationPage() {
  const records = useModerationRecords();
  const del = useDeleteModerationRecord();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ModerationRecord | undefined>();

  const filtered = useMemo(() => {
    let list = records.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.action.toLowerCase().includes(s) || m.reason.toLowerCase().includes(s) || m.status.toLowerCase().includes(s)); }
    return list;
  }, [records.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={Scale} title="Moderation" titleNe="समन्वय" microModule="M08.06" description="Scaling, grace marks and remark decisions." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Moderation</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total records</p><p className="text-lg font-bold">{records.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{(records.data ?? []).filter((r) => r.status === "approved").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Scale className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(records.data ?? []).filter((r) => r.status === "pending").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search moderation…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {records.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Exam</TableHead><TableHead>Subject</TableHead><TableHead>Action</TableHead><TableHead>Reason</TableHead><TableHead>Adjustment</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.examId.slice(0,8)}</code></TableCell><TableCell><Badge variant="secondary">{m.subjectRef}</Badge></TableCell><TableCell><Badge variant={actionVariant[m.action] ?? "secondary"} className="capitalize">{m.action.replace("_"," ")}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[260px] text-sm text-muted-foreground">{m.reason}</span></TableCell><TableCell><span className="text-sm font-mono">{m.adjustment > 0 ? `+${m.adjustment}` : m.adjustment}</span></TableCell><TableCell><Badge variant={statusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(m); setOpen(true); }}><Pencil /> Edit moderation</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(m)}><Trash2 /> Delete moderation</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <ModerationRecordFormDialog open={open} onOpenChange={setOpen} record={editing} />
    </div>
  );
}
