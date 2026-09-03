import { useMemo, useState } from "react";
import { Users, Briefcase, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { StaffProfileFormDialog } from "@/pages/staff-profile-form-dialog";
import { PositionFormDialog } from "@/pages/position-form-dialog";
import { useStaffProfiles, usePositions, useDeleteStaffProfile, useDeletePosition } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { StaffProfile, Position } from "@/lib/types";

const staffStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success" | "destructive"> = {
  active: "success",
  on_leave: "warning",
  suspended: "destructive",
  resigned: "secondary",
  retired: "info",
};

export default function StaffPage() {
  const staffProfiles = useStaffProfiles();
  const positions = usePositions();
  const deleteStaffProfile = useDeleteStaffProfile();
  const deletePosition = useDeletePosition();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<StaffProfile | undefined>();
  const [positionOpen, setPositionOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | undefined>();

  const filteredStaff = useMemo(() => {
    let list = staffProfiles.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(s) || p.staffCode.toLowerCase().includes(s) || p.department.toLowerCase().includes(s) || p.designation.toLowerCase().includes(s) || p.status.toLowerCase().includes(s));
    }
    return list;
  }, [staffProfiles.data, q]);

  const filteredPositions = useMemo(() => {
    let list = positions.data ?? [];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s) || p.department.toLowerCase().includes(s) || p.grade.toLowerCase().includes(s));
    }
    return list;
  }, [positions.data, q]);

  const activeCount = (staffProfiles.data ?? []).filter((s) => s.status === "active").length;
  const onLeaveCount = (staffProfiles.data ?? []).filter((s) => s.status === "on_leave").length;
  const vacantCount = (positions.data ?? []).filter((p) => p.isVacant).length;

  return (
    <div className="space-y-6">
      <PageHeader icon={Users} title="Staff Management" titleNe="कर्मचारी व्यवस्थापन" microModule="M13.01/M13.02" description="Staff profiles, departments and organisational positions." actions={<div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => { setEditingProfile(undefined); setProfileOpen(true); }}><CanCreate resource="staffProfiles">New Staff</CanCreate></Button><Button onClick={() => { setEditingPosition(undefined); setPositionOpen(true); }}> New Position</Button></div>} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Staff</p><p className="text-lg font-bold">{staffProfiles.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Users className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">On Leave</p><p className="text-lg font-bold">{onLeaveCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Briefcase className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Positions / Vacant</p><p className="text-lg font-bold">{positions.data?.length ?? 0} / {vacantCount}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search staff or positions…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="profiles">
        <TabsList><TabsTrigger value="profiles">Staff Profiles</TabsTrigger><TabsTrigger value="positions">Positions</TabsTrigger></TabsList>

        <TabsContent value="profiles" className="mt-4">
          {staffProfiles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Staff Code</TableHead><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Designation</TableHead><TableHead>Join Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredStaff.map((s) => (<TableRow key={s.id} className="group"><TableCell className="pl-5"><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.staffCode}</code></TableCell><TableCell className="font-medium">{s.name}</TableCell><TableCell><Badge variant="secondary">{s.department}</Badge></TableCell><TableCell><span className="text-sm text-muted-foreground">{s.designation}</span></TableCell><TableCell><span className="text-sm">{fmtDate(s.joinDate)}</span></TableCell><TableCell><Badge variant={staffStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="staffProfiles" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          {positions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Department</TableHead><TableHead>Grade</TableHead><TableHead>Head Count</TableHead><TableHead>Vacant</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPositions.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.title}</TableCell><TableCell><Badge variant="secondary">{p.department}</Badge></TableCell><TableCell><span className="text-sm">{p.grade}</span></TableCell><TableCell><span className="text-sm font-mono">{p.headCount}</span></TableCell><TableCell><Badge variant={p.isVacant ? "warning" : "success"}>{p.isVacant ? "Vacant" : "Filled"}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="positions" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <StaffProfileFormDialog open={profileOpen} onOpenChange={setProfileOpen} staffProfile={editingProfile} />
      <PositionFormDialog open={positionOpen} onOpenChange={setPositionOpen} position={editingPosition} />
    </div>
  );
}
