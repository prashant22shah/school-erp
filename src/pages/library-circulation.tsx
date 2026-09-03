import { useMemo, useState } from "react";
import { Users, BookOpen, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { LibraryMemberFormDialog } from "@/pages/library-member-form-dialog";
import { LibraryLoanFormDialog } from "@/pages/library-loan-form-dialog";
import { LibraryReservationFormDialog } from "@/pages/library-reservation-form-dialog";
import { useLibraryMembers, useLibraryLoans, useLibraryReservations, useDeleteLibraryMember, useDeleteLibraryLoan, useDeleteLibraryReservation } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { LibraryMember, LibraryLoan, LibraryReservation } from "@/lib/types";

const memberStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  suspended: "warning",
  expired: "secondary",
  blocked: "destructive",
};

const memberTypeVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  student: "info",
  staff: "secondary",
  external: "warning",
};

const loanStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  issued: "info",
  returned: "success",
  overdue: "destructive",
  lost: "destructive",
  renewed: "warning",
};

const reservationStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  pending: "warning",
  ready: "info",
  collected: "success",
  cancelled: "secondary",
  expired: "destructive",
};

export default function LibraryCirculationPage() {
  const members = useLibraryMembers();
  const loans = useLibraryLoans();
  const reservations = useLibraryReservations();
  const deleteMember = useDeleteLibraryMember();
  const deleteLoan = useDeleteLibraryLoan();
  const deleteReservation = useDeleteLibraryReservation();
  const [q, setQ] = useState("");
  const [memberOpen, setMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<LibraryMember | undefined>();
  const [loanOpen, setLoanOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<LibraryLoan | undefined>();
  const [reservationOpen, setReservationOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<LibraryReservation | undefined>();

  const filteredMembers = useMemo(() => {
    let list = members.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((m) => m.userName.toLowerCase().includes(s) || m.cardNo.toLowerCase().includes(s) || m.memberType.toLowerCase().includes(s) || m.status.toLowerCase().includes(s));
    }
    return list;
  }, [members.data, q]);

  const filteredLoans = useMemo(() => {
    let list = loans.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((l) => (l.memberName ?? "").toLowerCase().includes(s) || (l.resourceTitle ?? "").toLowerCase().includes(s) || l.status.toLowerCase().includes(s) || l.holdingId.toLowerCase().includes(s));
    }
    return list;
  }, [loans.data, q]);

  const filteredReservations = useMemo(() => {
    let list = reservations.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((r) => (r.memberName ?? "").toLowerCase().includes(s) || (r.resourceTitle ?? "").toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
    }
    return list;
  }, [reservations.data, q]);

  const activeMembers = (members.data ?? []).filter((m) => m.status === "active").length;
  const activeLoans = (loans.data ?? []).filter((l) => l.status === "issued" || l.status === "renewed").length;
  const overdueLoans = (loans.data ?? []).filter((l) => l.status === "overdue").length;
  const pendingReservations = (reservations.data ?? []).filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="Library Circulation"
        titleNe="पुस्तकालय परिचालन"
        microModule="M16.03"
        description="Membership and circulation — issue, return and reservations."
        actions={
          <div className="flex flex-wrap gap-2">
            <CanCreate resource="libraryMembers"><Button variant="outline" onClick={() => { setEditingMember(undefined); setMemberOpen(true); }}>New Member</Button></CanCreate>
            <CanCreate resource="libraryLoans"><Button variant="outline" onClick={() => { setEditingLoan(undefined); setLoanOpen(true); }}>New Loan</Button></CanCreate>
            <CanCreate resource="libraryReservations"><Button onClick={() => { setEditingReservation(undefined); setReservationOpen(true); }}>New Reservation</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Members</p><p className="text-lg font-bold">{members.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Members</p><p className="text-lg font-bold">{activeMembers}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Loans</p><p className="text-lg font-bold">{activeLoans}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><BookOpen className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Pending Reservations</p><p className="text-lg font-bold">{pendingReservations} / {overdueLoans} overdue</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search members, loans or reservations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="members">
        <TabsList><TabsTrigger value="members">Members</TabsTrigger><TabsTrigger value="loans">Loans</TabsTrigger><TabsTrigger value="reservations">Reservations</TabsTrigger></TabsList>

        <TabsContent value="members" className="mt-4">
          {members.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Card No</TableHead><TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Enrolled On</TableHead><TableHead>Valid Until</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMembers.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{m.cardNo}</code></TableCell><TableCell><div className="flex flex-col"><span className="font-medium">{m.userName}</span><code className="text-xs text-muted-foreground">{m.userRef}</code></div></TableCell><TableCell><Badge variant={memberTypeVariant[m.memberType] ?? "secondary"} className="capitalize">{m.memberType}</Badge></TableCell><TableCell><span className="text-sm">{fmtDate(m.enrolledOn)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(m.validUntil)}</span></TableCell><TableCell><Badge variant={memberStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="libraryMembers" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="loans" className="mt-4">
          {loans.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Member</TableHead><TableHead>Resource / Holding</TableHead><TableHead>Issued On</TableHead><TableHead>Due On</TableHead><TableHead>Returned On</TableHead><TableHead>Fine</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredLoans.map((l) => (<TableRow key={l.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{l.memberName ?? l.memberId}</span><code className="text-xs text-muted-foreground">{l.memberId}</code></div></TableCell><TableCell><div className="flex flex-col"><span className="text-sm font-medium">{l.resourceTitle ?? "—"}</span><code className="text-xs text-muted-foreground">{l.holdingId}</code></div></TableCell><TableCell><span className="text-sm">{fmtDate(l.issuedOn)}</span></TableCell><TableCell><span className="text-sm">{fmtDate(l.dueOn)}</span></TableCell><TableCell><span className="text-sm">{l.returnedOn ? fmtDate(l.returnedOn) : "—"}</span></TableCell><TableCell><span className="text-sm font-mono">NPR {l.fineAmount}</span></TableCell><TableCell><Badge variant={loanStatusVariant[l.status] ?? "secondary"} className="capitalize">{l.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="libraryLoans" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="reservations" className="mt-4">
          {reservations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Member</TableHead><TableHead>Resource</TableHead><TableHead>Reserved On</TableHead><TableHead>Expires On</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredReservations.map((r) => (<TableRow key={r.id} className="group"><TableCell className="pl-5"><div className="flex flex-col"><span className="font-medium">{r.memberName ?? r.memberId}</span><code className="text-xs text-muted-foreground">{r.memberId}</code></div></TableCell><TableCell><div className="flex flex-col"><span className="text-sm font-medium">{r.resourceTitle ?? r.resourceId}</span><code className="text-xs text-muted-foreground">{r.resourceId}</code></div></TableCell><TableCell><span className="text-sm">{fmtDate(r.reservedOn)}</span></TableCell><TableCell><span className="text-sm">{r.expiresOn ? fmtDate(r.expiresOn) : "—"}</span></TableCell><TableCell><Badge variant={reservationStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="libraryReservations" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <LibraryMemberFormDialog open={memberOpen} onOpenChange={setMemberOpen} member={editingMember} />
      <LibraryLoanFormDialog open={loanOpen} onOpenChange={setLoanOpen} loan={editingLoan} />
      <LibraryReservationFormDialog open={reservationOpen} onOpenChange={setReservationOpen} reservation={editingReservation} />
    </div>
  );
}
