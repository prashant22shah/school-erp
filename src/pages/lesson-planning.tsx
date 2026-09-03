import { useMemo, useState } from "react";
import { CalendarCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { TeachingAssignmentFormDialog } from "@/pages/teaching-assignment-form-dialog";
import { LessonPlanFormDialog } from "@/pages/lesson-plan-form-dialog";
import { CoverageEntryFormDialog } from "@/pages/coverage-entry-form-dialog";
import { useTeachingAssignments, useLessonPlans, useCoverageEntries, useDeleteTeachingAssignment, useDeleteLessonPlan, useDeleteCoverageEntry } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { TeachingAssignment, LessonPlan, CoverageEntry } from "@/lib/types";

const lessonPlanStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", submitted: "info", approved: "success", active: "default", completed: "success", cancelled: "warning",
};

export default function LessonPlanningPage() {
  const assignments = useTeachingAssignments();
  const plans = useLessonPlans();
  const coverage = useCoverageEntries();
  const deleteAssignment = useDeleteTeachingAssignment();
  const deletePlan = useDeleteLessonPlan();
  const deleteCoverage = useDeleteCoverageEntry();
  const [q, setQ] = useState("");
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<TeachingAssignment | undefined>();
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LessonPlan | undefined>();
  const [coverageDialogOpen, setCoverageDialogOpen] = useState(false);
  const [editingCoverage, setEditingCoverage] = useState<CoverageEntry | undefined>();

  const filteredAssignments = useMemo(() => {
    let list = assignments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.staffName.toLowerCase().includes(s) || a.subjectName.toLowerCase().includes(s) || a.sectionName.toLowerCase().includes(s)); }
    return list;
  }, [assignments.data, q]);

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.localDate.includes(s) || p.objectives.toLowerCase().includes(s) || p.assignmentId.toLowerCase().includes(s)); }
    return list;
  }, [plans.data, q]);

  const filteredCoverage = useMemo(() => {
    let list = coverage.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.lessonPlanId.toLowerCase().includes(s) || (c.notes ?? "").toLowerCase().includes(s) || c.completedAt.includes(s)); }
    return list;
  }, [coverage.data, q]);

  const activePlans = (plans.data ?? []).filter((p) => p.status === "active" || p.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarCheck}
        title="Lesson Planning"
        titleNe="पाठ योजना"
        microModule="M06.03"
        description="Teaching assignments, lesson plans and coverage tracking."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingAssignment(undefined); setAssignmentDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Assignment
            </Button>
            <Button variant="outline" onClick={() => { setEditingPlan(undefined); setPlanDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Plan
            </Button>
            <Button onClick={() => { setEditingCoverage(undefined); setCoverageDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Coverage
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Assignments</p><p className="text-lg font-bold">{assignments.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active plans</p><p className="text-lg font-bold">{activePlans}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><CalendarCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Coverage entries</p><p className="text-lg font-bold">{coverage.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assignments, plans, coverage…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="assignments">
        <TabsList>
          <TabsTrigger value="assignments">Teaching Assignments</TabsTrigger>
          <TabsTrigger value="plans">Lesson Plans</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="mt-4">
          {assignments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Staff</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignments.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5 font-medium">{a.staffName}</TableCell>
                        <TableCell><Badge variant="secondary">{a.subjectName}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{a.sectionName}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingAssignment(a); setAssignmentDialogOpen(true); }}><Pencil /> Edit assignment</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAssignment.mutate(a)}><Trash2 /> Delete assignment</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Date</TableHead>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Objectives</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5 text-sm">{p.localDate}</TableCell>
                        <TableCell><Badge variant="secondary">{p.assignmentId}</Badge></TableCell>
                        <TableCell><Badge variant={lessonPlanStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{p.objectives}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingPlan(p); setPlanDialogOpen(true); }}><Pencil /> Edit plan</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePlan.mutate(p)}><Trash2 /> Delete plan</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
          {coverage.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Completed At</TableHead>
                      <TableHead>Lesson Plan</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCoverage.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5 text-sm">{c.completedAt}</TableCell>
                        <TableCell><Badge variant="secondary">{c.lessonPlanId}</Badge></TableCell>
                        <TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{c.notes ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingCoverage(c); setCoverageDialogOpen(true); }}><Pencil /> Edit entry</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteCoverage.mutate(c)}><Trash2 /> Delete entry</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <TeachingAssignmentFormDialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen} assignment={editingAssignment} />
      <LessonPlanFormDialog open={planDialogOpen} onOpenChange={setPlanDialogOpen} plan={editingPlan} />
      <CoverageEntryFormDialog open={coverageDialogOpen} onOpenChange={setCoverageDialogOpen} entry={editingCoverage} />
    </div>
  );
}
