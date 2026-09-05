import { useMemo, useState } from "react";
import { HelpCircle, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { QuizFormDialog } from "@/pages/quiz-form-dialog";
import { QuizAttemptFormDialog } from "@/pages/quiz-attempt-form-dialog";
import { useQuizzes, useQuizAttempts, useDeleteQuiz, useDeleteQuizAttempt } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Quiz, QuizAttempt } from "@/lib/types";

const quizStatusVariant: Record<string, "secondary" | "info" | "warning"> = {
  draft: "secondary", published: "info", closed: "warning",
};

const attemptStatusVariant: Record<string, "success" | "warning" | "secondary"> = {
  in_progress: "warning", completed: "success", timed_out: "secondary",
};

export default function QuizzesPracticePage() {
  const quizzes = useQuizzes();
  const attempts = useQuizAttempts();
  const deleteQuiz = useDeleteQuiz();
  const deleteAttempt = useDeleteQuizAttempt();
  const [q, setQ] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | undefined>();
  const [attemptOpen, setAttemptOpen] = useState(false);
  const [editingAttempt, setEditingAttempt] = useState<QuizAttempt | undefined>();

  const filteredQuizzes = useMemo(() => {
    const list = quizzes.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((a: Quiz) => a.title.toLowerCase().includes(s) || a.type.toLowerCase().includes(s));
  }, [quizzes.data, q]);

  const filteredAttempts = useMemo(() => {
    const list = attempts.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((r: QuizAttempt) => r.studentName.toLowerCase().includes(s));
  }, [attempts.data, q]);

  const publishedCount = (quizzes.data ?? []).filter((q) => q.status === "published").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={HelpCircle}
        title="Quizzes & Practice"
        titleNe="क्विज"
        microModule="M10.04"
        description="Manage quizzes, practice tests and student attempts."
        actions={<div className="flex gap-2"><CanCreate resource="quizzes"><Button variant="outline" onClick={() => { setEditingQuiz(undefined); setQuizOpen(true); }}><Plus className="h-4 w-4" /> New Quiz</Button></CanCreate><CanCreate resource="quizzes"><Button onClick={() => { setEditingAttempt(undefined); setAttemptOpen(true); }}><Plus className="h-4 w-4" /> New Attempt</Button></CanCreate></div>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><HelpCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Quizzes</p><p className="text-lg font-bold">{quizzes.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><HelpCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{publishedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><HelpCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Attempts</p><p className="text-lg font-bold">{attempts.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search quizzes or attempts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="quizzes">
        <TabsList><TabsTrigger value="quizzes">Quizzes</TabsTrigger><TabsTrigger value="attempts">Attempts</TabsTrigger></TabsList>

        <TabsContent value="quizzes" className="mt-4">
          {quizzes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Type</TableHead><TableHead>Questions</TableHead><TableHead>Max / Pass</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredQuizzes.map((a) => (
              <TableRow key={a.id} className="group">
                <TableCell className="pl-5 font-medium">{a.title}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{a.type}</Badge></TableCell>
                <TableCell><span className="text-sm font-mono">{a.questionCount}</span></TableCell>
                <TableCell><span className="text-sm font-mono">{a.maxScore}/{a.passingScore}</span></TableCell>
                <TableCell><Badge variant={quizStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="quizzes" onEdit={() => { setEditingQuiz(a); setQuizOpen(true); }} onDelete={() => deleteQuiz.mutate(a.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="attempts" className="mt-4">
          {attempts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Started</TableHead><TableHead>Completed</TableHead><TableHead>Score</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAttempts.map((r) => (
              <TableRow key={r.id} className="group">
                <TableCell className="pl-5 font-medium">{r.studentName}</TableCell>
                <TableCell className="text-sm">{fmtDate(r.startedOn)}</TableCell>
                <TableCell className="text-sm">{fmtDate(r.completedOn)}</TableCell>
                <TableCell><span className="text-sm font-mono">{r.score}</span></TableCell>
                <TableCell><Badge variant={attemptStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="quizzes" onEdit={() => { setEditingAttempt(r); setAttemptOpen(true); }} onDelete={() => deleteAttempt.mutate(r.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <QuizFormDialog open={quizOpen} onOpenChange={setQuizOpen} editing={editingQuiz} />
      <QuizAttemptFormDialog open={attemptOpen} onOpenChange={setAttemptOpen} editing={editingAttempt} />
    </div>
  );
}
