import { useMemo, useState } from "react";
import { FilePenLine, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AttendanceCorrectionFormDialog } from "@/pages/attendance-correction-form-dialog";
import { useAttendanceCorrections, useDeleteAttendanceCorrection } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { AttendanceCorrection } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", pending: "warning", approved: "success", rejected: "warning",
};

export default function AttendanceCorrectionsPage() {
  const corrections = useAttendanceCorrections();
  const del = useDeleteAttendanceCorrection();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceCorrection | undefined>();

  const filtered = useMemo(() => {
    let list = corrections.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.reason.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [corrections.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={FilePenLine} title="Attendance Corrections" titleNe="सच्याउने" microModule="M07.04" description="Audited correction requests with approval trail." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Correction</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{corrections.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{(corrections.data ?? []).filter((c) => c.status === "pending").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FilePenLine className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{(corrections.data ?? []).filter((c) => c.status === "approved").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search corrections…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {corrections.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>From → To</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Approval</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.studentName}</TableCell><TableCell><span className="text-sm"><Badge variant="secondary">{c.fromStatus}</Badge> → <Badge variant="secondary">{c.toStatus}</Badge></span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{c.reason}</span></TableCell><TableCell><Badge variant={statusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="text-sm">{c.approval ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(c); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(c)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <AttendanceCorrectionFormDialog open={open} onOpenChange={setOpen} correction={editing} />
    </div>
  );
}
