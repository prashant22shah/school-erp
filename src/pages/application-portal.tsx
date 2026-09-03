import { useMemo, useState } from "react";
import { FileText, Search, Plus, Pencil, Trash2, Send, Eye, CheckCircle2, FileCheck } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ApplicationFormDialog } from "@/pages/application-form-dialog";
import { useApplications, useApplicationDocuments, useEligibilityDecisions, useDeleteApplication, useDeleteApplicationDocument, useDeleteEligibilityDecision } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Application, ApplicationDocument, EligibilityDecision } from "@/lib/types";

const appStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  draft: "secondary", submitted: "info", under_review: "warning", eligible: "success",
  not_eligible: "destructive", admitted: "success", rejected: "destructive", withdrawn: "secondary",
};

const docStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  missing: "destructive", received: "info", verified: "success", rejected: "destructive", expired: "warning", waived: "secondary",
};

const eligStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "info", eligible: "success", not_eligible: "destructive", conditional: "warning", manual_review: "secondary",
};

export default function ApplicationPortal() {
  const applications = useApplications();
  const documents = useApplicationDocuments();
  const eligibility = useEligibilityDecisions();
  const deleteApplication = useDeleteApplication();
  const deleteDocument = useDeleteApplicationDocument();
  const deleteEligibility = useDeleteEligibilityDecision();
  const [q, setQ] = useState("");
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<Application | undefined>();

  const filteredApps = useMemo(() => {
    let list = applications.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.applicationNo.toLowerCase().includes(s) || a.guardianName.toLowerCase().includes(s)); }
    return list;
  }, [applications.data, q]);

  const filteredDocs = useMemo(() => {
    let list = documents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.documentName.toLowerCase().includes(s) || d.documentType.toLowerCase().includes(s)); }
    return list;
  }, [documents.data, q]);

  const filteredElig = useMemo(() => {
    let list = eligibility.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.applicationName.toLowerCase().includes(s) || e.ruleName.toLowerCase().includes(s)); }
    return list;
  }, [eligibility.data, q]);

  const submitted = (applications.data ?? []).filter((a) => a.status === "submitted").length;
  const underReview = (applications.data ?? []).filter((a) => a.status === "under_review").length;
  const admitted = (applications.data ?? []).filter((a) => a.status === "admitted").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Application Portal"
        titleNe="आवेदन पोर्टल"
        microModule="M04.03 + M04.04"
        description="Manage admission applications, document verification, and eligibility decisions."
        actions={
          <CanCreate resource="applications">
            <Button onClick={() => { setEditingApp(undefined); setAppDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New application
            </Button>
          </CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total applications</p><p className="text-lg font-bold">{applications.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Send className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Submitted</p><p className="text-lg font-bold">{submitted}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Eye className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Under review</p><p className="text-lg font-bold">{underReview}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Admitted</p><p className="text-lg font-bold">{admitted}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applications, documents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="applications">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-4">
          {applications.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Application</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApps.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.applicationNo}</code></TableCell>
                        <TableCell>
                          <p className="font-medium">{a.studentName}</p>
                          {a.studentNameNe && <p className="text-xs text-muted-foreground">{a.studentNameNe}</p>}
                        </TableCell>
                        <TableCell><span className="text-sm">{a.guardianName}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{a.guardianPhone}</span></TableCell>
                        <TableCell><Badge variant="secondary">{a.academicYearName}</Badge></TableCell>
                        <TableCell><span className="text-sm">{a.appliedGradeName}</span></TableCell>
                        <TableCell><span className="text-sm">{a.appliedStreamName ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={appStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-xs">{a.submittedOn ? fmtDate(a.submittedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="applications" onEdit={() => { setEditingApp(a); setAppDialogOpen(true); }} onDelete={() => deleteApplication.mutate(a)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          {documents.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Document type</TableHead>
                      <TableHead>Document name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verified by</TableHead>
                      <TableHead>Verified on</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocs.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5"><Badge variant="secondary">{d.documentType}</Badge></TableCell>
                        <TableCell><span className="text-sm font-medium">{d.documentName}</span></TableCell>
                        <TableCell><Badge variant={docStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{d.verifiedBy ?? "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{d.verifiedOn ? fmtDate(d.verifiedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteDocument.mutate(d)}><Trash2 /> Delete document</DropdownMenuItem>
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

        <TabsContent value="eligibility" className="mt-4">
          {eligibility.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Application</TableHead>
                      <TableHead>Rule</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Decided by</TableHead>
                      <TableHead>Decided on</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredElig.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{e.applicationName}</p></TableCell>
                        <TableCell><span className="text-sm">{e.ruleName}</span></TableCell>
                        <TableCell><Badge variant={eligStatusVariant[e.outcome] ?? "secondary"} className="capitalize">{e.outcome.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{e.reason}</span></TableCell>
                        <TableCell><span className="text-sm">{e.decidedBy}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(e.decidedOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteEligibility.mutate(e)}><Trash2 /> Delete decision</DropdownMenuItem>
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

      <ApplicationFormDialog open={appDialogOpen} onOpenChange={setAppDialogOpen} application={editingApp} />
    </div>
  );
}
