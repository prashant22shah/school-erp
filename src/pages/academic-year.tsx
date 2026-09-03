import { useMemo, useState } from "react";
import { CalendarDays, Search, Plus, Pencil, Trash2, CheckCircle2, Clock, Calendar } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AcademicYearFormDialog } from "@/pages/academic-year-form-dialog";
import { TermFormDialog } from "@/pages/term-form-dialog";
import { useAcademicYears, useTerms, useDeleteAcademicYear, useDeleteTerm } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { AcademicYear, Term } from "@/lib/types";

const statusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  active: "success", planning: "info", closed: "secondary",
  planned: "info", completed: "secondary",
};

export default function AcademicYearPage() {
  const years = useAcademicYears();
  const terms = useTerms();
  const deleteYear = useDeleteAcademicYear();
  const deleteTerm = useDeleteTerm();
  const [q, setQ] = useState("");
  const [yearDialogOpen, setYearDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | undefined>();
  const [termDialogOpen, setTermDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | undefined>();

  const filteredYears = useMemo(() => {
    let list = years.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((y) => y.name.toLowerCase().includes(s)); }
    return list;
  }, [years.data, q]);

  const filteredTerms = useMemo(() => {
    let list = terms.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((t) => t.name.toLowerCase().includes(s) || t.academicYearName.toLowerCase().includes(s)); }
    return list;
  }, [terms.data, q]);

  const activeYear = (years.data ?? []).find((y) => y.isCurrent);
  const activeTerms = (terms.data ?? []).filter((t) => t.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarDays}
        title="Academic Year & Calendar"
        titleNe="शैक्षिक वर्ष तथा पात्रो"
        microModule="M03.01"
        description="Manage academic years, terms and school calendar boundaries."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="academicYears">
              <Button variant="outline" onClick={() => { setEditingYear(undefined); setYearDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New year
              </Button>
            </CanCreate>
            <CanCreate resource="academicYears">
              <Button onClick={() => { setEditingTerm(undefined); setTermDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New term
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarDays className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total years</p><p className="text-lg font-bold">{years.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active year</p><p className="text-lg font-bold">{activeYear?.name ?? "—"}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Calendar className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total terms</p><p className="text-lg font-bold">{terms.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active terms</p><p className="text-lg font-bold">{activeTerms}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search years or terms…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="years">
        <TabsList>
          <TabsTrigger value="years">Academic Years</TabsTrigger>
          <TabsTrigger value="terms">Terms</TabsTrigger>
        </TabsList>

        <TabsContent value="years" className="mt-4">
          {years.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Year</TableHead>
                      <TableHead>BS Year</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Current</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredYears.map((y) => (
                      <TableRow key={y.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{y.name}</p>
                          {y.nameNe && <p className="text-xs text-muted-foreground">{y.nameNe}</p>}
                        </TableCell>
                        <TableCell><span className="text-sm font-mono">{y.bsYear ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(y.startDate)}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(y.endDate)}</span></TableCell>
                        <TableCell><Badge variant={statusVariant[y.status] ?? "secondary"} className="capitalize">{y.status}</Badge></TableCell>
                        <TableCell>{y.isCurrent ? <Badge variant="success">Current</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="academicYears" onEdit={() => { setEditingYear(y); setYearDialogOpen(true); }} onDelete={() => deleteYear.mutate(y)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="terms" className="mt-4">
          {terms.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Term</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Sequence</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTerms.map((t) => (
                      <TableRow key={t.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{t.name}</p>
                          {t.nameNe && <p className="text-xs text-muted-foreground">{t.nameNe}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{t.academicYearName}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{t.sequence}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(t.startDate)}</span></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(t.endDate)}</span></TableCell>
                        <TableCell><Badge variant={statusVariant[t.status] ?? "secondary"} className="capitalize">{t.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="academicYears" onEdit={() => { setEditingTerm(t); setTermDialogOpen(true); }} onDelete={() => deleteTerm.mutate(t)} />
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

      <AcademicYearFormDialog open={yearDialogOpen} onOpenChange={setYearDialogOpen} year={editingYear} />
      <TermFormDialog open={termDialogOpen} onOpenChange={setTermDialogOpen} term={editingTerm} />
    </div>
  );
}
