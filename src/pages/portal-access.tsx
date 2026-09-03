import { useMemo, useState } from "react";
import { ShieldCheck, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { PortalAccessLogFormDialog } from "@/pages/portal-access-log-form-dialog";
import { usePortalAccessLogs, useDeletePortalAccessLog } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { PortalAccessLog } from "@/lib/types";

const portalVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  student: "info",
  parent: "success",
  teacher: "secondary",
  admin: "warning",
  kiosk: "purple",
};

export default function PortalAccessPage() {
  const query = usePortalAccessLogs();
  const del = useDeletePortalAccessLog();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PortalAccessLog | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((l) => l.userName.toLowerCase().includes(s) || l.portal.toLowerCase().includes(s) || l.action.toLowerCase().includes(s) || l.userRef.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const student = (query.data ?? []).filter((l) => l.portal === "student").length;
  const parent = (query.data ?? []).filter((l) => l.portal === "parent").length;
  const teacher = (query.data ?? []).filter((l) => l.portal === "teacher").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={ShieldCheck} title="Portal Access Logs" titleNe="पोर्टल पहुँच लग" microModule="M11.02" description="Audit portal access and activity across student, parent and staff portals." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Access Log</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total logs</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Student portal</p><p className="text-lg font-bold">{student}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Parent portal</p><p className="text-lg font-bold">{parent}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><ShieldCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Teacher portal</p><p className="text-lg font-bold">{teacher}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by user, portal or action…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Portal</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>IP</TableHead><TableHead>Accessed On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((l) => (<TableRow key={l.id} className="group"><TableCell className="pl-5"><Badge variant={portalVariant[l.portal] ?? "secondary"} className="capitalize">{l.portal}</Badge></TableCell><TableCell><div className="flex flex-col"><span className="font-medium">{l.userName}</span><code className="text-xs text-muted-foreground">{l.userRef}</code></div></TableCell><TableCell><Badge variant="secondary">{l.action}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{l.ip ?? "—"}</code></TableCell><TableCell><span className="text-sm">{fmtDate(l.accessedOn)}</span></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(l); setOpen(true); }}><Pencil /> Edit log</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(l)}><Trash2 /> Delete log</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <PortalAccessLogFormDialog open={open} onOpenChange={setOpen} log={editing} />
    </div>
  );
}
