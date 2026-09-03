import { useMemo, useState } from "react";
import { Landmark, Layers, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FiscalYearFormDialog } from "@/pages/fiscal-year-form-dialog";
import { ChartOfAccountFormDialog } from "@/pages/chart-of-account-form-dialog";
import { useFiscalYears, useChartOfAccounts, useDeleteFiscalYear, useDeleteChartOfAccount } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { FiscalYear, ChartOfAccount } from "@/lib/types";

const fyStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  open: "success",
  closed: "warning",
  locked: "default",
};

const coaTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  asset: "success",
  liability: "warning",
  income: "info",
  expense: "warning",
  equity: "purple",
};

export default function FinanceSetupPage() {
  const fiscalYears = useFiscalYears();
  const coa = useChartOfAccounts();
  const deleteFy = useDeleteFiscalYear();
  const deleteCoa = useDeleteChartOfAccount();
  const [q, setQ] = useState("");
  const [fyOpen, setFyOpen] = useState(false);
  const [editingFy, setEditingFy] = useState<FiscalYear | undefined>();
  const [coaOpen, setCoaOpen] = useState(false);
  const [editingCoa, setEditingCoa] = useState<ChartOfAccount | undefined>();

  const filteredFy = useMemo(() => {
    let list = fiscalYears.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(s) || f.status.toLowerCase().includes(s));
    }
    return list;
  }, [fiscalYears.data, q]);

  const filteredCoa = useMemo(() => {
    let list = coa.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s) || c.type.toLowerCase().includes(s) || (c.parentName ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [coa.data, q]);

  const openFyCount = (fiscalYears.data ?? []).filter((f) => f.status === "open").length;
  const activeCoa = (coa.data ?? []).filter((c) => c.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Finance Setup"
        titleNe="वित्त सेटअप"
        microModule="M12.01/M12.02"
        description="Fiscal years and chart of accounts — accounting foundation."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingFy(undefined); setFyOpen(true); }}><Plus className="h-4 w-4" /> New Fiscal Year</Button>
            <Button onClick={() => { setEditingCoa(undefined); setCoaOpen(true); }}><Plus className="h-4 w-4" /> New Account</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Fiscal Years</p><p className="text-lg font-bold">{fiscalYears.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open FY</p><p className="text-lg font-bold">{openFyCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Chart of Accounts</p><p className="text-lg font-bold">{coa.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Layers className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Accounts</p><p className="text-lg font-bold">{activeCoa}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search fiscal years or accounts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="fiscal-years">
        <TabsList><TabsTrigger value="fiscal-years">Fiscal Years</TabsTrigger><TabsTrigger value="coa">Chart of Accounts</TabsTrigger></TabsList>

        <TabsContent value="fiscal-years" className="mt-4">
          {fiscalYears.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead>Updated</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredFy.map((f) => (<TableRow key={f.id} className="group"><TableCell className="pl-5 font-medium">{f.name}</TableCell><TableCell><span className="text-sm">{fmtDate(f.startDate)} — {fmtDate(f.endDate)}</span></TableCell><TableCell><Badge variant={fyStatusVariant[f.status] ?? "secondary"} className="capitalize">{f.status}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{fmtDate(f.updatedOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingFy(f); setFyOpen(true); }}><Pencil /> Edit fiscal year</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteFy.mutate(f)}><Trash2 /> Delete fiscal year</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="coa" className="mt-4">
          {coa.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Active</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCoa.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code></TableCell><TableCell className="font-medium">{c.name}</TableCell><TableCell><Badge variant={coaTypeVariant[c.type] ?? "secondary"} className="capitalize">{c.type}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{c.parentName ?? "—"}</span></TableCell><TableCell><Badge variant={c.isActive ? "success" : "secondary"}>{c.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingCoa(c); setCoaOpen(true); }}><Pencil /> Edit account</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteCoa.mutate(c)}><Trash2 /> Delete account</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <FiscalYearFormDialog open={fyOpen} onOpenChange={setFyOpen} fiscalYear={editingFy} />
      <ChartOfAccountFormDialog open={coaOpen} onOpenChange={setCoaOpen} account={editingCoa} />
    </div>
  );
}
