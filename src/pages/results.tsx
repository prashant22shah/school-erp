import { useMemo, useState } from "react";
import { Award, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ResultRunFormDialog } from "@/pages/result-run-form-dialog";
import { ResultLineFormDialog } from "@/pages/result-line-form-dialog";
import { useResultRuns, useResultLines, useDeleteResultRun, useDeleteResultLine } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { ResultRun, ResultLine } from "@/lib/types";

const runStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", computed: "info", approved: "info", published: "success", superseded: "warning",
};
const outcomeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pass: "success", fail: "warning", withheld: "secondary", absent: "warning",
};

export default function ResultsPage() {
  const runs = useResultRuns();
  const lines = useResultLines();
  const deleteRun = useDeleteResultRun();
  const deleteLine = useDeleteResultLine();
  const [q, setQ] = useState("");
  const [runOpen, setRunOpen] = useState(false);
  const [editingRun, setEditingRun] = useState<ResultRun | undefined>();
  const [lineOpen, setLineOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<ResultLine | undefined>();

  const filteredRuns = useMemo(() => {
    let list = runs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || (r.examName ?? "").toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [runs.data, q]);

  const filteredLines = useMemo(() => {
    let list = lines.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((l) => l.studentName.toLowerCase().includes(s) || (l.resultRunName ?? "").toLowerCase().includes(s) || l.outcome.toLowerCase().includes(s) || (l.grade ?? "").toLowerCase().includes(s)); }
    return list;
  }, [lines.data, q]);

  const published = (runs.data ?? []).filter((r) => r.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Award}
        title="Result Calculation"
        titleNe="नतिजा गणना"
        microModule="M09.01"
        description="Compute, review and publish examination results and student outcomes."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="results">
              <Button variant="outline" onClick={() => { setEditingRun(undefined); setRunOpen(true); }}><Plus className="h-4 w-4" /> New Result Run</Button>
            </CanCreate>
            <CanCreate resource="results">
              <Button onClick={() => { setEditingLine(undefined); setLineOpen(true); }}><Plus className="h-4 w-4" /> New Result Line</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Result Runs</p><p className="text-lg font-bold">{runs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published Runs</p><p className="text-lg font-bold">{published}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Result Lines</p><p className="text-lg font-bold">{lines.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search runs or lines…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="runs">
        <TabsList><TabsTrigger value="runs">Result Runs</TabsTrigger><TabsTrigger value="lines">Result Lines</TabsTrigger></TabsList>

        <TabsContent value="runs" className="mt-4">
          {runs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Exam</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead>Computed</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRuns.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.name}</TableCell><TableCell><Badge variant="secondary">{r.examName ?? r.examId}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.academicPeriodRef}</code></TableCell><TableCell><Badge variant={runStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.computedOn ? r.computedOn.slice(0, 10) : "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="results" onEdit={() => { setEditingRun(r); setRunOpen(true); }} onDelete={() => deleteRun.mutate(r)} editLabel="Edit run" deleteLabel="Delete run" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="lines" className="mt-4">
          {lines.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Run</TableHead><TableHead>Total</TableHead><TableHead>GPA</TableHead><TableHead>Grade</TableHead><TableHead>Outcome</TableHead><TableHead>Rank</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredLines.map((l) => (<TableRow key={l.id} className="group"><TableCell className="pl-5 font-medium">{l.studentName}</TableCell><TableCell><Badge variant="secondary">{l.resultRunName ?? l.resultRunId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{l.totalMarks}</span></TableCell><TableCell><span className="text-sm">{l.gpa ?? "—"}</span></TableCell><TableCell><Badge variant="secondary">{l.grade ?? "—"}</Badge></TableCell><TableCell><Badge variant={outcomeVariant[l.outcome] ?? "secondary"} className="capitalize">{l.outcome}</Badge></TableCell><TableCell><span className="text-sm">{l.rank ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="results" onEdit={() => { setEditingLine(l); setLineOpen(true); }} onDelete={() => deleteLine.mutate(l)} editLabel="Edit line" deleteLabel="Delete line" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ResultRunFormDialog open={runOpen} onOpenChange={setRunOpen} resultRun={editingRun} />
      <ResultLineFormDialog open={lineOpen} onOpenChange={setLineOpen} resultLine={editingLine} />
    </div>
  );
}
