import { useMemo, useState } from "react";
import { Users, Search, Plus, Shield, Link2, Phone } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GuardianFormDialog } from "@/pages/guardian-form-dialog";
import { StudentGuardianFormDialog } from "@/pages/student-guardian-form-dialog";
import { useGuardians, useStudentGuardians, useDeleteGuardian, useDeleteStudentGuardian } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { Guardian, StudentGuardian } from "@/lib/types";

export default function GuardiansFamilies() {
  const guardians = useGuardians();
  const studentGuardians = useStudentGuardians();
  const deleteGuardian = useDeleteGuardian();
  const deleteStudentGuardian = useDeleteStudentGuardian();
  const [q, setQ] = useState("");
  const [guardianDialogOpen, setGuardianDialogOpen] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | undefined>();
  const [relDialogOpen, setRelDialogOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<StudentGuardian | undefined>();

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

  const totalGuardians = guardians.data?.length ?? 0;
  const activeLinks = (studentGuardians.data ?? []).length;
  const emergencyContacts = (studentGuardians.data ?? []).filter((r) => r.type === "emergency_contact").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Guardians & Families"
        titleNe="अभिभावक"
        microModule="M05.02"
        description="Manage guardian records and student-guardian relationships."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="guardians">
              <Button variant="outline" onClick={() => { setEditingGuardian(undefined); setGuardianDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New guardian
              </Button>
            </CanCreate>
            <CanCreate resource="studentGuardians">
              <Button onClick={() => { setEditingRel(undefined); setRelDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New link
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total guardians</p><p className="text-lg font-bold">{totalGuardians}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Link2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active links</p><p className="text-lg font-bold">{activeLinks}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Phone className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Emergency contacts</p><p className="text-lg font-bold">{emergencyContacts}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search guardians, links…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="guardians">
        <TabsList>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="links">Student-Guardian Links</TabsTrigger>
        </TabsList>

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
                          <RowActionMenu resource="guardians" onEdit={() => { setEditingGuardian(g); setGuardianDialogOpen(true); }} onDelete={() => deleteGuardian.mutate(g)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="links" className="mt-4">
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
                          <RowActionMenu resource="studentGuardians" onEdit={() => { setEditingRel(r); setRelDialogOpen(true); }} onDelete={() => deleteStudentGuardian.mutate(r)} />
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

      <GuardianFormDialog open={guardianDialogOpen} onOpenChange={setGuardianDialogOpen} guardian={editingGuardian} />
      <StudentGuardianFormDialog open={relDialogOpen} onOpenChange={setRelDialogOpen} relationship={editingRel} />
    </div>
  );
}
