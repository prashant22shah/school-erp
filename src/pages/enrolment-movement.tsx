import { useMemo, useState } from "react";
import { ArrowRightLeft, Search, Plus, Pencil, Trash2, BookOpen, GitBranch, BarChart3, Users } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { EnrolmentFormDialog } from "@/pages/enrolment-form-dialog";
import { StudentMovementFormDialog } from "@/pages/student-movement-form-dialog";
import { useEnrolments, useSubjectSelections, useStudentMovements, useProgressionAudits, useDeleteEnrolment, useDeleteStudentMovement } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Enrolment, SubjectSelection, StudentMovement, ProgressionAudit } from "@/lib/types";

const enrolmentStatusVariant: Record<string, "success" | "info" | "warning" | "secondary" | "destructive"> = {
  enrolled: "success",
  promoted: "info",
  repeated: "warning",
  transferred: "secondary",
  withdrawn: "destructive",
  completed: "secondary",
};

const subjectStatusVariant: Record<string, "success" | "destructive" | "secondary"> = {
  selected: "success",
  dropped: "destructive",
  completed: "secondary",
};

const movementTypeVariant: Record<string, "success" | "warning" | "info" | "secondary" | "destructive"> = {
  promotion: "success",
  repeat: "warning",
  transfer_in: "info",
  transfer_out: "secondary",
  withdrawal: "destructive",
  re_admission: "info",
};

const auditOutcomeVariant: Record<string, "success" | "warning" | "secondary" | "info" | "destructive"> = {
  promoted: "success",
  conditionally_promoted: "warning",
  repeated: "secondary",
  completed: "info",
  failed: "destructive",
};

