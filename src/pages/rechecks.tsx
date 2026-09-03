import { useMemo, useState } from "react";
import { RefreshCw, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RecheckRequestFormDialog } from "@/pages/recheck-request-form-dialog";
import { useRecheckRequests, useDeleteRecheckRequest } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { RecheckRequest } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "warning", in_review: "info", approved: "success", rejected: "secondary", completed: "default",
};

export default function RechecksPage() {
  const requests = useRecheckRequests();
  const del = useDeleteRecheckRequest();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<RecheckRequest | undefined>();

  const filtered = useMemo(() => {
    let list = requests.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => (r.studentName ?? "").toLowerCase().includes(s) || r.reason.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [requests.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={RefreshCw} title="Recheck Requests" titleNe="पुनः जाँच" microModule="M08.09" description="Re-totalling and re-assessment requests." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Request</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><RefreshCw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total requests</p><p className="text-lg font-bold">{requests.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><RefreshCw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(requests.data ?? []).filter((r) => r.status === "pending" || r.status === "in_review").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><RefreshCw className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{(requests.data ?? []).filter((r) => r.status === "completed").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search recheck requests…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {requests.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Mark Entry</TableHead><TableHead>Subject</TableHead><TableHead>Reason</TableHead><TableHead>Requested On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName ?? "—"}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.markEntryId.slice(0,8)}</code></TableCell><TableCell><Badge variant="secondary">{r.subjectRef}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[240px] text-sm text-muted-foreground">{r.reason}</span></TableCell><TableCell><span className="text-sm font-mono">{r.requestedOn}</span></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status.replace("_"," ")}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(r); setOpen(true); }}><Pencil /> Edit request</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(r)}><Trash2 /> Delete request</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <RecheckRequestFormDialog open={open} onOpenChange={setOpen} request={editing} />
    </div>
  );
}
