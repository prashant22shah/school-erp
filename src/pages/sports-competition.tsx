import { useMemo, useState } from "react";
import { Trophy, Medal, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CompetitionFormDialog } from "@/pages/competition-form-dialog";
import { useCompetitions, useCompetitionEntries, useCompetitionResults, useDeleteCompetition, useDeleteCompetitionEntry, useDeleteCompetitionResult } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { Competition, CompetitionEntry, CompetitionResult } from "@/lib/types";

const compStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  planned: "secondary", open: "info", ongoing: "warning", completed: "success",
};
const entryStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  entered: "info", confirmed: "success", withdrew: "warning",
};
const resultStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "info", approved: "success", protested: "warning",
};

export default function SportsCompetitionPage() {
  const competitions = useCompetitions();
  const entries = useCompetitionEntries();
  const results = useCompetitionResults();
  const deleteComp = useDeleteCompetition();
  const deleteEntry = useDeleteCompetitionEntry();
  const deleteResult = useDeleteCompetitionResult();
  const [q, setQ] = useState("");
  const [compOpen, setCompOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Competition | undefined>();
  const [entryOpen, setEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<CompetitionEntry | undefined>();
  const [resultOpen, setResultOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<CompetitionResult | undefined>();

  const filteredComps = useMemo(() => {
    let list = competitions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.sport.toLowerCase().includes(s) || c.level.toLowerCase().includes(s)); }
    return list;
  }, [competitions.data, q]);

  const filteredEntries = useMemo(() => {
    let list = entries.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.teamName.toLowerCase().includes(s) || e.category.toLowerCase().includes(s)); }
    return list;
  }, [entries.data, q]);

  const filteredResults = useMemo(() => {
    let list = results.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.award.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [results.data, q]);

  const completedComps = (competitions.data ?? []).filter((c) => c.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Trophy} title="Sports & Competition" titleNe="खेलकुद" microModule="M20.03" description="Sports competitions, entries and results tracking." actions={<div className="flex gap-2"><CanCreate resource="competitions"><Button variant="outline" onClick={() => { setEditingComp(undefined); setCompOpen(true); }}><Plus className="h-4 w-4" /> New Competition</Button></CanCreate><CanCreate resource="competitionEntries"><Button onClick={() => { setEditingEntry(undefined); setEntryOpen(true); }}><Plus className="h-4 w-4" /> New Entry</Button></CanCreate><CanCreate resource="competitionResults"><Button onClick={() => { setEditingResult(undefined); setResultOpen(true); }}><Plus className="h-4 w-4" /> New Result</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Trophy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Competitions</p><p className="text-lg font-bold">{competitions.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Medal className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completedComps}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Medal className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Results</p><p className="text-lg font-bold">{results.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search competitions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="competitions">
        <TabsList><TabsTrigger value="competitions">Competitions</TabsTrigger><TabsTrigger value="entries">Entries</TabsTrigger><TabsTrigger value="results">Results</TabsTrigger></TabsList>
        <TabsContent value="competitions" className="mt-4">
          {competitions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Sport</TableHead><TableHead>Level</TableHead><TableHead>Dates</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredComps.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.name}</TableCell><TableCell><Badge variant="secondary">{c.sport}</Badge></TableCell><TableCell><span className="text-sm capitalize">{c.level.replace("_", " ")}</span></TableCell><TableCell><span className="text-sm font-mono">{c.startDate} → {c.endDate}</span></TableCell><TableCell><Badge variant={compStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="competitions" onEdit={() => { setEditingComp(c); setCompOpen(true); }} onDelete={() => deleteComp.mutate(c)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="entries" className="mt-4">
          {entries.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Team</TableHead><TableHead>Competition</TableHead><TableHead>Category</TableHead><TableHead>Entry Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredEntries.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5 font-medium">{e.teamName}</TableCell><TableCell><Badge variant="secondary">{e.competitionRef}</Badge></TableCell><TableCell><span className="text-sm">{e.category}</span></TableCell><TableCell><span className="text-sm font-mono">{e.entryDate}</span></TableCell><TableCell><Badge variant={entryStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="competitionEntries" onEdit={() => { setEditingEntry(e); setEntryOpen(true); }} onDelete={() => deleteEntry.mutate(e)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="results" className="mt-4">
          {results.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Rank</TableHead><TableHead>Award</TableHead><TableHead>Score</TableHead><TableHead>Approved By</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredResults.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">#{r.rank}</TableCell><TableCell><span className="text-sm">{r.award}</span></TableCell><TableCell><span className="text-sm font-mono">{r.score}</span></TableCell><TableCell><span className="text-sm">{r.approvedBy}</span></TableCell><TableCell><Badge variant={resultStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="competitionResults" onEdit={() => { setEditingResult(r); setResultOpen(true); }} onDelete={() => deleteResult.mutate(r)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <CompetitionFormDialog open={compOpen} onOpenChange={setCompOpen} competition={editingComp} />
      <CompetitionFormDialog open={entryOpen} onOpenChange={setEntryOpen} entry={editingEntry} />
      <CompetitionFormDialog open={resultOpen} onOpenChange={setResultOpen} result={editingResult} />
    </div>
  );
}
