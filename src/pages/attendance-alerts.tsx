import { useMemo, useState } from "react";
import { BellRing, Search, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { AttendanceAlertFormDialog } from "@/pages/attendance-alert-form-dialog";
import { useAttendanceAlerts, useDeleteAttendanceAlert } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { AttendanceAlert } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  open: "warning", acknowledged: "info", resolved: "success", dismissed: "secondary",
};

export default function AttendanceAlertsPage() {
  const alerts = useAttendanceAlerts();
  const del = useDeleteAttendanceAlert();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AttendanceAlert | undefined>();

  const filtered = useMemo(() => {
    let list = alerts.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.alertType.toLowerCase().includes(s) || (a.message ?? "").toLowerCase().includes(s)); }
    return list;
  }, [alerts.data, q]);

  const openCount = (alerts.data ?? []).filter((a) => a.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={BellRing} title="Attendance Alerts & Analytics" titleNe="सतर्कता" microModule="M07.06" description="Chronic absence detection and intervention alerts." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><Plus className="h-4 w-4" /> New Alert</Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BellRing className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total alerts</p><p className="text-lg font-bold">{alerts.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BellRing className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open</p><p className="text-lg font-bold">{openCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BellRing className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Resolved</p><p className="text-lg font-bold">{(alerts.data ?? []).filter((a) => a.status === "resolved").length}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search alerts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {alerts.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Type</TableHead><TableHead>Rule</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.studentName}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{a.alertType.replace("_"," ")}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.ruleVersion}</code></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{a.message ?? "—"}</span></TableCell><TableCell><Badge variant={statusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => { setEditing(a); setOpen(true); }}><Pencil /> Edit alert</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => del.mutate(a)}><Trash2 /> Delete alert</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <AttendanceAlertFormDialog open={open} onOpenChange={setOpen} alert={editing} />
    </div>
  );
}
