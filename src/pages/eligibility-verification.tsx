import { useMemo, useState } from "react";
import { ClipboardCheck, Search, Plus, FileCheck, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { EligibilityDecisionFormDialog } from "@/pages/eligibility-decision-form-dialog";
import { ApplicationDocumentFormDialog } from "@/pages/application-document-form-dialog";
import { useEligibilityDecisions, useApplicationDocuments, useDeleteEligibilityDecision, useDeleteApplicationDocument } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { EligibilityDecision, ApplicationDocument } from "@/lib/types";

const eligibilityOutcomeVariant: Record<string, "success" | "warning" | "destructive" | "info" | "secondary"> = {
  pending: "warning", eligible: "success", not_eligible: "destructive", conditional: "info", manual_review: "secondary",
};

const docStatusVariant: Record<string, "warning" | "success" | "destructive" | "info" | "secondary"> = {
  missing: "warning", received: "info", verified: "success", rejected: "destructive", expired: "secondary", waived: "secondary",
};

export default function EligibilityVerification() {
  const decisions = useEligibilityDecisions();
  const documents = useApplicationDocuments();
  const deleteDecision = useDeleteEligibilityDecision();
  const deleteDocument = useDeleteApplicationDocument();
  const [q, setQ] = useState("");
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<EligibilityDecision | undefined>();
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ApplicationDocument | undefined>();

  const filteredDecisions = useMemo(() => {
    let list = decisions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.applicationName.toLowerCase().includes(s) || d.ruleName.toLowerCase().includes(s) || d.reason.toLowerCase().includes(s)); }
    return list;
  }, [decisions.data, q]);

  const filteredDocs = useMemo(() => {
    let list = documents.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.documentType.toLowerCase().includes(s) || d.documentName.toLowerCase().includes(s)); }
    return list;
  }, [documents.data, q]);

  const totalEligibility = decisions.data?.length ?? 0;
  const pendingDocs = (documents.data ?? []).filter((d) => d.status === "missing" || d.status === "received").length;
  const verifiedDocs = (documents.data ?? []).filter((d) => d.status === "verified").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Eligibility & Documents"
        titleNe="योग्यता र कागजात"
        microModule="M04.04"
        description="Verify application eligibility and manage document verification."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="eligibilityDecisions">
              <Button variant="outline" onClick={() => { setEditingDecision(undefined); setDecisionDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New decision
              </Button>
            </CanCreate>
            <CanCreate resource="applicationDocuments">
              <Button onClick={() => { setEditingDoc(undefined); setDocDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New document
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total eligibility checks</p><p className="text-lg font-bold">{totalEligibility}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Pending documents</p><p className="text-lg font-bold">{pendingDocs}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Verified</p><p className="text-lg font-bold">{verifiedDocs}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search decisions, documents…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="decisions">
        <TabsList>
          <TabsTrigger value="decisions">Eligibility Decisions</TabsTrigger>
          <TabsTrigger value="documents">Document Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="decisions" className="mt-4">
          {decisions.isLoading ? <LoadingBlock /> : (
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
                    {filteredDecisions.map((d) => (
                      <TableRow key={d.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{d.applicationName}</p>
                        </TableCell>
                        <TableCell><span className="text-sm">{d.ruleName}</span></TableCell>
                        <TableCell><Badge variant={eligibilityOutcomeVariant[d.outcome] ?? "secondary"} className="capitalize">{d.outcome.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{d.reason}</span></TableCell>
                        <TableCell><span className="text-sm">{d.decidedBy}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(d.decidedOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="eligibilityDecisions" onEdit={() => { setEditingDecision(d); setDecisionDialogOpen(true); }} onDelete={() => deleteDecision.mutate(d)} />
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
                        <TableCell className="pl-5"><Badge variant="secondary" className="capitalize">{d.documentType.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><p className="font-medium">{d.documentName}</p></TableCell>
                        <TableCell><Badge variant={docStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                        <TableCell><span className="text-sm">{d.verifiedBy ?? "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{d.verifiedOn ? fmtDate(d.verifiedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="applicationDocuments" onEdit={() => { setEditingDoc(d); setDocDialogOpen(true); }} onDelete={() => deleteDocument.mutate(d)} />
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

      <EligibilityDecisionFormDialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen} decision={editingDecision} />
      <ApplicationDocumentFormDialog open={docDialogOpen} onOpenChange={setDocDialogOpen} document={editingDoc} />
    </div>
  );
}
