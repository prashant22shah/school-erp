import { useMemo, useState } from "react";
import { UserCheck, Search, Plus, Pencil, Trash2, ArrowRightLeft, Clock, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ConversionCaseFormDialog } from "@/pages/conversion-case-form-dialog";
import { useConversionCases, useConversionSteps, useDeleteConversionCase, useDeleteConversionStep } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { ConversionCase, ConversionStep } from "@/lib/types";

const stateVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "info", in_progress: "warning", completed: "success", failed: "destructive", cancelled: "secondary",
};

const stepStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "info", running: "warning", completed: "success", failed: "destructive", skipped: "secondary",
};

export default function ApplicantConversion() {
  const cases = useConversionCases();
  const steps = useConversionSteps();
  const deleteCase = useDeleteConversionCase();
  const deleteStep = useDeleteConversionStep();
  const [q, setQ] = useState("");
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<ConversionCase | undefined>();

  const filteredCases = useMemo(() => {
    let list = cases.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.acceptanceName.toLowerCase().includes(s) || (c.admissionNo ?? "").toLowerCase().includes(s)); }
    return list;
  }, [cases.data, q]);

  const filteredSteps = useMemo(() => {
    let list = steps.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((st) => st.stepName.toLowerCase().includes(s) || st.stepCode.toLowerCase().includes(s)); }
    return list;
  }, [steps.data, q]);

  const inProgress = (cases.data ?? []).filter((c) => c.state === "in_progress").length;
  const completed = (cases.data ?? []).filter((c) => c.state === "completed").length;
  const failed = (cases.data ?? []).filter((c) => c.state === "failed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UserCheck}
        title="Applicant Conversion"
        titleNe="आवेदक रूपान्तरण"
        microModule="M04.07"
        description="Convert accepted applicants into enrolled students through a multi-step process."
        actions={
          <Button onClick={() => { setEditingCase(undefined); setCaseDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> New conversion
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ArrowRightLeft className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total cases</p><p className="text-lg font-bold">{cases.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">In progress</p><p className="text-lg font-bold">{inProgress}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed</p><p className="text-lg font-bold">{completed}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><XCircle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Failed</p><p className="text-lg font-bold">{failed}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search conversions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Conversion Cases</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="mt-4">
          {cases.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Acceptance</TableHead>
                      <TableHead>Admission no.</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCases.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{c.studentName}</p></TableCell>
                        <TableCell><span className="text-sm">{c.acceptanceName}</span></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.admissionNo ?? "—"}</code></TableCell>
                        <TableCell><Badge variant={stateVariant[c.state] ?? "secondary"} className="capitalize">{c.state.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.startedOn)}</span></TableCell>
                        <TableCell><span className="text-xs">{c.completedOn ? fmtDate(c.completedOn) : "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingCase(c); setCaseDialogOpen(true); }}><Pencil /> Edit case</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteCase.mutate(c)}><Trash2 /> Delete case</DropdownMenuItem>
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

        <TabsContent value="steps" className="mt-4">
          {steps.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Step</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Retries</TableHead>
                      <TableHead>Error</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSteps.map((s) => (
                      <TableRow key={s.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{s.stepName}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.stepCode}</code></TableCell>
                        <TableCell><Badge variant={stepStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell>
                        <TableCell><span className="text-xs">{s.startedOn ? fmtDate(s.startedOn) : "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{s.completedOn ? fmtDate(s.completedOn) : "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{s.retryCount}</span></TableCell>
                        <TableCell><span className="text-sm text-destructive max-w-[200px] truncate inline-block">{s.errorMessage ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteStep.mutate(s)}><Trash2 /> Delete step</DropdownMenuItem>
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

      <ConversionCaseFormDialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen} conversionCase={editingCase} />
    </div>
  );
}
