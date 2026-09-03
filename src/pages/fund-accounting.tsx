import { useMemo, useState } from "react";
import { Landmark, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useFunds, useDeleteFund } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Fund } from "@/lib/types";

const typeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  general: "info",
  restricted: "warning",
  endowment: "success",
  project: "secondary",
};

export default function FundAccountingPage() {
  const query = useFunds();
  const del = useDeleteFund();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Fund | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(s) || f.code.toLowerCase().includes(s) || f.type.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const totalBalance = (query.data ?? []).reduce((s, f) => s + f.balance, 0);
  const restricted = (query.data ?? []).filter((f) => f.isRestricted).length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Landmark} title="Fund Accounting" titleNe="कोष लेखा" microModule="M12.22" description="Restricted funds, endowments and project-based fund tracking." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Fund</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Funds</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Balance</p><p className="text-lg font-bold">NPR {totalBalance.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Landmark className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Restricted</p><p className="text-lg font-bold">{restricted}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search funds…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="funds">
        <TabsList><TabsTrigger value="funds">Funds</TabsTrigger><TabsTrigger value="types">Types</TabsTrigger><TabsTrigger value="summary">Summary</TabsTrigger></TabsList>

        <TabsContent value="funds" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Balance</TableHead><TableHead>Restricted</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((f) => (<TableRow key={f.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{f.code}</code></TableCell><TableCell><span className="text-sm font-medium">{f.name}</span></TableCell><TableCell><Badge variant={typeVariant[f.type] ?? "secondary"} className="capitalize">{f.type}</Badge></TableCell><TableCell><span className="text-sm font-mono">NPR {f.balance.toLocaleString()}</span></TableCell><TableCell><Badge variant={f.isRestricted ? "warning" : "secondary"}>{f.isRestricted ? "Yes" : "No"}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(f); setOpen(true); }}><Pencil /> Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(f)}><Trash2 /> Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="types" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">General Fund</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "general").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Restricted</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "restricted").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Endowment</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "endowment").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Project</p><p className="text-lg font-bold">{(query.data ?? []).filter((f) => f.type === "project").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Fund balances are updated through journal entries. Each fund maintains separate books for compliance reporting.</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
