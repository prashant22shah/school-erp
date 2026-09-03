import { useMemo, useState } from "react";
import { Heart, Stethoscope, Syringe, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { HealthProfileFormDialog } from "@/pages/health-profile-form-dialog";
import { useHealthProfiles, useClinicVisits, useDeleteHealthProfile, useDeleteClinicVisit } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { HealthProfile, ClinicVisit, ImmunizationRecord } from "@/lib/types";

const healthStatusVariant: Record<string, "default" | "info" | "warning" | "success"> = {
  active: "success", inactive: "default", archived: "warning",
};

const visitStatusVariant: Record<string, "default" | "info" | "warning"> = {
  open: "info", closed: "default", referred: "warning",
};

const immunizationStatusVariant: Record<string, "default" | "info" | "warning"> = {
  completed: "info", pending: "default", overdue: "warning",
};

const mockImmunizations: ImmunizationRecord[] = [
  { id: "imm1", studentName: "Aarav Sharma", studentRef: "STU-001", vaccine: "BCG", doseNumber: 1, dateGiven: "2075-03-15", nextDue: "", evidenceRef: "", status: "completed", createdOn: "2075-03-15" },
  { id: "imm2", studentName: "Anita Gurung", studentRef: "STU-002", vaccine: "Polio (OPV)", doseNumber: 3, dateGiven: "2076-08-20", nextDue: "2077-02-20", evidenceRef: "", status: "completed", createdOn: "2076-08-20" },
  { id: "imm3", studentName: "Bikash Thapa", studentRef: "STU-003", vaccine: "Hepatitis B", doseNumber: 2, dateGiven: "", nextDue: "2082-09-01", evidenceRef: "", status: "pending", createdOn: "2082-01-10" },
  { id: "imm4", studentName: "Sunita Rai", studentRef: "STU-004", vaccine: "MMR", doseNumber: 1, dateGiven: "", nextDue: "2082-06-15", evidenceRef: "", status: "overdue", createdOn: "2082-01-05" },
];

export default function HealthClinicPage() {
  const profiles = useHealthProfiles();
  const visits = useClinicVisits();
  const deleteProfile = useDeleteHealthProfile();
  const deleteVisit = useDeleteClinicVisit();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<HealthProfile | undefined>();
  const [visitOpen, setVisitOpen] = useState(false);
  const [editingVisit, setEditingVisit] = useState<ClinicVisit | undefined>();

  const filteredProfiles = useMemo(() => {
    let list = profiles.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.bloodGroup.toLowerCase().includes(s)); }
    return list;
  }, [profiles.data, q]);

  const filteredVisits = useMemo(() => {
    let list = visits.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((v) => v.studentName.toLowerCase().includes(s) || v.practitioner.toLowerCase().includes(s)); }
    return list;
  }, [visits.data, q]);

  const activeProfiles = (profiles.data ?? []).filter((p) => p.status === "active").length;
  const openVisits = (visits.data ?? []).filter((v) => v.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Heart}
        title="Health & Clinic"
        titleNe="स्वास्थ्य तथा क्लिनिक"
        microModule="M19.01"
        description="Student health profiles, clinic visits and immunization records."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="healthProfiles"><Button variant="outline" onClick={() => { setEditingProfile(undefined); setProfileOpen(true); }}><Plus className="h-4 w-4" /> New Health Profile</Button></CanCreate>
            <CanCreate resource="clinicVisits"><Button onClick={() => { setEditingVisit(undefined); setVisitOpen(true); }}><Plus className="h-4 w-4" /> New Clinic Visit</Button></CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-rose-100 p-2 text-rose-600"><Heart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Health Profiles</p><p className="text-lg font-bold">{profiles.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Heart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Profiles</p><p className="text-lg font-bold">{activeProfiles}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Stethoscope className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Clinic Visits</p><p className="text-lg font-bold">{visits.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Stethoscope className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open Visits</p><p className="text-lg font-bold">{openVisits}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students, blood groups, practitioners…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="profiles">
        <TabsList>
          <TabsTrigger value="profiles">Health Profiles</TabsTrigger>
          <TabsTrigger value="visits">Clinic Visits</TabsTrigger>
          <TabsTrigger value="immunizations">Immunizations</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="mt-4">
          {profiles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Blood Group</TableHead><TableHead>Allergies</TableHead><TableHead>Conditions</TableHead><TableHead>Emergency Contact</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredProfiles.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5"><span className="font-medium">{p.studentName}</span><br /><span className="text-xs text-muted-foreground">{p.studentRef}</span></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.bloodGroup || "—"}</code></TableCell><TableCell><span className="text-sm">{p.allergies || "None"}</span></TableCell><TableCell><span className="text-sm">{p.conditions || "None"}</span></TableCell><TableCell><span className="text-sm">{p.emergencyContact || "—"}</span></TableCell><TableCell><Badge variant={healthStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="healthProfiles" onEdit={() => { setEditingProfile(p); setProfileOpen(true); }} onDelete={() => deleteProfile.mutate(p)} editLabel="Edit profile" deleteLabel="Delete profile" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="visits" className="mt-4">
          {visits.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Date</TableHead><TableHead>Practitioner</TableHead><TableHead>Reason</TableHead><TableHead>Diagnosis</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredVisits.map((v) => (<TableRow key={v.id} className="group"><TableCell className="pl-5"><span className="font-medium">{v.studentName}</span><br /><span className="text-xs text-muted-foreground">{v.studentRef}</span></TableCell><TableCell><span className="text-sm">{fmtDate(v.visitDate)}</span></TableCell><TableCell><span className="text-sm">{v.practitioner}</span></TableCell><TableCell><span className="text-sm">{v.reason}</span></TableCell><TableCell><span className="text-sm">{v.diagnosis || "—"}</span></TableCell><TableCell><Badge variant={visitStatusVariant[v.status] ?? "secondary"} className="capitalize">{v.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="clinicVisits" onEdit={() => { setEditingVisit(v); setVisitOpen(true); }} onDelete={() => deleteVisit.mutate(v)} editLabel="Edit visit" deleteLabel="Delete visit" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="immunizations" className="mt-4">
          <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Vaccine</TableHead><TableHead>Dose #</TableHead><TableHead>Date Given</TableHead><TableHead>Next Due</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{mockImmunizations.map((i) => (<TableRow key={i.id}><TableCell className="pl-5"><span className="font-medium">{i.studentName}</span><br /><span className="text-xs text-muted-foreground">{i.studentRef}</span></TableCell><TableCell><Badge variant="secondary">{i.vaccine}</Badge></TableCell><TableCell><span className="text-sm">{i.doseNumber}</span></TableCell><TableCell><span className="text-sm">{i.dateGiven ? fmtDate(i.dateGiven) : "—"}</span></TableCell><TableCell><span className="text-sm">{i.nextDue ? fmtDate(i.nextDue) : "—"}</span></TableCell><TableCell><Badge variant={immunizationStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <HealthProfileFormDialog open={profileOpen} onOpenChange={setProfileOpen} healthProfile={editingProfile} />
      <HealthProfileFormDialog open={visitOpen} onOpenChange={setVisitOpen} clinicVisit={editingVisit} />
    </div>
  );
}
