import { useMemo, useState } from "react";
import { CalendarDays, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ExamFormDialog } from "@/pages/exam-form-dialog";
import { ExamRegistrationFormDialog } from "@/pages/exam-registration-form-dialog";
import { useExams, useExamRegistrations, useDeleteExam, useDeleteExamRegistration } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { Exam, ExamRegistration } from "@/lib/types";

const examStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", scheduled: "info", ongoing: "warning", completed: "success", cancelled: "warning",
};
const regStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  registered: "info", admitted: "success", absent: "warning", cancelled: "secondary", completed: "default",
};

export default function ExamsPage() {
  const exams = useExams();
  const registrations = useExamRegistrations();
  const deleteExam = useDeleteExam();
  const deleteReg = useDeleteExamRegistration();
  const [q, setQ] = useState("");
  const [examOpen, setExamOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | undefined>();
  const [regOpen, setRegOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<ExamRegistration | undefined>();

  const filteredExams = useMemo(() => {
    let list = exams.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.code.toLowerCase().includes(s) || e.name.toLowerCase().includes(s) || e.type.toLowerCase().includes(s)); }
    return list;
  }, [exams.data, q]);

  const filteredRegs = useMemo(() => {
    let list = registrations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || (r.examName ?? "").toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [registrations.data, q]);

  const scheduled = (exams.data ?? []).filter((e) => e.status === "scheduled").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarDays} title="Examinations" titleNe="परीक्षा" microModule="M08.03" description="Exam schedules and student registrations." actions={<div className="flex gap-2"><CanCreate resource="exams"><Button variant="outline" onClick={() => { setEditingExam(undefined); setExamOpen(true); }}><Plus className="h-4 w-4" /> New Exam</Button></CanCreate><CanCreate resource="exams"><Button onClick={() => { setEditingReg(undefined); setRegOpen(true); }}><Plus className="h-4 w-4" /> New Registration</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Exams</p><p className="text-lg font-bold">{exams.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Scheduled</p><p className="text-lg font-bold">{scheduled}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CalendarDays className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Registrations</p><p className="text-lg font-bold">{registrations.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search exams or registrations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="exams">
        <TabsList><TabsTrigger value="exams">Exams</TabsTrigger><TabsTrigger value="registrations">Registrations</TabsTrigger></TabsList>

        <TabsContent value="exams" className="mt-4">
          {exams.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Window</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredExams.map((e) => (<TableRow key={e.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{e.code}</code></TableCell><TableCell className="font-medium">{e.name}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{e.type.replace("_"," ")}</Badge></TableCell><TableCell><Badge variant={examStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell><TableCell><span className="text-sm font-mono">{e.startDate} → {e.endDate}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="exams" onEdit={() => { setEditingExam(e); setExamOpen(true); }} onDelete={() => deleteExam.mutate(e)} editLabel="Edit exam" deleteLabel="Delete exam" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="registrations" className="mt-4">
          {registrations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Exam</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRegs.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><Badge variant="secondary">{r.examName ?? r.examId}</Badge></TableCell><TableCell><Badge variant={regStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="exams" onEdit={() => { setEditingReg(r); setRegOpen(true); }} onDelete={() => deleteReg.mutate(r)} editLabel="Edit registration" deleteLabel="Delete registration" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <ExamFormDialog open={examOpen} onOpenChange={setExamOpen} exam={editingExam} />
      <ExamRegistrationFormDialog open={regOpen} onOpenChange={setRegOpen} registration={editingReg} />
    </div>
  );
}
