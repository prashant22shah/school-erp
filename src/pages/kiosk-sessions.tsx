import { useMemo, useState } from "react";
import { Monitor, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { KioskSessionFormDialog } from "@/pages/kiosk-session-form-dialog";
import { useKioskSessions, useDeleteKioskSession } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { KioskSession } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success",
  ended: "secondary",
  error: "warning",
};

export default function KioskSessionsPage() {
  const query = useKioskSessions();
  const del = useDeleteKioskSession();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<KioskSession | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((k) => k.kioskId.toLowerCase().includes(s) || k.location.toLowerCase().includes(s) || k.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const active = (query.data ?? []).filter((k) => k.status === "active").length;
  const ended = (query.data ?? []).filter((k) => k.status === "ended").length;
  const error = (query.data ?? []).filter((k) => k.status === "error").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Monitor} title="Kiosk Sessions" titleNe="कियोस्क सत्र" microModule="M11.05" description="Monitor self-service kiosk sessions and their status." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Session</Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total sessions</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{active}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Ended</p><p className="text-lg font-bold">{ended}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Error</p><p className="text-lg font-bold">{error}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search kiosk or location…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Kiosk ID</TableHead><TableHead>Location</TableHead><TableHead>Started At</TableHead><TableHead>Ended At</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((k) => (<TableRow key={k.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{k.kioskId}</code></TableCell><TableCell className="font-medium">{k.location}</TableCell><TableCell><span className="text-sm">{fmtDate(k.startedAt)}</span></TableCell><TableCell><span className="text-sm">{k.endedAt ? fmtDate(k.endedAt) : "—"}</span></TableCell><TableCell><Badge variant={statusVariant[k.status] ?? "secondary"} className="capitalize">{k.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(k); setOpen(true); }}><Pencil /> Edit session</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(k)}><Trash2 /> Delete session</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <KioskSessionFormDialog open={open} onOpenChange={setOpen} session={editing} />
    </div>
  );
}