export default function EnrolmentMovementPage() {
  const enrolments = useEnrolments();
  const subjectSelections = useSubjectSelections();
  const studentMovements = useStudentMovements();
  const progressionAudits = useProgressionAudits();
  const deleteEnrolment = useDeleteEnrolment();
  const deleteStudentMovement = useDeleteStudentMovement();

  const [q, setQ] = useState("");
  const [enrolmentDialogOpen, setEnrolmentDialogOpen] = useState(false);
  const [editingEnrolment, setEditingEnrolment] = useState<Enrolment | undefined>();
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<StudentMovement | undefined>();

  const filteredEnrolments = useMemo(() => {
    let list = enrolments.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (e) =>
          e.studentName.toLowerCase().includes(s) ||
          e.academicYearName.toLowerCase().includes(s) ||
          e.gradeName.toLowerCase().includes(s) ||
          (e.sectionName ?? "").toLowerCase().includes(s) ||
          (e.streamName ?? "").toLowerCase().includes(s) ||
          (e.rollNumber ?? "").toLowerCase().includes(s),
      );
    }
    return list;
  }, [enrolments.data, q]);

  const filteredSubjectSelections = useMemo(() => {
    let list = subjectSelections.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (ss) =>
          ss.studentName.toLowerCase().includes(s) ||
          ss.subjectName.toLowerCase().includes(s),
      );
    }
    return list;
  }, [subjectSelections.data, q]);

  const filteredMovements = useMemo(() => {
    let list = studentMovements.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (m) =>
          m.studentName.toLowerCase().includes(s) ||
          m.type.toLowerCase().includes(s) ||
          (m.fromGradeName ?? "").toLowerCase().includes(s) ||
          (m.toGradeName ?? "").toLowerCase().includes(s) ||
          (m.reason ?? "").toLowerCase().includes(s) ||
          (m.approvedBy ?? "").toLowerCase().includes(s),
      );
    }
    return list;
  }, [studentMovements.data, q]);

  const filteredAudits = useMemo(() => {
    let list = progressionAudits.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (a) =>
          a.studentName.toLowerCase().includes(s) ||
          a.gradeName.toLowerCase().includes(s) ||
          a.academicYearName.toLowerCase().includes(s) ||
          a.outcome.toLowerCase().includes(s) ||
          a.decidedBy.toLowerCase().includes(s),
      );
    }
    return list;
  }, [progressionAudits.data, q]);

  const activeEnrolments = (enrolments.data ?? []).filter((e) => e.status === "enrolled").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ArrowRightLeft}
        title="Enrolment & Movement"
        titleNe="भर्ना तथा स्थानान्तरण"
        microModule="M05.04"
        description="Student enrolment, subject choices, movement tracking and progression audit."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingEnrolment(undefined); setEnrolmentDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New enrolment
            </Button>
            <Button onClick={() => { setEditingMovement(undefined); setMovementDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New movement
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total enrolments</p><p className="text-lg font-bold">{enrolments.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active enrolments</p><p className="text-lg font-bold">{activeEnrolments}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ArrowRightLeft className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total movements</p><p className="text-lg font-bold">{studentMovements.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BarChart3 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total audits</p><p className="text-lg font-bold">{progressionAudits.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search enrolments, movements…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="enrolments">
        <TabsList>
          <TabsTrigger value="enrolments">Enrolments</TabsTrigger>
          <TabsTrigger value="subjects">Subject Choices</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
          <TabsTrigger value="progression">Progression</TabsTrigger>
        </TabsList>

        {/* ── Enrolments tab ── */}
        <TabsContent value="enrolments" className="mt-4">
          {enrolments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Grade/Section</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Effective From</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrolments.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{e.studentName}</p>
                          <p className="text-xs text-muted-foreground">{e.studentId}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{e.academicYearName}</span></TableCell>
                        <TableCell>
                          <span className="text-sm">{e.gradeName}</span>
                          {e.sectionName && <span className="text-xs text-muted-foreground"> / {e.sectionName}</span>}
                        </TableCell>
                        <TableCell><span className="text-sm">{e.streamName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{e.rollNumber ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={enrolmentStatusVariant[e.status] ?? "secondary"}>{e.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(e.effectiveFrom)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingEnrolment(e); setEnrolmentDialogOpen(true); }}><Pencil /> Edit enrolment</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteEnrolment.mutate(e)}><Trash2 /> Delete enrolment</DropdownMenuItem>
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

        {/* ── Subject Choices tab (read-only) ── */}
        <TabsContent value="subjects" className="mt-4">
          {subjectSelections.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Compulsory</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjectSelections.map((ss) => (
                      <TableRow key={ss.id}>
                        <TableCell className="pl-5">
                          <p className="font-medium">{ss.studentName}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{ss.subjectName}</span></TableCell>
                        <TableCell>
                          {ss.isCompulsory ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                        </TableCell>
                        <TableCell><Badge variant={subjectStatusVariant[ss.status] ?? "secondary"}>{ss.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(ss.createdOn)}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Movements tab ── */}
        <TabsContent value="movements" className="mt-4">
          {studentMovements.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From Grade</TableHead>
                      <TableHead>To Grade</TableHead>
                      <TableHead>Effective Date</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Approved By</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.map((m) => (
                      <TableRow key={m.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{m.studentName}</p>
                          <p className="text-xs text-muted-foreground">{m.enrolmentId}</p>
                        </TableCell>
                        <TableCell><Badge variant={movementTypeVariant[m.type] ?? "secondary"}>{m.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{m.fromGradeName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{m.toGradeName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(m.effectiveDate)}</span></TableCell>
                        <TableCell><span className="text-sm">{m.reason ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{m.approvedBy ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingMovement(m); setMovementDialogOpen(true); }}><Pencil /> Edit movement</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStudentMovement.mutate(m)}><Trash2 /> Delete movement</DropdownMenuItem>
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

        {/* ── Progression tab (read-only) ── */}
        <TabsContent value="progression" className="mt-4">
          {progressionAudits.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Rule Version</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Decided By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAudits.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="pl-5">
                          <p className="font-medium">{a.studentName}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{a.gradeName}</span></TableCell>
                        <TableCell><span className="text-sm">{a.academicYearName}</span></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.ruleVersion}</code></TableCell>
                        <TableCell><Badge variant={auditOutcomeVariant[a.outcome] ?? "secondary"}>{a.outcome.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{a.gpa != null ? a.gpa.toFixed(2) : "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{a.attendance != null ? `${a.attendance}%` : "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{a.decidedBy}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <EnrolmentFormDialog open={enrolmentDialogOpen} onOpenChange={setEnrolmentDialogOpen} enrolment={editingEnrolment} />
      <StudentMovementFormDialog open={movementDialogOpen} onOpenChange={setMovementDialogOpen} movement={editingMovement} />
    </div>
  );
}
