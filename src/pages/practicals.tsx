import { useMemo, useState } from "react";
import { FlaskConical, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PracticalExamFormDialog } from "@/pages/practical-exam-form-dialog";
import { usePracticalExams, useDeletePracticalExam } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { PracticalExam } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  scheduled: "info", completed: "success", absent: "warning", cancelled: "secondary",
};

export default function PracticalsPage() {
  const practicals = usePracticalExams();
  const del = useDeletePracticalExam();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PracticalExam | undefined>();

  const filtered = useMemo(() => {
    let list = practicals.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => (p.subjectName ?? "").toLowerCase().includes(s) || p.type.toLowerCase().includes(s) || (p.venue ?? "").toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [practicals.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader icon={FlaskConical} title="Practical Examinations" titleNe="प्रयोगात्मक परीक्षा" microModule="M08.07" description="Practical, project and viva scheduling." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Practical</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FlaskConical className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total practicals</p><p className="text-lg font-bold">{practicals.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FlaskConical className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{(practicals.data ?? []).filter((p) => p.status === "completed").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FlaskConical className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Scheduled</p><p className="text-lg font-bold">{(practicals.data ?? []).filter((p) => p.status === "scheduled").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search practicals…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {practicals.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Subject</TableHead><TableHead>Type</TableHead><TableHead>Scheduled On</TableHead><TableHead>Venue</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{p.subjectName ?? p.subjectRef}</Badge></TableCell><TableCell><Badge variant="secondary" className="capitalize">{p.type}</Badge></TableCell><TableCell><span className="text-sm font-mono">{p.scheduledOn.replace("T"," ")}</span></TableCell><TableCell><span className="text-sm text-muted-foreground">{p.venue ?? "—"}</span></TableCell><TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(p); setOpen(true); }}><Pencil /> Edit practical</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(p)}><Trash2 /> Delete practical</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <PracticalExamFormDialog open={open} onOpenChange={setOpen} practical={editing} />
    </div>
  );
}
