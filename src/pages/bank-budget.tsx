import { useMemo, useState } from "react";
import { Landmark, PiggyBank, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { BankAccountFormDialog } from "@/pages/bank-account-form-dialog";
import { BudgetFormDialog } from "@/pages/budget-form-dialog";
import { useBankAccounts, useBudgets, useDeleteBankAccount, useDeleteBudget } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { BankAccount, Budget } from "@/lib/types";

const budgetStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  approved: "success",
  locked: "warning",
};

export default function BankBudgetPage() {
  const banks = useBankAccounts();
  const budgets = useBudgets();
  const deleteBank = useDeleteBankAccount();
  const deleteBudget = useDeleteBudget();
  const [q, setQ] = useState("");
  const [bankOpen, setBankOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | undefined>();
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  const filteredBanks = useMemo(() => {
    let list = banks.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.bankName.toLowerCase().includes(s) || b.accountName.toLowerCase().includes(s) || b.accountNo.toLowerCase().includes(s) || b.currency.toLowerCase().includes(s));
    }
    return list;
  }, [banks.data, q]);

  const filteredBudgets = useMemo(() => {
    let list = budgets.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.department.toLowerCase().includes(s) || (b.fiscalYearName ?? "").toLowerCase().includes(s) || b.status.toLowerCase().includes(s));
    }
    return list;
  }, [budgets.data, q]);

  const activeBanks = (banks.data ?? []).filter((b) => b.isActive).length;
  const totalBalance = (banks.data ?? []).reduce((s, b) => s + b.balance, 0);
  const approvedBudgets = (budgets.data ?? []).filter((b) => b.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Bank & Budget"
        titleNe="बैंक तथा बजेट"
        microModule="M12.17/M12.19"
        description="Bank accounts, balances and departmental budgets."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="bankAccounts"><Button variant="outline" onClick={() => { setEditingBank(undefined); setBankOpen(true); }}>New Bank Account</Button></CanCreate>
            <Button onClick={() => { setEditingBudget(undefined); setBudgetOpen(true); }}> New Budget</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Bank Accounts</p><p className="text-lg font-bold">{banks.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><PiggyBank className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Accounts</p><p className="text-lg font-bold">{activeBanks}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><PiggyBank className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Balance</p><p className="text-lg font-bold">{totalBalance.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Budgets / Approved</p><p className="text-lg font-bold">{budgets.data?.length ?? 0} / {approvedBudgets}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search banks or budgets…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="banks">
        <TabsList><TabsTrigger value="banks">Bank Accounts</TabsTrigger><TabsTrigger value="budgets">Budgets</TabsTrigger></TabsList>

        <TabsContent value="banks" className="mt-4">
          {banks.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Bank</TableHead><TableHead>Account No</TableHead><TableHead>Account Name</TableHead><TableHead>Balance</TableHead><TableHead>Currency</TableHead><TableHead>Active</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBanks.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5 font-medium">{b.bankName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{b.accountNo}</code></TableCell><TableCell><span className="text-sm">{b.accountName}</span></TableCell><TableCell><span className="text-sm font-mono">{b.balance.toLocaleString()}</span></TableCell><TableCell><Badge variant="secondary">{b.currency}</Badge></TableCell><TableCell><Badge variant={b.isActive ? "success" : "secondary"}>{b.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="bankAccounts" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="budgets" className="mt-4">
          {budgets.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Department</TableHead><TableHead>Fiscal Year</TableHead><TableHead>Allocated</TableHead><TableHead>Utilized</TableHead><TableHead>Remaining</TableHead><TableHead>Status</TableHead><TableHead>Updated</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBudgets.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5 font-medium">{b.department}</TableCell><TableCell><Badge variant="secondary">{b.fiscalYearName ?? b.fiscalYearId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{b.allocatedAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{b.utilizedAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{(b.allocatedAmount - b.utilizedAmount).toLocaleString()}</span></TableCell><TableCell><Badge variant={budgetStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{fmtDate(b.updatedOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="budgets" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <BankAccountFormDialog open={bankOpen} onOpenChange={setBankOpen} account={editingBank} />
      <BudgetFormDialog open={budgetOpen} onOpenChange={setBudgetOpen} budget={editingBudget} />
    </div>
  );
}
