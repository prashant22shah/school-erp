import { useMemo, useState } from "react";
import { DollarSign, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CompensationFormDialog } from "@/pages/compensation-form-dialog";
import { useCompensations, useDeleteCompensation } from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Compensation } from "@/lib/types";

const compVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  basic: "default",
  allowance: "info",
  bonus: "success",
  deduction: "destructive",
};

export default function CompensationBenefitsPage() {
  const compensations = useCompensations();
  const deleteComp = useDeleteCompensation();
  const [q, setQ] = useState("");
  const [compOpen, setCompOpen] = useState(false);
  const [editingComp, setEditingComp] = useState<Compensation | undefined>();

  const filteredComps = useMemo(() => {
    let list = compensations.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.staffName.toLowerCase().includes(s) || c.component.toLowerCase().includes(s));
    }
    return list;
  }, [compensations.data, q]);

  const totalStaff = new Set((compensations.data ?? []).map((c) => c.staffRef)).size;
  const withBenefits = new Set((compensations.data ?? []).filter((c) => c.component === "allowance").map((c) => c.staffRef)).size;
  const avgSalary = (compensations.data ?? []).filter((c) => c.component === "basic").length > 0
    ? Math.round((compensations.data ?? []).filter((c) => c.component === "basic").reduce((sum, c) => sum + c.amount, 0) / (compensations.data ?? []).filter((c) => c.component === "basic").length)
    : 0;
  const pendingEnrollments = 0;

  const salaryStructure = useMemo(() => {
    const staffMap: Record<string, { name: string; basic: number; grade: string; scale: string }> = {};
    (compensations.data ?? []).forEach((c) => {
      if (c.component === "basic" && !staffMap[c.staffRef]) {
        staffMap[c.staffRef] = { name: c.staffName, basic: c.amount, grade: "—" , scale: "—" };
      }
    });
    return Object.values(staffMap);
  }, [compensations.data]);

  const benefitPlans = [
    { name: "Health Insurance", enrolled: withBenefits, type: "Health" },
    { name: "Life Insurance", enrolled: Math.floor(withBenefits * 0.8), type: "Insurance" },
    { name: "Pension (EPF)", enrolled: Math.floor(withBenefits * 0.9), type: "Pension" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={DollarSign} title="Compensation & Benefits" titleNe="सुविधा तथा लाभ" microModule="M13.06" description="Salary structure, benefit plans, allowances and deductions." actions={<Button onClick={() => { setEditingComp(undefined); setCompOpen(true); }}><Plus className="h-4 w-4" /> New Component</Button>} />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Staff</p><p className="text-lg font-bold">{totalStaff}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">With Benefits</p><p className="text-lg font-bold">{withBenefits}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Average Salary</p><p className="text-lg font-bold">{avgSalary.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Enrollments</p><p className="text-lg font-bold">{pendingEnrollments}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search compensations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="salary">
        <TabsList><TabsTrigger value="salary">Salary Structure</TabsTrigger><TabsTrigger value="benefits">Benefits</TabsTrigger><TabsTrigger value="allowances">Allowances & Deductions</TabsTrigger></TabsList>

        <TabsContent value="salary" className="mt-4">
          {compensations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Base Salary</TableHead><TableHead>Grade</TableHead><TableHead>Scale</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{salaryStructure.map((s, i) => (<TableRow key={i}><TableCell className="pl-5 font-medium">{s.name}</TableCell><TableCell><span className="text-sm font-mono">{s.basic.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{s.grade}</span></TableCell><TableCell><span className="text-sm">{s.scale}</span></TableCell><TableCell className="pr-5" /></TableRow>))}{salaryStructure.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No salary data available.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Plan</TableHead><TableHead>Type</TableHead><TableHead>Enrolled Staff</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{benefitPlans.map((bp) => (<TableRow key={bp.name}><TableCell className="pl-5 font-medium">{bp.name}</TableCell><TableCell><Badge variant="secondary">{bp.type}</Badge></TableCell><TableCell><span className="text-sm font-mono">{bp.enrolled}</span></TableCell><TableCell><Badge variant="success">Active</Badge></TableCell><TableCell className="pr-5" /></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="allowances" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Allowance Rules</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Component</TableHead><TableHead>Amount</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{(compensations.data ?? []).filter((c) => c.component === "allowance").map((c) => (<TableRow key={c.id}><TableCell className="pl-5 font-medium">{c.staffName}</TableCell><TableCell><span className="text-sm font-mono">{c.amount.toLocaleString()}</span></TableCell><TableCell className="pr-5" /></TableRow>))}{(compensations.data ?? []).filter((c) => c.component === "allowance").length === 0 && <TableRow><TableCell colSpan={2} className="py-8 text-center text-sm text-muted-foreground">No allowances defined.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
            <Card className="animate-fade-up"><CardHeader><CardTitle className="text-sm">Deduction Rules</CardTitle></CardHeader><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Component</TableHead><TableHead>Amount</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{(compensations.data ?? []).filter((c) => c.component === "deduction").map((c) => (<TableRow key={c.id}><TableCell className="pl-5 font-medium">{c.staffName}</TableCell><TableCell><span className="text-sm font-mono">{c.amount.toLocaleString()}</span></TableCell><TableCell className="pr-5" /></TableRow>))}{(compensations.data ?? []).filter((c) => c.component === "deduction").length === 0 && <TableRow><TableCell colSpan={2} className="py-8 text-center text-sm text-muted-foreground">No deductions defined.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      <CompensationFormDialog open={compOpen} onOpenChange={setCompOpen} compensation={editingComp} />
    </div>
  );
}
