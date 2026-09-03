import { useMemo, useState } from "react";
import { GraduationCap, Search, Plus, Pencil, Trash2, Users, UserCheck, Shield, FileText, UserPlus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PersonFormDialog } from "@/pages/person-form-dialog";
import { StudentFormDialog } from "@/pages/student-form-dialog";
import { GuardianFormDialog } from "@/pages/guardian-form-dialog";
import { StudentGuardianFormDialog } from "@/pages/student-guardian-form-dialog";
import { StudentDocumentFormDialog } from "@/pages/student-document-form-dialog";
import {
  usePersons, useStudents, useGuardians, useStudentGuardians, useStudentDocuments,
  useDeletePerson, useDeleteStudent, useDeleteGuardian, useDeleteStudentGuardian, useDeleteStudentDocument,
} from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Person, Student, Guardian, StudentGuardian, StudentDocument } from "@/lib/types";

const studentStatusVariant: Record<string, "success" | "secondary" | "info" | "warning" | "destructive"> = {
  active: "success", inactive: "secondary", graduated: "info", transferred: "warning", expelled: "destructive", withdrawn: "secondary",
};
const docStatusVariant: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning", verified: "success", rejected: "destructive",
};

export default function StudentMasterPage() {
  const persons = usePersons();
  const students = useStudents();
  const guardians = useGuardians();
  const studentGuardians = useStudentGuardians();
  const studentDocuments = useStudentDocuments();
  const deletePerson = useDeletePerson();
  const deleteStudent = useDeleteStudent();
  const deleteGuardian = useDeleteGuardian();
  const deleteStudentGuardian = useDeleteStudentGuardian();
  const deleteStudentDocument = useDeleteStudentDocument();

  const [q, setQ] = useState("");

  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | undefined>();

  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | undefined>();

  const [guardianDialogOpen, setGuardianDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | undefined>();

  const [relDialogOpen, setRelDialogOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<StudentGuardian | undefined>();

  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StudentDocument | undefined>();

  // ── Filtered data ─────────────────────────────────────────────────────────

  const filteredPersons = useMemo(() => {
    let list = persons.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.legalName.toLowerCase().includes(s) || p.officialName.toLowerCase().includes(s) || (p.officialNameNe ?? "").includes(s)); }
    return list;
  }, [persons.data, q]);

  const filteredStudents = useMemo(() => {
    let list = students.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((st) => st.personName.toLowerCase().includes(s) || st.admissionNo.toLowerCase().includes(s) || (st.iemisId ?? "").toLowerCase().includes(s)); }
    return list;
  }, [students.data, q]);

  const filteredGuardians = useMemo(() => {
    let list = guardians.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((g) => g.personName.toLowerCase().includes(s) || g.name.toLowerCase().includes(s) || (g.phone ?? "").includes(s)); }
    return list;
  }, [guardians.data, q]);

  const filteredRels = useMemo(() => {
    let list = studentGuardians.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.guardianName.toLowerCase().includes(s)); }
    return list;
  }, [studentGuardians.data, q]);

  const filteredDocs = useMemo(() => {
    let list = studentDocuments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.studentName.toLowerCase().includes(s) || d.documentName.toLowerCase().includes(s)); }
    return list;
  }, [studentDocuments.data, q]);

  // ── KPIs ──────────────────────────────────────────────────────────────────

  const totalPersons = persons.data?.length ?? 0;
  const totalStudents = students.data?.length ?? 0;
  const activeStudents = (students.data ?? []).filter((s) => s.status === "active").length;
  const totalGuardians = guardians.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={GraduationCap}
        title="Student Information & Lifecycle"
        titleNe="विद्यार्थी जानकारी तथा जीवनचक्र"
        microModule="M05.01"
        description="Person master, student records, guardians, relationships and documents."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingPerson(undefined); setPersonDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New person
            </Button>
            <Button variant="outline" onClick={() => { setEditingStudent(undefined); setStudentDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New student
            </Button>
            <Button onClick={() => { setEditingGuardian(undefined); setGuardianDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New guardian
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><GraduationCap className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total persons</p><p className="text-lg font-bold">{totalPersons}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total students</p><p className="text-lg font-bold">{totalStudents}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><UserCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active students</p><p className="text-lg font-bold">{activeStudents}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Shield className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total guardians</p><p className="text-lg font-bold">{totalGuardians}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search persons, students, guardians…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="persons">
        <TabsList>
          <TabsTrigger value="persons">Persons</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="relationships">Relationships</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* ── Persons tab ──────────────────────────────────────────────────── */}
        <TabsContent value="persons" className="mt-4">
          {persons.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Nationality</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPersons.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5">
                          <div>
                            <p className="font-medium">{p.legalName}</p>
                            {p.officialNameNe && <p className="text-xs text-muted-foreground font-nepali">{p.officialNameNe}</p>}
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm capitalize">{p.gender}</span></TableCell>
                        <TableCell><span className="text-sm">{p.nationality}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(p.dateOfBirth)}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(p.createdOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingPerson(p); setPersonDialogOpen(true); }}><Pencil /> Edit person</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePerson.mutate(p)}><Trash2 /> Delete person</DropdownMenuItem>
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

        {/* ── Students tab ─────────────────────────────────────────────────── */}
        <TabsContent value="students" className="mt-4">
          {students.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Admission No</TableHead>
                      <TableHead>IEMIS ID</TableHead>
                      <TableHead>Grade / Section</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Admitted</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((st) => (
                      <TableRow key={st.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{st.personName}</p>
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{st.admissionNo}</code></TableCell>
                        <TableCell><span className="text-sm">{st.iemisId ?? "—"}</span></TableCell>
                        <TableCell>
                          <span className="text-sm">{st.currentGradeName ?? "—"}</span>
                          {st.currentSectionName && <span className="text-xs text-muted-foreground"> / {st.currentSectionName}</span>}
                        </TableCell>
                        <TableCell><Badge variant={studentStatusVariant[st.status] ?? "secondary"} className="capitalize">{st.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(st.admittedOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingStudent(st); setStudentDialogOpen(true); }}><Pencil /> Edit student</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStudent.mutate(st)}><Trash2 /> Delete student</DropdownMenuItem>
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

        {/* ── Guardians tab ────────────────────────────────────────────────── */}
        <TabsContent value="guardians" className="mt-4">
          {guardians.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Occupation</TableHead>
                      <TableHead>Relation</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGuardians.map((g) => (
                      <TableRow key={g.id} className="group">
                        <TableCell className="pl-5">
                          <div>
                            <p className="font-medium">{g.personName}</p>
                            <p className="text-xs text-muted-foreground">{g.name}</p>
                          </div>
                        </TableCell>
                        <TableCell><span className="text-sm">{g.phone}</span></TableCell>
                        <TableCell><span className="text-sm">{g.email ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{g.occupation ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{g.relationToStudent}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(g.createdOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingGuardian(g); setGuardianDialogOpen(true); }}><Pencil /> Edit guardian</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteGuardian.mutate(g)}><Trash2 /> Delete guardian</DropdownMenuItem>
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

        {/* ── Relationships tab ────────────────────────────────────────────── */}
        <TabsContent value="relationships" className="mt-4">
          {studentGuardians.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Primary</TableHead>
                      <TableHead>Valid From</TableHead>
                      <TableHead>Valid To</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRels.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{r.studentName}</p></TableCell>
                        <TableCell><span className="text-sm">{r.guardianName}</span></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{r.type.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell>{r.isPrimary ? <Badge variant="success">Primary</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                        <TableCell><span className="text-sm">{fmtDate(r.validFrom)}</span></TableCell>
                        <TableCell><span className="text-sm">{r.validTo ? fmtDate(r.validTo) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingRel(r); setRelDialogOpen(true); }}><Pencil /> Edit relationship</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStudentGuardian.mutate(r)}><Trash2 /> Delete relationship</DropdownMenuItem>
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

        {/* ── Documents tab ────────────────────────────────────────────────── */}
        <TabsContent value="documents" className="mt-4">
          {studentDocuments.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified By</TableHead>
                      <TableHead>Verified On</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{d.studentName}</p></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{d.type.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{d.documentName}</span></TableCell>
                        <TableCell><Badge variant={docStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{d.verifiedBy ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{d.verifiedOn ? fmtDate(d.verifiedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingDoc(d); setDocDialogOpen(true); }}><Pencil /> Edit document</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStudentDocument.mutate(d)}><Trash2 /> Delete document</DropdownMenuItem>
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

      {/* ── Dialogs ────────────────────────────────────────────────────────── */}
      <PersonFormDialog open={personDialogOpen} onOpenChange={setPersonDialogOpen} person={editingPerson} />
      <StudentFormDialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen} student={editingStudent} />
      <GuardianFormDialog open={guardianDialogOpen} onOpenChange={setGuardianDialogOpen} guardian={editingGuardian} />
      <StudentGuardianFormDialog open={relDialogOpen} onOpenChange={setRelDialogOpen} relationship={editingRel} />
      <StudentDocumentFormDialog open={docDialogOpen} onOpenChange={setDocDialogOpen} document={editingDoc} />
    </div>
  );
}
