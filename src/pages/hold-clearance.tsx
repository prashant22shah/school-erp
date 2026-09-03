import { useMemo, useState } from "react";
import { ShieldBan, Search, Plus, Pencil, Trash2, ShieldCheck, ClipboardCheck, CreditCard, AlertTriangle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { StudentHoldFormDialog } from "@/pages/student-hold-form-dialog";
import { ClearanceCaseFormDialog } from "@/pages/clearance-case-form-dialog";
import { ClearanceResponseFormDialog } from "@/pages/clearance-response-form-dialog";
import { IdentityCardFormDialog } from "@/pages/identity-card-form-dialog";
import { useStudentHolds, useClearanceCases, useClearanceResponses, useIdentityCards, useDeleteStudentHold, useDeleteClearanceCase, useDeleteClearanceResponse, useDeleteIdentityCard } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { StudentHold, ClearanceCase, ClearanceResponse, IdentityCard } from "@/lib/types";

const holdStatusVariant: Record<string, "destructive" | "success" | "secondary"> = {
  active: "destructive",
  released: "success",
  expired: "secondary",
};

const clearanceStatusVariant: Record<string, "warning" | "info" | "success" | "destructive"> = {
  pending: "warning",
  in_progress: "info",
  cleared: "success",
  blocked: "destructive",
};

const clearanceDecisionVariant: Record<string, "success" | "destructive" | "secondary"> = {
  cleared: "success",
  not_cleared: "destructive",
  not_applicable: "secondary",
};

const cardStatusVariant: Record<string, "success" | "destructive" | "secondary" | "warning"> = {
  active: "success",
  lost: "destructive",
  expired: "secondary",
  replaced: "warning",
};

export default function HoldClearancePage() {
  const holds = useStudentHolds();
  const cases = useClearanceCases();
  const responses = useClearanceResponses();
  const cards = useIdentityCards();
  const deleteHold = useDeleteStudentHold();
  const deleteCase = useDeleteClearanceCase();
  const deleteResponse = useDeleteClearanceResponse();
  const deleteCard = useDeleteIdentityCard();

  const [q, setQ] = useState("");
  const [holdDialogOpen, setHoldDialogOpen] = useState(false);
  const [editingHold, setEditingHold] = useState<StudentHold | undefined>();
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ClearanceCase | undefined>();
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [editingResponse, setEditingResponse] = useState<ClearanceResponse | undefined>();
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<IdentityCard | undefined>();

  const filteredHolds = useMemo(() => {
    let list = holds.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (h) =>
          h.studentName.toLowerCase().includes(s) ||
          h.holdType.toLowerCase().includes(s) ||
          h.ownerModule.toLowerCase().includes(s) ||
          h.reason.toLowerCase().includes(s),
      );
    }
    return list;
  }, [holds.data, q]);

  const filteredCases = useMemo(() => {
    let list = cases.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.studentName.toLowerCase().includes(s) ||
          c.purpose.toLowerCase().includes(s) ||
          c.initiatedBy.toLowerCase().includes(s),
      );
    }
    return list;
  }, [cases.data, q]);

  const filteredResponses = useMemo(() => {
    let list = responses.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (r) =>
          r.clearanceId.toLowerCase().includes(s) ||
          r.moduleName.toLowerCase().includes(s) ||
          r.moduleCode.toLowerCase().includes(s) ||
          r.respondedBy.toLowerCase().includes(s),
      );
    }
    return list;
  }, [responses.data, q]);

  const filteredCards = useMemo(() => {
    let list = cards.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(
        (c) =>
          c.studentName.toLowerCase().includes(s) ||
          c.cardType.toLowerCase().includes(s) ||
          c.serial.toLowerCase().includes(s),
      );
    }
    return list;
  }, [cards.data, q]);

  const activeHolds = (holds.data ?? []).filter((h) => h.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldBan}
        title="Holds & Clearance"
        titleNe="होल्ड तथा क्लियरेन्स"
        microModule="M05.07"
        description="Student holds, clearance cases, module responses and identity cards."
        actions={
          <div className="flex flex-wrap gap-2">
            <CanCreate resource="holds">
              <Button variant="outline" onClick={() => { setEditingHold(undefined); setHoldDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New hold
              </Button>
            </CanCreate>
            <CanCreate resource="holds">
              <Button variant="outline" onClick={() => { setEditingCase(undefined); setCaseDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New clearance
              </Button>
            </CanCreate>
            <CanCreate resource="holds">
              <Button variant="outline" onClick={() => { setEditingResponse(undefined); setResponseDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New response
              </Button>
            </CanCreate>
            <CanCreate resource="holds">
              <Button onClick={() => { setEditingCard(undefined); setCardDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New ID card
              </Button>
            </CanCreate>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldBan className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total holds</p><p className="text-lg font-bold">{holds.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active holds</p><p className="text-lg font-bold">{activeHolds}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ClipboardCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total clearance cases</p><p className="text-lg font-bold">{cases.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CreditCard className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total ID cards</p><p className="text-lg font-bold">{cards.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search holds, clearance or cards…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="holds">
        <TabsList>
          <TabsTrigger value="holds">Holds</TabsTrigger>
          <TabsTrigger value="clearance">Clearance Cases</TabsTrigger>
          <TabsTrigger value="responses">Clearance Responses</TabsTrigger>
          <TabsTrigger value="cards">ID Cards</TabsTrigger>
        </TabsList>

        {/* ── Holds tab ──────────────────────────────────────────────────── */}
        <TabsContent value="holds" className="mt-4">
          {holds.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Hold Type</TableHead>
                      <TableHead>Owner Module</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Placed By</TableHead>
                      <TableHead>Placed On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHolds.map((h) => (
                      <TableRow key={h.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{h.studentName}</p>
                          <p className="text-xs text-muted-foreground">{h.studentId}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{h.holdType}</Badge></TableCell>
                        <TableCell><span className="text-sm">{h.ownerModule}</span></TableCell>
                        <TableCell><span className="text-sm">{h.reason}</span></TableCell>
                        <TableCell><span className="text-sm">{h.placedBy}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(h.placedOn)}</span></TableCell>
                        <TableCell><Badge variant={holdStatusVariant[h.status] ?? "secondary"}>{h.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="holds" onEdit={() => { setEditingHold(h); setHoldDialogOpen(true); }} onDelete={() => deleteHold.mutate(h)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Clearance Cases tab ────────────────────────────────────────── */}
        <TabsContent value="clearance" className="mt-4">
          {cases.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Initiated By</TableHead>
                      <TableHead>Initiated On</TableHead>
                      <TableHead>Completed On</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.studentName}</p>
                          <p className="text-xs text-muted-foreground">{c.studentId}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{c.purpose}</Badge></TableCell>
                        <TableCell><Badge variant={clearanceStatusVariant[c.status] ?? "secondary"}>{c.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{c.initiatedBy}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(c.initiatedOn)}</span></TableCell>
                        <TableCell><span className="text-sm">{c.completedOn ? fmtDate(c.completedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="holds" onEdit={() => { setEditingCase(c); setCaseDialogOpen(true); }} onDelete={() => deleteCase.mutate(c)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Clearance Responses tab ── */}
        <TabsContent value="responses" className="mt-4">
          {responses.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Clearance ID</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Decision</TableHead>
                      <TableHead>Responded By</TableHead>
                      <TableHead>Responded On</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResponses.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.clearanceId}</code>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{r.moduleName}</p>
                          <p className="text-xs text-muted-foreground">{r.moduleCode}</p>
                        </TableCell>
                        <TableCell><Badge variant={clearanceDecisionVariant[r.decision] ?? "secondary"}>{r.decision.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{r.respondedBy}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(r.respondedOn)}</span></TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{r.remarks ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="holds" onEdit={() => { setEditingResponse(r); setResponseDialogOpen(true); }} onDelete={() => deleteResponse.mutate(r)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── ID Cards tab ───────────────────────────────────────────────── */}
        <TabsContent value="cards" className="mt-4">
          {cards.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Serial</TableHead>
                      <TableHead>Issued On</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.studentName}</p>
                          <p className="text-xs text-muted-foreground">{c.studentId}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary">{c.cardType.replace("_", " ")}</Badge></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.serial}</code></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(c.issuedOn)}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(c.validUntil)}</span></TableCell>
                        <TableCell><Badge variant={cardStatusVariant[c.status] ?? "secondary"}>{c.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="holds" onEdit={() => { setEditingCard(c); setCardDialogOpen(true); }} onDelete={() => deleteCard.mutate(c)} />
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

      <StudentHoldFormDialog open={holdDialogOpen} onOpenChange={setHoldDialogOpen} hold={editingHold} />
      <ClearanceCaseFormDialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen} clearanceCase={editingCase} />
      <ClearanceResponseFormDialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen} response={editingResponse} />
      <IdentityCardFormDialog open={cardDialogOpen} onOpenChange={setCardDialogOpen} card={editingCard} />
    </div>
  );
}
