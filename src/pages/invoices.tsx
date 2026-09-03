import { useMemo, useState } from "react";
import { FileText, Receipt, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { InvoiceFormDialog } from "@/pages/invoice-form-dialog";
import { CreditNoteFormDialog } from "@/pages/credit-note-form-dialog";
import { useInvoices, useCreditNotes, useDeleteInvoice, useDeleteCreditNote } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Invoice, CreditNote } from "@/lib/types";

const invoiceStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  issued: "info",
  paid: "success",
  overdue: "warning",
  cancelled: "secondary",
};

const creditStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  draft: "secondary",
  approved: "info",
  applied: "success",
  rejected: "warning",
};

export default function InvoicesPage() {
  const invoices = useInvoices();
  const creditNotes = useCreditNotes();
  const deleteInvoice = useDeleteInvoice();
  const deleteCredit = useDeleteCreditNote();
  const [q, setQ] = useState("");
  const [invOpen, setInvOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Invoice | undefined>();
  const [creditOpen, setCreditOpen] = useState(false);
  const [editingCredit, setEditingCredit] = useState<CreditNote | undefined>();

  const filteredInvoices = useMemo(() => {
    let list = invoices.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((inv) => inv.invoiceNo.toLowerCase().includes(s) || inv.studentName.toLowerCase().includes(s) || inv.status.toLowerCase().includes(s));
    }
    return list;
  }, [invoices.data, q]);

  const filteredCredits = useMemo(() => {
    let list = creditNotes.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((c) => (c.invoiceNo ?? c.invoiceId).toLowerCase().includes(s) || c.reason.toLowerCase().includes(s) || c.status.toLowerCase().includes(s));
    }
    return list;
  }, [creditNotes.data, q]);

  const overdue = (invoices.data ?? []).filter((i) => i.status === "overdue").length;
  const paid = (invoices.data ?? []).filter((i) => i.status === "paid").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="Invoices & Credit Notes"
        titleNe="बिल तथा क्रेडिट नोट"
        microModule="M12.07/M12.08/M12.12"
        description="Student invoices, balances and credit note adjustments."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingInv(undefined); setInvOpen(true); }}><Plus className="h-4 w-4" /> New Invoice</Button>
            <Button onClick={() => { setEditingCredit(undefined); setCreditOpen(true); }}><Plus className="h-4 w-4" /> New Credit Note</Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Invoices</p><p className="text-lg font-bold">{invoices.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Paid</p><p className="text-lg font-bold">{paid}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><FileText className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Overdue</p><p className="text-lg font-bold">{overdue}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Receipt className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Credit Notes</p><p className="text-lg font-bold">{creditNotes.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search invoices or credit notes…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="invoices">
        <TabsList><TabsTrigger value="invoices">Invoices</TabsTrigger><TabsTrigger value="credits">Credit Notes</TabsTrigger></TabsList>

        <TabsContent value="invoices" className="mt-4">
          {invoices.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Invoice No</TableHead><TableHead>Student</TableHead><TableHead>Issue / Due</TableHead><TableHead>Amount</TableHead><TableHead>Paid / Balance</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredInvoices.map((inv) => (<TableRow key={inv.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{inv.invoiceNo}</code></TableCell><TableCell className="font-medium">{inv.studentName}</TableCell><TableCell><span className="text-sm">{fmtDate(inv.issueDate)} / {fmtDate(inv.dueDate)}</span></TableCell><TableCell><span className="text-sm font-mono">{inv.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{inv.paidAmount.toLocaleString()} / {inv.balance.toLocaleString()}</span></TableCell><TableCell><Badge variant={invoiceStatusVariant[inv.status] ?? "secondary"} className="capitalize">{inv.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingInv(inv); setInvOpen(true); }}><Pencil /> Edit invoice</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteInvoice.mutate(inv)}><Trash2 /> Delete invoice</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="credits" className="mt-4">
          {creditNotes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Invoice</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCredits.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5"><Badge variant="secondary">{c.invoiceNo ?? c.invoiceId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{c.amount.toLocaleString()}</span></TableCell><TableCell><span className="line-clamp-1 max-w-[280px] text-sm text-muted-foreground">{c.reason}</span></TableCell><TableCell><Badge variant={creditStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(c.createdOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditingCredit(c); setCreditOpen(true); }}><Pencil /> Edit credit note</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteCredit.mutate(c)}><Trash2 /> Delete credit note</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <InvoiceFormDialog open={invOpen} onOpenChange={setInvOpen} invoice={editingInv} />
      <CreditNoteFormDialog open={creditOpen} onOpenChange={setCreditOpen} creditNote={editingCredit} />
    </div>
  );
}
