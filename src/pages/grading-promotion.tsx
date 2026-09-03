import { useMemo, useState } from "react";
import { Award, Search, Plus, Pencil, Trash2, TrendingUp, CheckSquare } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GradingScaleFormDialog } from "@/pages/grading-scale-form-dialog";
import { PromotionRuleFormDialog } from "@/pages/promotion-rule-form-dialog";
import { CompletionRuleFormDialog } from "@/pages/completion-rule-form-dialog";
import { useGradingScales, usePromotionRules, useCompletionRules, useDeleteGradingScale, useDeletePromotionRule } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { GradingScale, PromotionRule, CompletionRule } from "@/lib/types";

export default function GradingPromotionPage() {
  const scales = useGradingScales();
  const promotionRules = usePromotionRules();
  const completionRules = useCompletionRules();
  const deleteScale = useDeleteGradingScale();
  const deletePromotionRule = useDeletePromotionRule();
  const [q, setQ] = useState("");
  const [scaleDialogOpen, setScaleDialogOpen] = useState(false);
  const [editingScale, setEditingScale] = useState<GradingScale | undefined>();
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PromotionRule | undefined>();
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [editingCompletion, setEditingCompletion] = useState<CompletionRule | undefined>();

  const filteredScales = useMemo(() => {
    let list = scales.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sc) => sc.name.toLowerCase().includes(s)); }
    return list;
  }, [scales.data, q]);

  const filteredPromotionRules = useMemo(() => {
    let list = promotionRules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.fromGradeName.toLowerCase().includes(s) || r.toGradeName.toLowerCase().includes(s)); }
    return list;
  }, [promotionRules.data, q]);

  const filteredCompletionRules = useMemo(() => {
    let list = completionRules.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.gradeClassName.toLowerCase().includes(s)); }
    return list;
  }, [completionRules.data, q]);

  const activeRules = (promotionRules.data ?? []).filter((r) => r.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Award}
        title="Grading & Promotion"
        titleNe="ग्रेडिङ तथा बढुवा"
        microModule="M03.05"
        description="Grading scales, promotion rules and completion criteria for student progression."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingScale(undefined); setScaleDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New scale
            </Button>
            <Button variant="outline" onClick={() => { setEditingRule(undefined); setRuleDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New promotion rule
            </Button>
            <Button onClick={() => { setEditingCompletion(undefined); setCompletionDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New completion rule
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Award className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total scales</p><p className="text-lg font-bold">{scales.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><TrendingUp className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Promotion rules</p><p className="text-lg font-bold">{promotionRules.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckSquare className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active rules</p><p className="text-lg font-bold">{activeRules}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CheckSquare className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completion rules</p><p className="text-lg font-bold">{completionRules.data?.length ?? 0}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search scales or rules…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="scales">
        <TabsList>
          <TabsTrigger value="scales">Grading Scales</TabsTrigger>
          <TabsTrigger value="promotion">Promotion Rules</TabsTrigger>
          <TabsTrigger value="completion">Completion Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="scales" className="mt-4">
          {scales.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Scale</TableHead>
                      <TableHead>Grades</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScales.map((sc) => (
                      <TableRow key={sc.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{sc.name}</p>
                          {sc.nameNe && <p className="text-xs text-muted-foreground">{sc.nameNe}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">{sc.description}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {sc.grades.slice(0, 5).map((g, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{g.letter} ({g.gpa})</Badge>
                            ))}
                            {sc.grades.length > 5 && <Badge variant="secondary" className="text-[10px]">+{sc.grades.length - 5}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{sc.isDefault ? <Badge variant="success">Default</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                        <TableCell>{sc.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingScale(sc); setScaleDialogOpen(true); }}><Pencil /> Edit scale</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteScale.mutate(sc)}><Trash2 /> Delete scale</DropdownMenuItem>
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

        <TabsContent value="promotion" className="mt-4">
          {promotionRules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Rule</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Min GPA</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Backlogs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotionRules.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{r.name}</p>
                          {r.nameNe && <p className="text-xs text-muted-foreground">{r.nameNe}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{r.fromGradeName}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{r.toGradeName}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{r.minGpa}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{r.minAttendance}%</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{r.maxBacklogs}</span></TableCell>
                        <TableCell>{r.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingRule(r); setRuleDialogOpen(true); }}><Pencil /> Edit rule</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePromotionRule.mutate(r)}><Trash2 /> Delete rule</DropdownMenuItem>
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

        <TabsContent value="completion" className="mt-4">
          {completionRules.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Rule</TableHead>
                      <TableHead>Grade/Class</TableHead>
                      <TableHead>Min GPA</TableHead>
                      <TableHead>Min Credits</TableHead>
                      <TableHead>Requirements</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompletionRules.map((cr) => (
                      <TableRow key={cr.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{cr.name}</p>
                          {cr.nameNe && <p className="text-xs text-muted-foreground">{cr.nameNe}</p>}
                        </TableCell>
                        <TableCell><Badge variant="secondary">{cr.gradeClassName}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{cr.minGpa}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{cr.minCreditHours}</span></TableCell>
                        <TableCell><span className="text-sm">{cr.requirements || "—"}</span></TableCell>
                        <TableCell>{cr.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Inactive</Badge>}</TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingCompletion(cr); setCompletionDialogOpen(true); }}><Pencil /> Edit rule</DropdownMenuItem>
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

      <GradingScaleFormDialog open={scaleDialogOpen} onOpenChange={setScaleDialogOpen} scale={editingScale} />
      <PromotionRuleFormDialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen} rule={editingRule} />
      <CompletionRuleFormDialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen} rule={editingCompletion} />
    </div>
  );
}
