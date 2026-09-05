import { useMemo, useState } from "react";
import { Utensils, Search, Plus, Beef, DollarSign } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { MealPlanFormDialog } from "@/pages/meal-plan-form-dialog";
import { MessManagementFormDialog } from "@/pages/mess-management-form-dialog";
import { useMealPlans, useMessManagement, useDeleteMealPlan, useDeleteMessManagement } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { MealPlan, MessManagement } from "@/lib/types";

const mealTypeVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  vegetarian: "success", non_vegetarian: "info", vegan: "warning", special: "secondary",
};
const planStatusVariant: Record<string, "success" | "secondary"> = {
  active: "success", inactive: "secondary",
};
const messStatusVariant: Record<string, "info" | "warning" | "success" | "secondary"> = {
  planned: "info", prepared: "warning", served: "success", cancelled: "secondary",
};

export default function MealPlansDining() {
  const plans = useMealPlans();
  const mess = useMessManagement();
  const deletePlan = useDeleteMealPlan();
  const deleteMess = useDeleteMessManagement();
  const [q, setQ] = useState("");
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MealPlan | undefined>();
  const [messDialogOpen, setMessDialogOpen] = useState(false);
  const [editingMess, setEditingMess] = useState<MessManagement | undefined>();

  const filteredPlans = useMemo(() => {
    let list = plans.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s) || p.type.includes(s)); }
    return list;
  }, [plans.data, q]);

  const filteredMess = useMemo(() => {
    let list = mess.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.mealType.includes(s) || m.date.includes(s) || m.notes.toLowerCase().includes(s)); }
    return list;
  }, [mess.data, q]);

  const totalPlans = plans.data?.length ?? 0;
  const totalServed = (mess.data ?? []).filter((m) => m.status === "served").length;
  const totalMessCost = (mess.data ?? []).filter((m) => m.status === "served").reduce((sum, m) => sum + m.totalCost, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Utensils}
        title="Meal Plans & Dining"
        titleNe="खाना योजना"
        microModule="M18.05"
        description="Manage meal plans, mess scheduling, and dining cost tracking."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="residenceBlocks">
              <Button variant="outline" onClick={() => { setEditingPlan(undefined); setPlanDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New meal plan
              </Button>
            </CanCreate>
            <CanCreate resource="residenceBlocks">
              <Button onClick={() => { setEditingMess(undefined); setMessDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New mess entry
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Utensils className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Meal plans</p><p className="text-lg font-bold">{totalPlans}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Beef className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Meals served</p><p className="text-lg font-bold">{totalServed}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total mess cost</p><p className="text-lg font-bold">NPR {totalMessCost.toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search plans, mess entries…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="plans">
        <TabsList>
          <TabsTrigger value="plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="mess">Mess Management</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="mt-4">
          {plans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Plan</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Meals/Day</TableHead>
                      <TableHead>Monthly Rate</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((p) => (
                      <TableRow key={p.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{p.name}</p>
                          {p.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.code}</code></TableCell>
                        <TableCell><Badge variant={mealTypeVariant[p.type] ?? "secondary"} className="capitalize">{p.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{p.mealsPerDay}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{p.monthlyRate?.toLocaleString()}</span></TableCell>
                        <TableCell><Badge variant={planStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingPlan(p); setPlanDialogOpen(true); }} onDelete={() => deletePlan.mutate(p)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mess" className="mt-4">
          {mess.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Date</TableHead>
                      <TableHead>Meal</TableHead>
                      <TableHead>Prepared For</TableHead>
                      <TableHead>Served</TableHead>
                      <TableHead>Cost/Head</TableHead>
                      <TableHead>Total Cost</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMess.map((m) => (
                      <TableRow key={m.id} className="group">
                        <TableCell className="pl-5"><span className="text-xs">{fmtDate(m.date)}</span></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{m.mealType}</Badge></TableCell>
                        <TableCell><span className="text-sm">{m.preparedFor}</span></TableCell>
                        <TableCell><span className="text-sm">{m.servedCount}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{m.costPerHead}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{m.totalCost?.toLocaleString()}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{m.notes || "—"}</span></TableCell>
                        <TableCell><Badge variant={messStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingMess(m); setMessDialogOpen(true); }} onDelete={() => deleteMess.mutate(m)} />
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

      <MealPlanFormDialog open={planDialogOpen} onOpenChange={setPlanDialogOpen} editing={editingPlan} />
      <MessManagementFormDialog open={messDialogOpen} onOpenChange={setMessDialogOpen} editing={editingMess} />
    </div>
  );
}
