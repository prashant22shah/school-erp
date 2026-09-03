import { useMemo, useState } from "react";
import { ClipboardCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MarkEntryFormDialog } from "@/pages/mark-entry-form-dialog";
import { useMarkEntries, useDeleteMarkEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { MarkEntry } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", submitted: "info", verified: "success", published: "default",
};

export default function MarksPage() {
  const entries = useMarkEntries();
  const del = useDeleteMarkEntry();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MarkEntry | undefined>();

  const filtered = useMemo(() => {
    let list = entries.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => (m.studentName ?? "").toLowerCase().includes(s) || (m.subjectName ?? "").toLowerCase().includes(s) || m.enteredBy.toLowerCase().includes(s) || m.status.toLowerCase().includes(s)); }
    return list;
  }, [entries.data, q]);

  const verified = (entries.data ?? []).filter((m) => m.status === "verified" || m.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={ClipboardCheck} title="Mark Entry" titleNe="अङ्क प्रविष्टि" microModule="M08.05" description="Subject-wise mark capture, grade derivation and publishing." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Mark Entry</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total entries</p><p className="text-lg font-bold">{entries.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Verified / Published</p><p className="text-lg font-bold">{verified}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{(entries.data ?? []).filter((m) => m.status === "draft").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search marks…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {entries.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Subject</TableHead><TableHead>Marks</TableHead><TableHead>Grade</TableHead><TableHead>Entered By</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5 font-medium">{m.studentName ?? m.registrationId}</TableCell><TableCell><Badge variant="secondary">{m.subjectName ?? m.subjectRef}</Badge></TableCell><TableCell><span className="text-sm font-mono">{m.marksObtained}/{m.maxMarks}</span></TableCell><TableCell><Badge variant="secondary">{m.grade ?? "—"}</Badge></TableCell><TableCell><span className="text-sm">{m.enteredBy}</span></TableCell><TableCell><Badge variant={statusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(m); setOpen(true); }}><Pencil /> Edit entry</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(m)}><Trash2 /> Delete entry</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <MarkEntryFormDialog open={open} onOpenChange={setOpen} entry={editing} />
    </div>
  );
}
