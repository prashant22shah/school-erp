import { useMemo, useState } from "react";
import { ShieldAlert, Search, Plus, Pencil, Trash2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DutyRuleFormDialog } from "@/pages/duty-rule-form-dialog";
import { ViolationResolveDialog } from "@/pages/violation-resolve-dialog";
import { useDutyRules, useDutyViolations, useDeleteDutyRule } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { DutyRule, DutyViolation } from "@/lib/types";

export default function SegregationOfDuties() {
  const rules = useDutyRules();
  const violations = useDutyViolations();
  const deleteRule = useDeleteDutyRule();
  const [q, setQ] = useState("");
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<DutyRule | undefined>();
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [resolvingViolation, setResolvingViolation] = useState<DutyViolation | undefined>();

  const filteredRules = useMemo(() => {
    let list = rules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s)); }
    return list;
  }, [rules.data, q]);

  const activeRules = (rules.data ?? []).filter((r) => r.isActive).length;
  const openViolations = (violations.data ?? []).filter((v) => v.status === "open").length;
  const criticalViolations = (violations.data ?? []).filter((v) => v.severity === "critical").length;

  const enforcementMap: Record<string, { label: string; variant: "destructive" | "warning" | "secondary" }> = {
    strict: { label: "Strict", variant: "destructive" },
    warning: { label: "Warning", variant: "warning" },
    advisory: { label: "Advisory", variant: "secondary" },
  };

  const severityMap: Record<string, { variant: "destructive" | "warning" | "info" }> = {
    critical: { variant: "destructive" },
    high: { variant: "warning" },
    medium: { variant: "info" },
  };

  const statusMap: Record<string, { variant: "success" | "warning" | "destructive" | "secondary" | "info" }> = {
    open: { variant: "destructive" },
    acknowledged: { variant: "warning" },
    resolved: { variant: "success" },
    waived: { variant: "info" },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ShieldAlert}
        title="Segregation of Duties"
        titleNe="कर्तव्य विभाजन"
        microModule="M02.05"
        description="Conflict-of-interest rules preventing incompatible role combinations — with violation detection, severity tracking and resolution workflow."
        actions={
          <Button onClick={() => { setEditingRule(undefined); setRuleDialogOpen(true); }}>
            <Plus className="h-4 w-4" /> New SoD rule
          </Button>
        }
      />

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldAlert className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active rules</p><p className="text-lg font-bold">{activeRules}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-red-100 p-2 text-red-600"><XCircle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Open violations</p><p className="text-lg font-bold">{openViolations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Critical violations</p><p className="text-lg font-bold">{criticalViolations}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Resolved</p><p className="text-lg font-bold">{(violations.data ?? []).filter((v) => v.status === "resolved").length}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search rules…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="rules">
        <TabsList>
          <TabsTrigger value="rules">SoD Rules</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="mt-4">
          {rules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Rule</TableHead>
                      <TableHead>Conflicting roles</TableHead>
                      <TableHead>Enforcement</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRules.map((r) => {
                      const enf = enforcementMap[r.enforcement];
                      return (
                        <TableRow key={r.id} className="group">
                          <TableCell className="pl-5">
                            <p className="font-medium">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.description}</p>
                            {r.exceptionNote && <p className="mt-1 text-xs text-amber-600">⚠ {r.exceptionNote}</p>}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="purple">{r.conflictingRoles[0]}</Badge>
                              <span className="text-muted-foreground">↔</span>
                              <Badge variant="purple">{r.conflictingRoles[1]}</Badge>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant={enf.variant}>{enf.label}</Badge></TableCell>
                          <TableCell>{r.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Disabled</Badge>}</TableCell>
                          <TableCell><span className="text-xs">{fmtDate(r.createdOn)}</span></TableCell>
                          <TableCell className="pr-5 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setEditingRule(r); setRuleDialogOpen(true); }}><Pencil /> Edit rule</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteRule.mutate(r)}><Trash2 /> Delete rule</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="violations" className="mt-4">
          {violations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Rule</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Conflicting</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Detected</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(violations.data ?? []).map((v) => (
                      <TableRow key={v.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{v.ruleName}</p></TableCell>
                        <TableCell><p className="font-medium">{v.userName}</p></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary">{v.roleA}</Badge>
                            <span className="text-muted-foreground">+</span>
                            <Badge variant="secondary">{v.roleB}</Badge>
                          </div>
                        </TableCell>
                        <TableCell><Badge variant={severityMap[v.severity].variant}>{v.severity}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(v.detectedOn)}</span></TableCell>
                        <TableCell><Badge variant={statusMap[v.status].variant}>{v.status}</Badge></TableCell>
                        <TableCell><p className="max-w-[200px] truncate text-xs text-muted-foreground">{v.notes ?? "—"}</p></TableCell>
                        <TableCell className="pr-5 text-right">
                          {(v.status === "open" || v.status === "acknowledged") && (
                            <Button variant="ghost" size="sm" className="h-7 text-xs opacity-0 group-hover:opacity-100" onClick={() => { setResolvingViolation(v); setResolveDialogOpen(true); }}>
                              <CheckCircle2 className="h-3 w-3" /> Resolve
                            </Button>
                          )}
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

      <DutyRuleFormDialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen} rule={editingRule} />
      {resolvingViolation && <ViolationResolveDialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen} violation={resolvingViolation} />}
    </div>
  );
}
