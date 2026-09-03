import { useMemo, useState } from "react";
import { BookOpen, Search, Plus, Pencil, Trash2, FileText, ListChecks } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SubjectFormDialog } from "@/pages/subject-form-dialog";
import { CurriculumOfferingFormDialog } from "@/pages/curriculum-offering-form-dialog";
import { useSubjects, useCurriculumOfferings, useDeleteSubject, useDeleteCurriculumOffering } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Subject, CurriculumOffering } from "@/lib/types";

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary"> = {
  core: "default", elective: "info", practical: "warning", extra: "secondary",
};

export default function SubjectCurriculumPage() {
  const subjects = useSubjects();
  const offerings = useCurriculumOfferings();
  const deleteSubject = useDeleteSubject();
  const deleteOffering = useDeleteCurriculumOffering();
  const [q, setQ] = useState("");
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>();
  const [offeringDialogOpen, setOfferingDialogOpen] = useState(false);
  const [editingOffering, setEditingOffering] = useState<CurriculumOffering | undefined>();

  const filteredSubjects = useMemo(() => {
    let list = subjects.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sub) => sub.name.toLowerCase().includes(s) || sub.code.toLowerCase().includes(s)); }
    return list;
  }, [subjects.data, q]);

  const filteredOfferings = useMemo(() => {
    let list = offerings.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((o) => o.subjectName.toLowerCase().includes(s) || o.gradeClassName.toLowerCase().includes(s)); }
    return list;
  }, [offerings.data, q]);

  const coreSubjects = (subjects.data ?? []).filter((s) => s.type === "core").length;
  const compulsoryOfferings = (offerings.data ?? []).filter((o) => o.isCompulsory).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BookOpen}
        title="Subject & Curriculum"
        titleNe="विषय तथा पाठ्यक्रम"
        microModule="M03.03"
        description="Subject catalog and curriculum offerings — subjects mapped to grades with marks configuration."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="subjects">
              <Button variant="outline" onClick={() => { setEditingSubject(undefined); setSubjectDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New subject
              </Button>
            </CanCreate>
            <CanCreate resource="subjects">
              <Button onClick={() => { setEditingOffering(undefined); setOfferingDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New offering
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BookOpen className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total subjects</p><p className="text-lg font-bold">{subjects.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Core subjects</p><p className="text-lg font-bold">{coreSubjects}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ListChecks className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total offerings</p><p className="text-lg font-bold">{offerings.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ListChecks className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Compulsory</p><p className="text-lg font-bold">{compulsoryOfferings}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search subjects or offerings…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="subjects">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="offerings">Curriculum Offerings</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-4">
          {subjects.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubjects.map((s) => (
                      <TableRow key={s.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{s.name}</p>
                          {s.nameNe && <p className="text-xs text-muted-foreground">{s.nameNe}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.code}</code></TableCell>
                        <TableCell><Badge variant={typeVariant[s.type] ?? "secondary"} className="capitalize">{s.type}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{s.levelName}</Badge></TableCell>
                        <TableCell>{s.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="subjects" onEdit={() => { setEditingSubject(s); setSubjectDialogOpen(true); }} onDelete={() => deleteSubject.mutate(s)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offerings" className="mt-4">
          {offerings.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Subject</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Credit</TableHead>
                      <TableHead>Compulsory</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOfferings.map((o) => (
                      <TableRow key={o.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{o.subjectName}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{o.gradeClassName}</Badge></TableCell>
                        <TableCell><span className="text-sm">{o.streamName ?? "All"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{o.fullMarks}/{o.passMarks}</span></TableCell>
                        <TableCell><span className="text-sm">{o.creditHours ?? "—"}</span></TableCell>
                        <TableCell>{o.isCompulsory ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="subjects" onEdit={() => { setEditingOffering(o); setOfferingDialogOpen(true); }} onDelete={() => deleteOffering.mutate(o)} />
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

      <SubjectFormDialog open={subjectDialogOpen} onOpenChange={setSubjectDialogOpen} subject={editingSubject} />
      <CurriculumOfferingFormDialog open={offeringDialogOpen} onOpenChange={setOfferingDialogOpen} offering={editingOffering} />
    </div>
  );
}
