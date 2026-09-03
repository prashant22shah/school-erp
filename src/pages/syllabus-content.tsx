import { useMemo, useState } from "react";
import { FileText, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SyllabusPlanFormDialog } from "@/pages/syllabus-plan-form-dialog";
import { ContentPlanItemFormDialog } from "@/pages/content-plan-item-form-dialog";
import { useSyllabusPlans, useContentPlanItems, useDeleteSyllabusPlan, useDeleteContentPlanItem } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { SyllabusPlan, ContentPlanItem } from "@/lib/types";

const syllabusStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary", approved: "info", published: "success", archived: "warning",
};

export default function SyllabusContentPage() {
  const plans = useSyllabusPlans();
  const items = useContentPlanItems();
  const deletePlan = useDeleteSyllabusPlan();
  const deleteItem = useDeleteContentPlanItem();
  const [q, setQ] = useState("");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SyllabusPlan | undefined>();
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentPlanItem | undefined>();

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(s) || p.offeringRef.toLowerCase().includes(s) || p.academicPeriodRef.toLowerCase().includes(s)); }
    return list;
  }, [plans.data, q]);

  const filteredItems = useMemo(() => {
    let list = items.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.topic.toLowerCase().includes(s) || i.syllabusPlanId.toLowerCase().includes(s)); }
    return list;
  }, [items.data, q]);

  const publishedPlans = (plans.data ?? []).filter((p) => p.status === "published").length;
  const totalItems = items.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Syllabus & Content"
        titleNe="पाठ्यक्रम र सामग्री"
        microModule="M06.02"
        description="Syllabus plans and content items organized by sequence and assessment method."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingPlan(undefined); setPlanDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Plan
            </Button>
            <Button onClick={() => { setEditingItem(undefined); setItemDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New Item
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Syllabus plans</p><p className="text-lg font-bold">{plans.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Published plans</p><p className="text-lg font-bold">{publishedPlans}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><FileText className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Content items</p><p className="text-lg font-bold">{totalItems}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search plans or content…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Syllabus Plans</TabsTrigger>
          <TabsTrigger value="items">Content Items</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Name</TableHead>
                      <TableHead>Offering Ref</TableHead>
                      <TableHead>Academic Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5 font-medium">{p.name}</TableCell>
                        <TableCell><Badge variant="secondary">{p.offeringRef}</Badge></TableCell>
                        <TableCell><Badge variant="secondary">{p.academicPeriodRef}</Badge></TableCell>
                        <TableCell><Badge variant={syllabusStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingPlan(p); setPlanDialogOpen(true); }}><Pencil /> Edit plan</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deletePlan.mutate(p)}><Trash2 /> Delete plan</DropdownMenuItem>
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

        <TabsContent value="items" className="mt-4">
          {items.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Topic</TableHead>
                      <TableHead>Syllabus Plan</TableHead>
                      <TableHead>Sequence</TableHead>
                      <TableHead>Assessment Method</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((i) => (
                      <TableRow key={i.id} className="group">
                        <TableCell className="pl-5">{i.topic}</TableCell>
                        <TableCell><Badge variant="secondary">{i.syllabusPlanId}</Badge></TableCell>
                        <TableCell><span className="text-sm font-mono">{i.sequence}</span></TableCell>
                        <TableCell><span className="text-sm">{i.assessmentMethod ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingItem(i); setItemDialogOpen(true); }}><Pencil /> Edit item</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteItem.mutate(i)}><Trash2 /> Delete item</DropdownMenuItem>
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

      <SyllabusPlanFormDialog open={planDialogOpen} onOpenChange={setPlanDialogOpen} plan={editingPlan} />
      <ContentPlanItemFormDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} item={editingItem} />
    </div>
  );
}
