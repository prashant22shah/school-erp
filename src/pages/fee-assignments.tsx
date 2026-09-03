import { useMemo, useState } from "react";
import { UserCheck, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FeeAssignmentFormDialog } from "@/pages/fee-assignment-form-dialog";
import { useFeeAssignments, useDeleteFeeAssignment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { FeeAssignment } from "@/lib/types";

const statusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  assigned: "info",
  invoiced: "success",
  waived: "warning",
};

export default function FeeAssignmentsPage() {
  const query = useFeeAssignments();
  const del = useDeleteFeeAssignment();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FeeAssignment | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((a) => a.studentName.toLowerCase().includes(s) || (a.feeStructureName ?? "").toLowerCase().includes(s) || a.status.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const assigned = (query.data ?? []).filter((a) => a.status === "assigned").length;
  const invoiced = (query.data ?? []).filter((a) => a.status === "invoiced").length;
  const waived = (query.data ?? []).filter((a) => a.status === "waived").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={UserCheck} title="Fee Assignments" titleNe="शुल्क असाइनमेन्ट" microModule="M12.06/M12.09" description="Assign fee structures to students, discounts and due dates." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="feeAssignments">New Assignment</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{query.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Assigned</p><p className="text-lg font-bold">{assigned}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Invoiced</p><p className="text-lg font-bold">{invoiced}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><UserCheck className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Waived</p><p className="text-lg font-bold">{waived}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search assignments…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Fee Structure</TableHead><TableHead>Amount</TableHead><TableHead>Discount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.studentName}</TableCell><TableCell><Badge variant="secondary">{a.feeStructureName ?? a.feeStructureId.slice(0, 8)}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm text-muted-foreground">{a.discountAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm">{fmtDate(a.dueDate)}</span></TableCell><TableCell><Badge variant={statusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="feeAssignments" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <FeeAssignmentFormDialog open={open} onOpenChange={setOpen} assignment={editing} />
    </div>
  );
}
