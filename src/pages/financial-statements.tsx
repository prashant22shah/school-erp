import { useMemo, useState } from "react";
import { FileBarChart, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useFinancialStatements, useDeleteFinancialStatement } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { FinancialStatement } from "@/lib/types";

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  balance_sheet: "info",
  income_statement: "success",
  cash_flow: "secondary",
  trial_balance: "warning",
};

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  final: "success",
};

export default function FinancialStatementsPage() {
  const query = useFinancialStatements();
  const del = useDeleteFinancialStatement();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<FinancialStatement | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(s) || f.type.toLowerCase().includes(s) || f.fiscalYearName.toLowerCase().includes(s) || f.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const final = (query.data ?? []).filter((f) => f.status === "final").length;
  const draft = total - final;

  return (
    <div className="space-y-6">
      <PageHeader icon={FileBarChart} title="Financial Statements" titleNe="वित्तीय विवरण" microModule="M12.24" description="Balance sheet, income statement, cash flow and trial balance reports." actions={<CanCreate resource="financialStatements"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>Generate Statement</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileBarChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Statements</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileBarChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Final</p><p className="text-lg font-bold">{final}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FileBarChart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Draft</p><p className="text-lg font-bold">{draft}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search statements…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="statements">
        <TabsList><TabsTrigger value="statements">Statements</TabsTrigger><TabsTrigger value="types">Types</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="statements" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Type</TableHead><TableHead>Fiscal Year</TableHead><TableHead>As Of</TableHead><TableHead>Debit</TableHead><TableHead>Credit</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((f) => (<TableRow key={f.id} className="group"><TableCell className="pl-5 font-medium">{f.name}</TableCell><TableCell><Badge variant={typeVariant[f.type] ?? "secondary"} className="capitalize">{f.type.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{f.fiscalYearName}</span></TableCell><TableCell><span className="text-sm">{fmtDate(f.asOfDate)}</span></TableCell><TableCell><span className="text-sm font-mono">{f.totalDebit.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{f.totalCredit.toLocaleString()}</span></TableCell><TableCell><Badge variant={statusVariant[f.status] ?? "secondary"} className="capitalize">{f.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="financialStatements" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="types" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Balance Sheet</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "balance_sheet").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Income Statement</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "income_statement").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Cash Flow</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "cash_flow").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Trial Balance</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "trial_balance").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Financial statements are generated from the chart of accounts and journal entries. Ensure period close is completed before generating final statements.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
