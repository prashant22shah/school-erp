import { useMemo, useState } from "react";
import { ClipboardCheck, FileCheck, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { BoardRegistrationFormDialog } from "@/pages/board-registration-form-dialog";
import { useBoardRegistrations, useReadinessChecks, useInternalAssessmentSnapshots, useDeleteBoardRegistration, useDeleteReadinessCheck, useDeleteInternalAssessmentSnapshot } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { BoardRegistration, ReadinessCheck, InternalAssessmentSnapshot } from "@/lib/types";

const regStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pending: "secondary", submitted: "info", approved: "success", rejected: "warning", registered: "success",
};
const checkOutcomeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  pass: "success", fail: "warning", warning: "info",
};
const snapStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", final: "info", submitted: "success",
};

export default function BoardRegistrationPage() {
  const regs = useBoardRegistrations();
  const checks = useReadinessChecks();
  const snaps = useInternalAssessmentSnapshots();
  const deleteReg = useDeleteBoardRegistration();
  const deleteCheck = useDeleteReadinessCheck();
  const deleteSnap = useDeleteInternalAssessmentSnapshot();
  const [q, setQ] = useState("");
  const [regOpen, setRegOpen] = useState(false);
  const [editingReg, setEditingReg] = useState<BoardRegistration | undefined>();

  const filteredRegs = useMemo(() => {
    let list = regs.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.studentName.toLowerCase().includes(s) || r.board.toLowerCase().includes(s) || r.symbolNo.toLowerCase().includes(s) || r.status.toLowerCase().includes(s)); }
    return list;
  }, [regs.data, q]);

  const filteredChecks = useMemo(() => {
    let list = checks.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.checkType.toLowerCase().includes(s) || c.outcome.toLowerCase().includes(s) || c.details.toLowerCase().includes(s)); }
    return list;
  }, [checks.data, q]);

  const filteredSnaps = useMemo(() => {
    let list = snaps.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sn) => sn.subjectName.toLowerCase().includes(s) || sn.status.toLowerCase().includes(s)); }
    return list;
  }, [snaps.data, q]);

  const registered = (regs.data ?? []).filter((r) => r.status === "registered").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Board Registration & Assessment"
        titleNe="बोर्ड दर्ता र मूल्याङ्कन"
        microModule="M21.02–M21.03"
        description="Manage board exam registrations, readiness checks and internal assessment snapshots."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="boardRegistrations">
              <Button variant="outline" onClick={() => { setEditingReg(undefined); setRegOpen(true); }}><Plus className="h-4 w-4" /> New Registration</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Board Registrations</p><p className="text-lg font-bold">{regs.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ClipboardCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Registered</p><p className="text-lg font-bold">{registered}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Assessment Snapshots</p><p className="text-lg font-bold">{snaps.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search registrations, checks or snapshots…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="registrations">
        <TabsList><TabsTrigger value="registrations">Board Registrations</TabsTrigger><TabsTrigger value="checks">Readiness Checks</TabsTrigger><TabsTrigger value="snapshots">Assessment Snapshots</TabsTrigger></TabsList>

        <TabsContent value="registrations" className="mt-4">
          {regs.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Board</TableHead><TableHead>Session</TableHead><TableHead>Symbol No.</TableHead><TableHead>Reg No.</TableHead><TableHead>Subjects</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredRegs.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.studentName}</TableCell><TableCell><Badge variant="secondary">{r.board}</Badge></TableCell><TableCell>{r.session}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.symbolNo}</code></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.registrationNo}</code></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{r.subjects}</span></TableCell><TableCell><Badge variant={regStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="boardRegistrations" onEdit={() => { setEditingReg(r); setRegOpen(true); }} onDelete={() => deleteReg.mutate(r)} editLabel="Edit registration" deleteLabel="Delete registration" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="checks" className="mt-4">
          {checks.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Registration Ref</TableHead><TableHead>Check Type</TableHead><TableHead>Outcome</TableHead><TableHead>Details</TableHead><TableHead>Checked Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredChecks.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.registrationRef.slice(0, 8)}</code></TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.checkType}</Badge></TableCell><TableCell><Badge variant={checkOutcomeVariant[c.outcome] ?? "secondary"} className="capitalize">{c.outcome}</Badge></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{c.details}</span></TableCell><TableCell><span className="text-sm font-mono">{c.checkedDate.slice(0, 10)}</span></TableCell><TableCell><Badge variant={c.status === "completed" ? "success" : "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="readinessChecks" onEdit={() => {}} onDelete={() => deleteCheck.mutate(c)} editLabel="Edit check" deleteLabel="Delete check" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="snapshots" className="mt-4">
          {snaps.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Subject</TableHead><TableHead>Theory</TableHead><TableHead>Practical</TableHead><TableHead>Internal</TableHead><TableHead>Total</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSnaps.map((sn) => (<TableRow key={sn.id} className="group"><TableCell className="pl-5 font-medium">{sn.subjectName}</TableCell><TableCell><span className="text-sm font-mono">{sn.theoryMarks}</span></TableCell><TableCell><span className="text-sm font-mono">{sn.practicalMarks}</span></TableCell><TableCell><span className="text-sm font-mono">{sn.internalMarks}</span></TableCell><TableCell><span className="text-sm font-mono font-medium">{sn.totalMarks}</span></TableCell><TableCell><span className="text-sm font-mono">{sn.snapshotDate.slice(0, 10)}</span></TableCell><TableCell><Badge variant={snapStatusVariant[sn.status] ?? "secondary"} className="capitalize">{sn.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="internalAssessmentSnapshots" onEdit={() => {}} onDelete={() => deleteSnap.mutate(sn)} editLabel="Edit snapshot" deleteLabel="Delete snapshot" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <BoardRegistrationFormDialog open={regOpen} onOpenChange={setRegOpen} registration={editingReg} />
    </div>
  );
}
