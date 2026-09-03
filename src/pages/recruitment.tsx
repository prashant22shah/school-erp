import { useMemo, useState } from "react";
import { UserPlus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { RecruitmentFormDialog } from "@/pages/recruitment-form-dialog";
import { useRecruitments, useDeleteRecruitment } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Recruitment } from "@/lib/types";

const stageVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive" | "purple"> = {
  applied: "secondary",
  shortlisted: "info",
  interviewed: "warning",
  offered: "purple",
  hired: "success",
  rejected: "destructive",
};

export default function RecruitmentPage() {
  const query = useRecruitments();
  const del = useDeleteRecruitment();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Recruitment | undefined>();

  const filtered = useMemo(() => {
    let list = query.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => r.applicantName.toLowerCase().includes(s) || (r.positionTitle ?? "").toLowerCase().includes(s) || r.stage.toLowerCase().includes(s));
    }
    return list;
  }, [query.data, q]);

  const total = query.data?.length ?? 0;
  const hired = (query.data ?? []).filter((r) => r.stage === "hired").length;
  const shortlisted = (query.data ?? []).filter((r) => r.stage === "shortlisted").length;
  const rejected = (query.data ?? []).filter((r) => r.stage === "rejected").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={UserPlus} title="Recruitment" titleNe="भर्ती" microModule="M13.03" description="Applicant tracking, hiring stages and position-wise recruitment." actions={<Button onClick={() => { setEditing(undefined); setOpen(true); }}><CanCreate resource="recruitments">New Application</CanCreate></Button>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><UserPlus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total</p><p className="text-lg font-bold">{total}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-sky-100 p-2 text-sky-600"><UserPlus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Shortlisted</p><p className="text-lg font-bold">{shortlisted}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><UserPlus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Hired</p><p className="text-lg font-bold">{hired}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-red-100 p-2 text-red-600"><UserPlus className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Rejected</p><p className="text-lg font-bold">{rejected}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search applicants or positions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      {query.isLoading ? <LoadingBlock /> : (
        <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Applicant</TableHead><TableHead>Position</TableHead><TableHead>Stage</TableHead><TableHead>Applied On</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filtered.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5 font-medium">{r.applicantName}</TableCell><TableCell><Badge variant="secondary">{r.positionTitle ?? r.positionId.slice(0, 8)}</Badge></TableCell><TableCell><Badge variant={stageVariant[r.stage] ?? "secondary"} className="capitalize">{r.stage}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(r.appliedOn)}</span></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="recruitments" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
      )}
      <RecruitmentFormDialog open={open} onOpenChange={setOpen} recruitment={editing} />
    </div>
  );
}
