import { useMemo, useState } from "react";
import { Award, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useScholarshipSchemes, useDeleteScholarshipScheme } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { ScholarshipScheme } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  inactive: "secondary",
  expired: "warning",
  suspended: "info",
};

const discountVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  percentage: "info",
  fixed: "secondary",
  sibling: "purple",
  merit: "success",
  need: "warning",
};

export default function ScholarshipsPage() {
  const query = useScholarshipSchemes();
  const del = useDeleteScholarshipScheme();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<ScholarshipScheme | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((sc) => sc.name.toLowerCase().includes(s) || sc.discountType.toLowerCase().includes(s) || sc.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const activeSchemes = (query.data ?? []).filter((s) => s.status === "active").length;
  const totalRecipients = (query.data ?? []).reduce((s, sc) => s + sc.currentRecipients, 0);
  const discountValue = (query.data ?? []).filter((s) => s.status === "active").reduce((s, sc) => s + sc.discountValue, 0);
  const pending = (query.data ?? []).filter((s) => s.status === "inactive").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Award} title="Scholarships & Discounts" titleNe="छात्रवृत्ति" microModule="M12.09" description="Scholarship schemes, discount rules and recipient tracking." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Scheme</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Schemes</p><p className="text-lg font-bold">{activeSchemes}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Recipients</p><p className="text-lg font-bold">{totalRecipients}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Discount Value</p><p className="text-lg font-bold">{discountValue}%</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Award className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search schemes…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="schemes">
        <TabsList><TabsTrigger value="schemes">Schemes</TabsTrigger><TabsTrigger value="recipients">Recipients</TabsTrigger><TabsTrigger value="rules">Rules</TabsTrigger></TabsList>

        <TabsContent value="schemes" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Grades</TableHead><TableHead>Recipients</TableHead><TableHead>Valid Until</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((sc) => (<TableRow key={sc.id} className="group"><TableCell className="pl-5 font-medium">{sc.name}</TableCell><TableCell><Badge variant={discountVariant[sc.discountType] ?? "secondary"} className="capitalize">{sc.discountType}</Badge></TableCell><TableCell><span className="text-sm font-mono">{sc.discountValue}{sc.discountType === "percentage" ? "%" : ""}</span></TableCell><TableCell><span className="text-sm">{sc.applicableGrades.join(", ")}</span></TableCell><TableCell><span className="text-sm">{sc.currentRecipients}/{sc.maxRecipients}</span></TableCell><TableCell><span className="text-sm">{fmtDate(sc.validUntil)}</span></TableCell><TableCell><Badge variant={statusVariant[sc.status] ?? "secondary"} className="capitalize">{sc.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(sc); setOpen(true); }}><Pencil /> Edit scheme</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(sc)}><Trash2 /> Delete scheme</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="recipients" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Recipient management is handled through fee assignments in the Fee Assignments module (M12.06).</p>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Merit-based</p><p className="text-lg font-bold">{(query.data ?? []).filter((s) => s.discountType === "merit").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Need-based</p><p className="text-lg font-bold">{(query.data ?? []).filter((s) => s.discountType === "need").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Sibling</p><p className="text-lg font-bold">{(query.data ?? []).filter((s) => s.discountType === "sibling").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Fixed Discount</p><p className="text-lg font-bold">{(query.data ?? []).filter((s) => s.discountType === "fixed").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
