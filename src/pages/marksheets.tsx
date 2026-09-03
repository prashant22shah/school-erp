import { useMemo, useState } from "react";
import { ScrollText, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MarksheetFormDialog } from "@/pages/marksheet-form-dialog";
import { TranscriptFormDialog } from "@/pages/transcript-form-dialog";
import { useMarksheets, useTranscripts, useDeleteMarksheet, useDeleteTranscript } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Marksheet, Transcript } from "@/lib/types";

const marksheetStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", issued: "success", reissued: "info", revoked: "warning",
};
const transcriptStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", issued: "success", reissued: "info",
};

export default function MarksheetsPage() {
  const marksheets = useMarksheets();
  const transcripts = useTranscripts();
  const deleteMarksheet = useDeleteMarksheet();
  const deleteTranscript = useDeleteTranscript();
  const [q, setQ] = useState("");
  const [msOpen, setMsOpen] = useState(false);
  const [editingMs, setEditingMs] = useState<Marksheet | undefined>();
  const [trOpen, setTrOpen] = useState(false);
  const [editingTr, setEditingTr] = useState<Transcript | undefined>();

  const filteredMarksheets = useMemo(() => {
    let list = marksheets.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.studentName.toLowerCase().includes(s) || m.serial.toLowerCase().includes(s) || m.status.toLowerCase().includes(s)); }
    return list;
  }, [marksheets.data, q]);

  const filteredTranscripts = useMemo(() => {
    let list = transcripts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.studentName.toLowerCase().includes(s) || t.fromPeriod.toLowerCase().includes(s) || t.toPeriod.toLowerCase().includes(s) || t.status.toLowerCase().includes(s)); }
    return list;
  }, [transcripts.data, q]);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ScrollText}
        title="Marksheets & Transcripts"
        titleNe="मार्कसिट र ट्रान्सक्रिप्ट"
        microModule="M09.04"
        description="Issue marksheets per exam and consolidated transcripts."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingMs(undefined); setMsOpen(true); }}><Plus className="h-4 w-4" /> New Marksheet</Button>
            <Button onClick={() => { setEditingTr(undefined); setTrOpen(true); }}><Plus className="h-4 w-4" /> New Transcript</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ScrollText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Marksheets</p><p className="text-lg font-bold">{marksheets.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ScrollText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Issued</p><p className="text-lg font-bold">{(marksheets.data ?? []).filter((m) => m.status === "issued").length}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ScrollText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Transcripts</p><p className="text-lg font-bold">{transcripts.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search marksheets, transcripts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="marksheets">
        <TabsList><TabsTrigger value="marksheets">Marksheets</TabsTrigger><TabsTrigger value="transcripts">Transcripts</TabsTrigger></TabsList>

        <TabsContent value="marksheets" className="mt-4">
          {marksheets.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Serial</TableHead><TableHead>Period</TableHead><TableHead>Exam</TableHead><TableHead>Status</TableHead><TableHead>Issued On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMarksheets.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5 font-medium">{m.studentName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.serial}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.academicPeriodRef}</code></TableCell><TableCell><span className="text-sm text-muted-foreground">{m.examId ?? "—"}</span></TableCell><TableCell><Badge variant={marksheetStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{m.issuedOn.slice(0, 10)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingMs(m); setMsOpen(true); }}><Pencil /> Edit marksheet</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteMarksheet.mutate(m)}><Trash2 /> Delete marksheet</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="transcripts" className="mt-4">
          {transcripts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Status</TableHead><TableHead>Issued On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredTranscripts.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5 font-medium">{t.studentName}</TableCell><TableCell><Badge variant="secondary">{t.fromPeriod}</Badge></TableCell><TableCell><Badge variant="secondary">{t.toPeriod}</Badge></TableCell><TableCell><Badge variant={transcriptStatusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{t.issuedOn.slice(0, 10)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingTr(t); setTrOpen(true); }}><Pencil /> Edit transcript</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteTranscript.mutate(t)}><Trash2 /> Delete transcript</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <MarksheetFormDialog open={msOpen} onOpenChange={setMsOpen} marksheet={editingMs} />
      <TranscriptFormDialog open={trOpen} onOpenChange={setTrOpen} transcript={editingTr} />
    </div>
  );
}
