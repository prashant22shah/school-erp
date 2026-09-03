import { useMemo, useState } from "react";
import { Monitor, Search, Plus, Pencil, Trash2, BookOpen, Key, Clock } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DigitalResourceFormDialog } from "@/pages/digital-resource-form-dialog";
import { useDigitalResources, useDeleteDigitalResource } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { DigitalResource } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  expired: "warning",
  revoked: "destructive",
};

const accessVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  open: "success",
  subscription: "info",
  per_user: "purple",
};

const mockAccessLogs = [
  { id: "al1", user: "Ram Sharma", resource: "Khan Academy", action: "login", ts: "2082-06-10T09:15:00Z" },
  { id: "al2", user: "Sita Thapa", resource: "National Digital Library", action: "view", ts: "2082-06-10T10:30:00Z" },
  { id: "al3", user: "Hari Bahadur", resource: "Coursera for Campus", action: "download", ts: "2082-06-10T11:45:00Z" },
  { id: "al4", user: "Gita Devi", resource: "Khan Academy", action: "login", ts: "2082-06-10T13:20:00Z" },
  { id: "al5", user: "Binod Rai", resource: "IEEE Xplore", action: "view", ts: "2082-06-09T14:00:00Z" },
];

const mockLicenses = [
  { id: "lc1", key: "KA-2082-SCH-001", resource: "Khan Academy", validFrom: "2082-01-01", validUntil: "2082-12-31", seats: 200, used: 145, renewal: "auto" },
  { id: "lc2", key: "CR-2082-CAMP-042", resource: "Coursera for Campus", validFrom: "2082-03-01", validUntil: "2083-02-28", seats: 100, used: 78, renewal: "manual" },
  { id: "lc3", key: "IEEE-XP-2082-XYZ", resource: "IEEE Xplore", validFrom: "2082-04-01", validUntil: "2082-09-30", seats: 50, used: 32, renewal: "auto" },
];

export default function DigitalResourceAccessPage() {
  const query = useDigitalResources();
  const del = useDeleteDigitalResource();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DigitalResource | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(s) || r.provider.toLowerCase().includes(s) || r.accessType.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const active = (query.data ?? []).filter((r) => r.status === "active").length;
  const expired = (query.data ?? []).filter((r) => r.status === "expired").length;
  const licensesUsed = mockLicenses.reduce((sum, l) => sum + l.used, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Monitor}
        title="Digital Resource Access"
        titleNe="डिजिटल स्रोत पहुँच"
        microModule="M16.05"
        description="Digital resources — subscriptions, access logs and license management."
        actions={
          <Button onClick={() => { setEditing(undefined); setOpen(true); }}>
            <Plus className="h-4 w-4" /> New Resource
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Monitor className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Resources</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Key className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Licenses</p><p className="text-lg font-bold">{licensesUsed} seats used</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Expiring Soon</p><p className="text-lg font-bold">{expired}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Usage This Month</p><p className="text-lg font-bold">{active} active</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search resources by title, provider or access type…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="resources">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
          <TabsTrigger value="licenses">Licenses</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Provider</TableHead><TableHead>Access Type</TableHead><TableHead>Valid From</TableHead><TableHead>Valid Until</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{r.title}</span><code className="text-xs text-muted-foreground">{r.url ?? "—"}</code></div></TableCell><TableCell><span className="text-sm">{r.provider}</span></TableCell><TableCell><Badge variant={accessVariant[r.accessType] ?? "secondary"} className="capitalize">{r.accessType.replace("_", " ")}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.validFrom)}</span></TableCell><TableCell><span className="text-sm">{r.validUntil ? fmtDate(r.validUntil) : "—"}</span></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(r); setOpen(true); }}><Pencil /> Edit resource</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(r)}><Trash2 /> Delete resource</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">User</TableHead><TableHead>Resource</TableHead><TableHead>Action</TableHead><TableHead>Timestamp</TableHead></TableRow></TableHeader><TableBody>{mockAccessLogs.map((log) => (<TableRow key={log.id}><TableCell className="pl-5"><span className="font-medium">{log.user}</span></TableCell><TableCell><span className="text-sm">{log.resource}</span></TableCell><TableCell><Badge variant="info" className="capitalize">{log.action}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(log.ts)}</span></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="licenses" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">License Key</TableHead><TableHead>Resource</TableHead><TableHead>Valid From</TableHead><TableHead>Valid Until</TableHead><TableHead>Seats</TableHead><TableHead>Used</TableHead><TableHead>Renewal</TableHead></TableRow></TableHeader><TableBody>{mockLicenses.map((lc) => (<TableRow key={lc.id}><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{lc.key}</code></TableCell><TableCell><span className="font-medium">{lc.resource}</span></TableCell><TableCell><span className="text-sm">{fmtDate(lc.validFrom)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(lc.validUntil)}</span></TableCell><TableCell><span className="text-sm font-mono">{lc.seats}</span></TableCell><TableCell><span className="text-sm font-mono">{lc.used}</span></TableCell><TableCell><Badge variant={lc.renewal === "auto" ? "success" : "warning"} className="capitalize">{lc.renewal}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <DigitalResourceFormDialog open={open} onOpenChange={setOpen} resource={editing} />
    </div>
  );
}
