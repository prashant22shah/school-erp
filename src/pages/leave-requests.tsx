import { useMemo, useState } from "react";
import { CalendarOff, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LeaveRequestFormDialog } from "@/pages/leave-request-form-dialog";
import { useLeaveRequests, useDeleteLeaveRequest } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { LeaveRequest } from "@/lib/types";

const leaveTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "purple"> = {
  sick: "warning",
  casual: "info",
  annual: "success",
  maternity: "purple",
  unpaid: "secondary",
};

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
  cancelled: "secondary",
};

export default function LeaveRequestsPage() {
  const query = useLeaveRequests();
  const del = useDeleteLeaveRequest();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveRequest | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.staffName.toLowerCase().includes(s) || r.leaveType.toLowerCase().includes(s) || r.status.toLowerCase().includes(s) || r.reason.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const pending = (query.data ?? []).filter((r) => r.status === "pending").length;
  const approved = (query.data ?? []).filter((r) => r.status === "approved").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarOff} title="Leave Requests" titleNe="बिदा अनुरोध" microModule="M13.04" description="Staff leave applications, approvals and balances." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="leaveRequests">New Leave Request</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><CalendarOff className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Requests</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><CalendarOff className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending</p><p className="text-lg font-bold">{pending}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CalendarOff className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Approved</p><p className="text-lg font-bold">{approved}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search leave requests…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff</TableHead><TableHead>Type</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead>Reason</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.staffName}</TableCell><TableCell><Badge variant={leaveTypeVariant[r.leaveType] ?? "secondary"} className="capitalize">{r.leaveType}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.fromDate)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(r.toDate)}</span></TableCell><TableCell><span className="text-sm font-mono">{r.days}</span></TableCell><TableCell><Badge variant={statusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell><span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">{r.reason}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="leaveRequests" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <LeaveRequestFormDialog open={open} onOpenChange={setOpen} leaveRequest={editing} />
    </div>
  );
}
