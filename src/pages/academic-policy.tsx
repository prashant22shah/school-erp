import { useMemo, useState } from "react";
import { FileText, Search, Plus, Pencil, Trash2, CheckCircle2, Clock, Archive } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AcademicPolicyFormDialog } from "@/pages/academic-policy-form-dialog";
import { useAcademicPolicies, useDeleteAcademicPolicy } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { AcademicPolicy } from "@/lib/types";

const statusVariant: Record<string, "success" | "info" | "warning" | "secondary" | "destructive"> = {
  draft: "secondary", approved: "info", published: "success", archived: "warning",
};

const categoryVariant: Record<string, "default" | "info" | "warning" | "secondary" | "destructive"> = {
  attendance: "default", assessment: "info", promotion: "warning", discipline: "destructive", examination: "secondary", general: "default",
};

export default function AcademicPolicyPage() {
  const policies = useAcademicPolicies();
  const deletePolicy = useDeleteAcademicPolicy();
  const [q, setQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AcademicPolicy | undefined>();

  const filtered = useMemo(() => {
    let list = policies.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)); }
    return list;
  }, [policies.data, q]);

  const published = (policies.data ?? []).filter((p) => p.status === "published").length;
  const drafts = (policies.data ?? []).filter((p) => p.status === "draft").length;
  const archived = (policies.data ?? []).filter((p) => p.status === "archived").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Academic Policies"
        titleNe="शैक्षिक नीतिहरू"
        microModule="M03.06"
        description="School academic policy registry — attendance, assessment, promotion, discipline and examination policies."
        actions={
          <Button onClick={() => { setEditing(undefined); setDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> New policy
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total policies</p><p className="text-lg font-bold">{policies.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Published</p><p className="text-lg font-bold">{published}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{drafts}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Archive className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Archived</p><p className="text-lg font-bold">{archived}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search policies…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {policies.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Policy</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Effective</TableHead>
                      <TableHead>Approved by</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{p.name}</p>
                          {p.nameNe && <p className="text-xs text-muted-foreground">{p.nameNe}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                        </TableCell>
                        <TableCell><Badge variant={categoryVariant[p.category] ?? "secondary"} className="capitalize">{p.category}</Badge></TableCell>
                        <TableCell>
                          <p className="text-xs">{fmtDate(p.effectiveFrom)}</p>
                          {p.effectiveTo && <p className="text-xs text-muted-foreground">→ {fmtDate(p.effectiveTo)}</p>}
                        </TableCell>
                        <TableCell><span className="text-sm">{p.approvedBy ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={statusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditing(p); setDialogOpen(true); }}><Pencil /> Edit policy</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePolicy.mutate(p)}><Trash2 /> Delete policy</DropdownMenuItem>
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

      <AcademicPolicyFormDialog open={dialogOpen} onOpenChange={setDialogOpen} policy={editing} />
    </div>
  );
}
