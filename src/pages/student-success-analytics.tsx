import { useMemo, useState } from "react";
import { GraduationCap, Search, Plus, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { StudentAnalyticsFormDialog } from "@/pages/student-analytics-form-dialog";
import { CohortAnalysisFormDialog } from "@/pages/cohort-analysis-form-dialog";
import { useStudentAnalytics, useCohortAnalysis, useDeleteStudentAnalytics, useDeleteCohortAnalysis } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { StudentAnalytics, CohortAnalysis } from "@/lib/types";

const riskVariant = (score: number): "success" | "warning" | "destructive" | "secondary" =>
  score < 30 ? "success" : score < 60 ? "warning" : "destructive";

export default function StudentSuccessAnalyticsPage() {
  const studentQuery = useStudentAnalytics();
  const cohortQuery = useCohortAnalysis();
  const deleteStudent = useDeleteStudentAnalytics();
  const deleteCohort = useDeleteCohortAnalysis();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StudentAnalytics | CohortAnalysis | undefined>();
  const [dialogType, setDialogType] = useState<"student" | "cohort">("student");

  const filteredStudent = useMemo(() => {
    let list = studentQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.grade.toLowerCase().includes(s)); }
    return list;
  }, [studentQuery.data, q]);

  const filteredCohort = useMemo(() => {
    let list = cohortQuery.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.cohortName.toLowerCase().includes(s) || r.academicYear.toLowerCase().includes(s)); }
    return list;
  }, [cohortQuery.data, q]);

  const students = studentQuery.data ?? [];
  const cohorts = cohortQuery.data ?? [];
  const atRiskCount = students.filter((s) => s.riskScore >= 60).length;
  const avgAttendance = students.length ? (students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length).toFixed(1) : "0";
  const cohortPassRate = cohorts.length ? (cohorts.reduce((sum, c) => sum + c.passRate, 0) / cohorts.length).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Student Success Analytics"
        titleNe="विद्यार्थी सफलता"
        microModule="M24.05"
        description="Track student performance, risk indicators, and cohort progression analysis."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="studentAnalytics"><Button onClick={() => { setEditing(undefined); setDialogType("student"); setOpen(true); }}><Plus className="h-4 w-4" /> Add Student Analytics</Button></CanCreate>
            <CanCreate resource="cohortAnalysis"><Button variant="outline" onClick={() => { setEditing(undefined); setDialogType("cohort"); setOpen(true); }}><Plus className="h-4 w-4" /> Add Cohort Analysis</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><AlertTriangle className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">At-Risk Students</p><p className="text-lg font-bold">{atRiskCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Average Attendance</p><p className="text-lg font-bold">{avgAttendance}%</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Cohort Pass Rate</p><p className="text-lg font-bold">{cohortPassRate}%</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search analytics…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Student Analytics</TabsTrigger>
          <TabsTrigger value="cohorts">Cohort Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4">
          {studentQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student Name</TableHead><TableHead>Grade</TableHead><TableHead>Attendance</TableHead><TableHead>Avg Score</TableHead><TableHead>Completion</TableHead><TableHead>Risk</TableHead><TableHead>Last Updated</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredStudent.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><span className="font-medium">{s.studentName}</span></TableCell><TableCell><Badge variant="secondary">{s.grade}</Badge></TableCell><TableCell><span className="text-sm">{s.attendanceRate}%</span></TableCell><TableCell><span className="text-sm font-mono">{s.avgScore.toFixed(1)}</span></TableCell><TableCell><span className="text-sm">{s.assignmentCompletion}%</span></TableCell><TableCell><Badge variant={riskVariant(s.riskScore)}>{s.riskScore.toFixed(0)}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(s.lastUpdated)}</span></TableCell><TableCell><RowActionMenu resource="studentAnalytics" onEdit={() => { setEditing(s); setDialogType("student"); setOpen(true); }} onDelete={() => deleteStudent.mutate(s)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4">
          {cohortQuery.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Cohort</TableHead><TableHead>Grade</TableHead><TableHead>Year</TableHead><TableHead>Enrolled</TableHead><TableHead>Promoted</TableHead><TableHead>Pass Rate</TableHead><TableHead>Dropout Rate</TableHead><TableHead>Analyzed</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCohort.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><span className="font-medium">{c.cohortName}</span></TableCell><TableCell><Badge variant="secondary">{c.gradeRef}</Badge></TableCell><TableCell><span className="text-sm">{c.academicYear}</span></TableCell><TableCell><span className="text-sm">{c.enrolledCount}</span></TableCell><TableCell><span className="text-sm">{c.promotedCount}</span></TableCell><TableCell><span className="text-sm font-mono">{c.passRate.toFixed(1)}%</span></TableCell><TableCell><span className="text-sm font-mono">{c.dropoutRate.toFixed(1)}%</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.analyzedOn)}</span></TableCell><TableCell><RowActionMenu resource="studentAnalytics" onEdit={() => { setEditing(c); setDialogType("cohort"); setOpen(true); }} onDelete={() => deleteCohort.mutate(c)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <StudentAnalyticsFormDialog open={open && dialogType === "student"} onOpenChange={setOpen} editing={editing && "studentName" in editing ? editing : undefined} />
      <CohortAnalysisFormDialog open={open && dialogType === "cohort"} onOpenChange={setOpen} editing={editing && "cohortName" in editing ? editing : undefined} />
    </div>
  );
}
