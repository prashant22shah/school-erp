import { useMemo, useState } from "react";
import { Bell, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { useDunningNotices, useDeleteDunningNotice } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { DunningNotice } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  scheduled: "secondary",
  sent: "info",
  acknowledged: "success",
  escalated: "warning",
};

const levelVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  reminder: "info",
  warning: "warning",
  final_notice: "default",
  legal: "secondary",
};

export default function DunningPage() {
  const query = useDunningNotices();
  const del = useDeleteDunningNotice();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<DunningNotice | undefined>();
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((n) => n.studentName.toLowerCase().includes(s) || n.level.toLowerCase().includes(s) || n.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const scheduled = (query.data ?? []).filter((n) => n.status === "scheduled").length;
  const sent = (query.data ?? []).filter((n) => n.status === "sent").length;
  const acknowledged = (query.data ?? []).filter((n) => n.status === "acknowledged").length;
  const escalated = (query.data ?? []).filter((n) => n.status === "escalated").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Bell} title="Dunning & Collections" titleNe="सम्झौता पत्र" microModule="M12.13" description="Payment reminder notices, escalation schedules and collection tracking." actions={<CanCreate resource="dunning"><Button onClick={() => { setEditing(undefined); setOpen(true); }}>New Notice</Button></CanCreate>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Scheduled</p><p className="text-lg font-bold">{scheduled}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Sent</p><p className="text-lg font-bold">{sent}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Acknowledged</p><p className="text-lg font-bold">{acknowledged}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-rose-100 p-2 text-rose-600"><Bell className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Escalated</p><p className="text-lg font-bold">{escalated}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search notices…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="notices">
        <TabsList><TabsTrigger value="notices">Notices</TabsTrigger><TabsTrigger value="schedule">Schedule</TabsTrigger><TabsTrigger value="escalation">Escalation</TabsTrigger></TabsList>

        <TabsContent value="notices" className="mt-4">
          {query.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Balance</TableHead><TableHead>Level</TableHead><TableHead>Status</TableHead><TableHead>Sent</TableHead><TableHead>Next Action</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((n) => (<TableRow key={n.id} className="group"><TableCell className="pl-5 font-medium">{n.studentName}</TableCell><TableCell><span className="text-sm font-mono">NPR {n.balanceAmount.toLocaleString()}</span></TableCell><TableCell><Badge variant={levelVariant[n.level] ?? "secondary"} className="capitalize">{n.level.replace("_", " ")}</Badge></TableCell><TableCell><Badge variant={statusVariant[n.status] ?? "secondary"} className="capitalize">{n.status}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(n.sentAt)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(n.nextActionDate)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="dunning" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="schedule" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Reminder</p><p className="text-lg font-bold">{(query.data ?? []).filter((n) => n.level === "reminder").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Warning</p><p className="text-lg font-bold">{(query.data ?? []).filter((n) => n.level === "warning").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Final Notice</p><p className="text-lg font-bold">{(query.data ?? []).filter((n) => n.level === "final_notice").length}</p></div>
              <div className="rounded-lg bg-muted p-4"><p className="text-xs text-muted-foreground">Legal</p><p className="text-lg font-bold">{(query.data ?? []).filter((n) => n.level === "legal").length}</p></div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="escalation" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Escalation rules define automatic level upgrades based on aging days. Configured in Finance Setup (M12.01).</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
