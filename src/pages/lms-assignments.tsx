import { useMemo, useState } from "react";
import { ClipboardList, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LmsAssignmentFormDialog } from "@/pages/lms-assignment-form-dialog";
import { SubmissionFormDialog } from "@/pages/submission-form-dialog";
import { useAssignments, useSubmissions, useDeleteAssignment, useDeleteSubmission } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Assignment, Submission } from "@/lib/types";

const assignmentStatusVariant: Record<string, "secondary" | "info" | "warning" | "success"> = {
  draft: "secondary", published: "info", closed: "warning", graded: "success",
};

const submissionStatusVariant: Record<string, "success" | "warning" | "info" | "secondary"> = {
  submitted: "success", late: "warning", graded: "info", returned: "secondary",
};

export default function LmsAssignmentsPage() {
  const assignments = useAssignments();
  const submissions = useSubmissions();
  const deleteAssignment = useDeleteAssignment();
  const deleteSubmission = useDeleteSubmission();
  const [q, setQ] = useState("");
  const [assOpen, setAssOpen] = useState(false);
  const [editingAss, setEditingAss] = useState<Assignment | undefined>();
  const [subOpen, setSubOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Submission | undefined>();

  const filteredAssignments = useMemo(() => {
    const list = assignments.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((a: Assignment) => a.title.toLowerCase().includes(s) || a.courseSpaceRef.toLowerCase().includes(s));
  }, [assignments.data, q]);

  const filteredSubmissions = useMemo(() => {
    const list = submissions.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((r: Submission) => r.studentName.toLowerCase().includes(s));
  }, [submissions.data, q]);

  const gradedCount = (assignments.data ?? []).filter((a: Assignment) => a.status === "graded").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="Assignments & Submissions"
        titleNe="गृहकार्य"
        microModule="M10.03"
        description="Manage assignments and track student submissions."
        actions={<div className="flex gap-2"><CanCreate resource="assignments"><Button variant="outline" onClick={() => { setEditingAss(undefined); setAssOpen(true); }}><Plus className="h-4 w-4" /> New Assignment</Button></CanCreate><CanCreate resource="assignments"><Button onClick={() => { setEditingSub(undefined); setSubOpen(true); }}><Plus className="h-4 w-4" /> New Submission</Button></CanCreate></div>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Assignments</p><p className="text-lg font-bold">{assignments.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Graded</p><p className="text-lg font-bold">{gradedCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardList className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Submissions</p><p className="text-lg font-bold">{submissions.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search assignments or submissions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="assignments">
        <TabsList><TabsTrigger value="assignments">Assignments</TabsTrigger><TabsTrigger value="submissions">Submissions</TabsTrigger></TabsList>

        <TabsContent value="assignments" className="mt-4">
          {assignments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Due Date</TableHead><TableHead>Max Score</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredAssignments.map((a) => (
              <TableRow key={a.id} className="group">
                <TableCell className="pl-5 font-medium">{a.title}</TableCell>
                <TableCell className="text-sm">{fmtDate(a.dueDate)}</TableCell>
                <TableCell><span className="text-sm font-mono">{a.maxScore}</span></TableCell>
                <TableCell><Badge variant="secondary" className="capitalize">{a.submissionMode}</Badge></TableCell>
                <TableCell><Badge variant={assignmentStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="assignments" onEdit={() => { setEditingAss(a); setAssOpen(true); }} onDelete={() => deleteAssignment.mutate(a.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          {submissions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Submitted On</TableHead><TableHead>Score</TableHead><TableHead>Feedback</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSubmissions.map((r) => (
              <TableRow key={r.id} className="group">
                <TableCell className="pl-5 font-medium">{r.studentName}</TableCell>
                <TableCell className="text-sm">{fmtDate(r.submittedOn)}</TableCell>
                <TableCell><span className="text-sm font-mono">{r.score}</span></TableCell>
                <TableCell className="text-sm max-w-[200px] truncate">{r.feedback}</TableCell>
                <TableCell><Badge variant={submissionStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="assignments" onEdit={() => { setEditingSub(r); setSubOpen(true); }} onDelete={() => deleteSubmission.mutate(r.id)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <LmsAssignmentFormDialog open={assOpen} onOpenChange={setAssOpen} editing={editingAss} />
      <SubmissionFormDialog open={subOpen} onOpenChange={setSubOpen} editing={editingSub} />
    </div>
  );
}
