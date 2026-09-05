import { useMemo, useState } from "react";
import { FileText, Search, Plus, CheckCircle2, Clock } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { StudentDocumentFormDialog } from "@/pages/student-document-form-dialog";
import { useStudentDocuments, useDeleteStudentDocument } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { StudentDocument } from "@/lib/types";

const docStatusVariant: Record<string, "warning" | "success" | "destructive"> = {
  pending: "warning", verified: "success", rejected: "destructive",
};

export default function StudentDocumentsPage() {
  const studentDocuments = useStudentDocuments();
  const deleteStudentDocument = useDeleteStudentDocument();
  const [q, setQ] = useState("");
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<StudentDocument | undefined>();

  const filteredDocs = useMemo(() => {
    let list = studentDocuments.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.studentName.toLowerCase().includes(s) || d.documentName.toLowerCase().includes(s)); }
    return list;
  }, [studentDocuments.data, q]);

  const totalDocs = studentDocuments.data?.length ?? 0;
  const verifiedDocs = (studentDocuments.data ?? []).filter((d) => d.status === "verified").length;
  const pendingDocs = (studentDocuments.data ?? []).filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Student Documents"
        titleNe="विद्यार्थी कागजात"
        microModule="M05.03"
        description="Manage student document records and verification status."
        actions={
          <CanCreate resource="studentDocuments">
            <Button onClick={() => { setEditingDoc(undefined); setDocDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New document
            </Button>
          </CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total documents</p><p className="text-lg font-bold">{totalDocs}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Verified</p><p className="text-lg font-bold">{verifiedDocs}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pendingDocs}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search documents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Student Documents</TabsTrigger>
        </TabsList>

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
                          <RowActionMenu resource="studentDocuments" onEdit={() => { setEditingDoc(d); setDocDialogOpen(true); }} onDelete={() => deleteStudentDocument.mutate(d)} />
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

      <StudentDocumentFormDialog open={docDialogOpen} onOpenChange={setDocDialogOpen} document={editingDoc} />
    </div>
  );
}
