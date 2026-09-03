import { useMemo, useState } from "react";
import { Percent, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useTaxCodes, useDeleteTaxCode } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { TaxCode } from "@/lib/types";

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  vat: "info",
  withholding: "warning",
  income: "secondary",
  service: "default",
};

export default function TaxWithholdingPage() {
  const query = useTaxCodes();
  const del = useDeleteTaxCode();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<TaxCode | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((t) => t.code.toLowerCase().includes(s) || t.name.toLowerCase().includes(s) || t.type.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const exempt = (query.data ?? []).filter((t) => t.isExempt).length;
  const active = total - exempt;

  return (
    <div className="space-y-6">
      <PageHeader icon={Percent} title="Tax & Withholding" titleNe="कर" microModule="M12.20" description="Tax codes, withholding rules and VAT configuration." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Tax Code</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Percent className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Codes</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Percent className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Percent className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Exempt</p><p className="text-lg font-bold">{exempt}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search tax codes…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="codes">
        <TabsList><TabsTrigger value="codes">Tax Codes</TabsTrigger><TabsTrigger value="withholding">Withholding</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="codes" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Rate</TableHead><TableHead>Exempt</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((t) => (<TableRow key={t.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{t.code}</code></TableCell><TableCell><span className="text-sm font-medium">{t.name}</span></TableCell><TableCell><Badge variant={typeVariant[t.type] ?? "secondary"} className="capitalize">{t.type}</Badge></TableCell><TableCell><span className="text-sm font-mono">{t.rate}%</span></TableCell><TableCell><Badge variant={t.isExempt ? "warning" : "success"}>{t.isExempt ? "Yes" : "No"}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(t); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(t)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="withholding" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">VAT Codes</p><p className="text-lg font-bold">{(query.data ?? []).filter((t) => t.type === "vat").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Withholding Codes</p><p className="text-lg font-bold">{(query.data ?? []).filter((t) => t.type === "withholding").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Tax codes are applied automatically during invoice generation and vendor bill processing.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
