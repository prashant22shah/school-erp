import { useMemo, useState } from "react";
import { Building2, Receipt, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { VendorBillFormDialog } from "@/pages/vendor-bill-form-dialog";
import { ExpenseClaimFormDialog } from "@/pages/expense-claim-form-dialog";
import { useVendorBills, useExpenseClaims, useDeleteVendorBill, useDeleteExpenseClaim } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { VendorBill, ExpenseClaim } from "@/lib/types";

const billStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  approved: "info",
  paid: "success",
  overdue: "warning",
};

const expenseStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  submitted: "info",
  approved: "info",
  rejected: "warning",
  paid: "success",
};

export default function VendorBillsPage() {
  const bills = useVendorBills();
  const claims = useExpenseClaims();
  const deleteBill = useDeleteVendorBill();
  const deleteClaim = useDeleteExpenseClaim();
  const [q, setQ] = useState("");
  const [billOpen, setBillOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<VendorBill | undefined>();
  const [claimOpen, setClaimOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState<ExpenseClaim | undefined>();

  const filteredBills = useMemo(() => {
    let list = bills.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((b) => b.vendorName.toLowerCase().includes(s) || b.billNo.toLowerCase().includes(s) || b.status.toLowerCase().includes(s));
    }
    return list;
  }, [bills.data, q]);

  const filteredClaims = useMemo(() => {
    let list = claims.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => c.staffName.toLowerCase().includes(s) || c.category.toLowerCase().includes(s) || c.status.toLowerCase().includes(s) || (c.description ?? "").toLowerCase().includes(s));
    }
    return list;
  }, [claims.data, q]);

  const overdueBills = (bills.data ?? []).filter((b) => b.status === "overdue").length;
  const pendingClaims = (claims.data ?? []).filter((c) => c.status === "submitted" || c.status === "draft").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Payables & Expenses"
        titleNe="भुक्तानी तथा खर्च"
        microModule="M12.14/M12.15/M12.16"
        description="Vendor bills, payables and staff expense claims."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingBill(undefined); setBillOpen(true); }}><Plus className="h-4 w-4" /> New Vendor Bill</Button>
            <Button onClick={() => { setEditingClaim(undefined); setClaimOpen(true); }}><Plus className="h-4 w-4" /> New Expense Claim</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Vendor Bills</p><p className="text-lg font-bold">{bills.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Building2 className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Overdue Bills</p><p className="text-lg font-bold">{overdueBills}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Expense Claims</p><p className="text-lg font-bold">{claims.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Claims</p><p className="text-lg font-bold">{pendingClaims}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search bills or claims…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="bills">
        <TabsList><TabsTrigger value="bills">Vendor Bills</TabsTrigger><TabsTrigger value="claims">Expense Claims</TabsTrigger></TabsList>

        <TabsContent value="bills" className="mt-4">
          {bills.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Vendor</TableHead><TableHead>Bill No</TableHead><TableHead>Bill Date</TableHead><TableHead>Due Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredBills.map((b) => (<TableRow key={b.id} className="group"><TableCell className="pl-5 font-medium">{b.vendorName}</TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{b.billNo}</code></TableCell><TableCell><span className="text-sm">{fmtDate(b.billDate)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(b.dueDate)}</span></TableCell><TableCell><span className="text-sm font-mono">{b.amount.toLocaleString()}</span></TableCell><TableCell><Badge variant={billStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingBill(b); setBillOpen(true); }}><Pencil /> Edit bill</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteBill.mutate(b)}><Trash2 /> Delete bill</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="claims" className="mt-4">
          {claims.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Category</TableHead><TableHead>Amount</TableHead><TableHead>Claim Date</TableHead><TableHead>Status</TableHead><TableHead>Description</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredClaims.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.staffName}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{c.category}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(c.claimDate)}</span></TableCell><TableCell><Badge variant={expenseStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[220px] text-sm text-muted-foreground">{c.description ?? "—"}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingClaim(c); setClaimOpen(true); }}><Pencil /> Edit claim</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteClaim.mutate(c)}><Trash2 /> Delete claim</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <VendorBillFormDialog open={billOpen} onOpenChange={setBillOpen} bill={editingBill} />
      <ExpenseClaimFormDialog open={claimOpen} onOpenChange={setClaimOpen} claim={editingClaim} />
    </div>
  );
}
