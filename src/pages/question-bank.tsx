import { useMemo, useState } from "react";
import { BookOpen, Search, Plus, Pencil, Trash2, FileCheck, HelpCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { QuestionFormDialog } from "@/pages/question-form-dialog";
import { ExamPaperFormDialog } from "@/pages/exam-paper-form-dialog";
import { useQuestions, useExamPapers, useDeleteQuestion, useDeleteExamPaper } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Question, ExamPaper } from "@/lib/types";

const questionStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", approved: "success", archived: "warning",
};
const paperStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", in_review: "info", approved: "info", published: "success", archived: "warning",
};

export default function QuestionBankPage() {
  const questions = useQuestions();
  const papers = useExamPapers();
  const deleteQuestion = useDeleteQuestion();
  const deletePaper = useDeleteExamPaper();
  const [q, setQ] = useState("");
  const [qOpen, setQOpen] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | undefined>();
  const [pOpen, setPOpen] = useState(false);
  const [editingP, setEditingP] = useState<ExamPaper | undefined>();

  const filteredQuestions = useMemo(() => {
    let list = questions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.code.toLowerCase().includes(s) || r.text.toLowerCase().includes(s) || (r.subjectName ?? "").toLowerCase().includes(s)); }
    return list;
  }, [questions.data, q]);

  const filteredPapers = useMemo(() => {
    let list = papers.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.code.toLowerCase().includes(s) || p.title.toLowerCase().includes(s) || (p.subjectName ?? "").toLowerCase().includes(s)); }
    return list;
  }, [papers.data, q]);

  const approved = (questions.data ?? []).filter((r) => r.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={BookOpen} title="Question Bank & Papers" titleNe="प्रश्न बैंक" microModule="M08.02" description="Question bank curation and exam paper composition." actions={<div className="flex gap-2"><Button variant="outline" onClick={() => { setEditingQ(undefined); setQOpen(true); }}><Plus className="h-4 w-4" /> New Question</Button><Button onClick={() => { setEditingP(undefined); setPOpen(true); }}><Plus className="h-4 w-4" /> New Paper</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><HelpCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Questions</p><p className="text-lg font-bold">{questions.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><HelpCircle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approved}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Exam Papers</p><p className="text-lg font-bold">{papers.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search questions or papers…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="questions">
        <TabsList><TabsTrigger value="questions">Questions</TabsTrigger><TabsTrigger value="papers">Exam Papers</TabsTrigger></TabsList>

        <TabsContent value="questions" className="mt-4">
          {questions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Subject</TableHead><TableHead>Text</TableHead><TableHead>Type</TableHead><TableHead>Difficulty</TableHead><TableHead>Marks</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredQuestions.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.code}</code></TableCell><TableCell><Badge variant="secondary">{r.subjectName ?? r.subjectRef}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[280px] text-sm">{r.text}</span></TableCell><TableCell><Badge variant="secondary" className="capitalize">{r.type}</Badge></TableCell><TableCell><Badge variant={r.difficulty==="hard"?"warning":r.difficulty==="medium"?"info":"secondary"} className="capitalize">{r.difficulty}</Badge></TableCell><TableCell><span className="text-sm font-mono">{r.marks}</span></TableCell><TableCell><Badge variant={questionStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingQ(r); setQOpen(true); }}><Pencil /> Edit question</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteQuestion.mutate(r)}><Trash2 /> Delete question</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="papers" className="mt-4">
          {papers.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Title</TableHead><TableHead>Subject</TableHead><TableHead>Assessment</TableHead><TableHead>Total</TableHead><TableHead>Duration</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPapers.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.code}</code></TableCell><TableCell className="font-medium max-w-[240px] truncate">{p.title}</TableCell><TableCell><Badge variant="secondary">{p.subjectName ?? p.subjectRef}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{p.assessmentName ?? p.assessmentId}</span></TableCell><TableCell><span className="text-sm font-mono">{p.totalMarks}</span></TableCell><TableCell><span className="text-sm">{p.durationMins} min</span></TableCell><TableCell><Badge variant={paperStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status.replace("_"," ")}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingP(p); setPOpen(true); }}><Pencil /> Edit paper</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePaper.mutate(p)}><Trash2 /> Delete paper</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <QuestionFormDialog open={qOpen} onOpenChange={setQOpen} question={editingQ} />
      <ExamPaperFormDialog open={pOpen} onOpenChange={setPOpen} paper={editingP} />
    </div>
  );
}
