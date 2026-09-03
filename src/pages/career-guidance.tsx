import { useMemo, useState } from "react";
import { Compass, GraduationCap, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { GuidanceProfileFormDialog } from "@/pages/guidance-profile-form-dialog";
import { useGuidanceProfiles, useGuidanceSessions, useExternalApplications, useDeleteGuidanceProfile, useDeleteGuidanceSession, useDeleteExternalApplication } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { GuidanceProfile, GuidanceSession, ExternalApplication } from "@/lib/types";

const profileStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", inactive: "secondary",
};
const sessionStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  scheduled: "info", completed: "success", follow_up_needed: "warning",
};
const appStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  preparing: "secondary", submitted: "info", accepted: "success", rejected: "warning", waitlisted: "info",
};

export default function CareerGuidancePage() {
  const profiles = useGuidanceProfiles();
  const sessions = useGuidanceSessions();
  const apps = useExternalApplications();
  const deleteProfile = useDeleteGuidanceProfile();
  const deleteSession = useDeleteGuidanceSession();
  const deleteApp = useDeleteExternalApplication();
  const [q, setQ] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<GuidanceProfile | undefined>();

  const filteredProfiles = useMemo(() => {
    let list = profiles.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((p) => p.studentName.toLowerCase().includes(s) || p.interests.toLowerCase().includes(s) || p.careerGoals.toLowerCase().includes(s) || p.status.toLowerCase().includes(s)); }
    return list;
  }, [profiles.data, q]);

  const filteredSessions = useMemo(() => {
    let list = sessions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((se) => se.studentName.toLowerCase().includes(s) || se.counselorName.toLowerCase().includes(s) || se.summary.toLowerCase().includes(s) || se.status.toLowerCase().includes(s)); }
    return list;
  }, [sessions.data, q]);

  const filteredApps = useMemo(() => {
    let list = apps.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.studentName.toLowerCase().includes(s) || a.destination.toLowerCase().includes(s) || a.status.toLowerCase().includes(s)); }
    return list;
  }, [apps.data, q]);

  const activeProfiles = (profiles.data ?? []).filter((p) => p.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Compass}
        title="Career Guidance & Applications"
        titleNe="करियर मार्गदर्शन"
        microModule="M21.04–M21.05"
        description="Manage guidance profiles, counseling sessions and external scholarship applications."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="guidanceProfiles">
              <Button variant="outline" onClick={() => { setEditingProfile(undefined); setProfileOpen(true); }}><Plus className="h-4 w-4" /> New Profile</Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Compass className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Guidance Profiles</p><p className="text-lg font-bold">{profiles.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Compass className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active Profiles</p><p className="text-lg font-bold">{activeProfiles}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><GraduationCap className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">External Applications</p><p className="text-lg font-bold">{apps.data?.length ?? 0}</p></div></CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search profiles, sessions or applications…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>

      <Tabs defaultValue="profiles">
        <TabsList><TabsTrigger value="profiles">Guidance Profiles</TabsTrigger><TabsTrigger value="sessions">Sessions</TabsTrigger><TabsTrigger value="applications">External Applications</TabsTrigger></TabsList>

        <TabsContent value="profiles" className="mt-4">
          {profiles.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Interests</TableHead><TableHead>Career Goals</TableHead><TableHead>Aptitude Notes</TableHead><TableHead>Consent</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredProfiles.map((p) => (<TableRow key={p.id} className="group"><TableCell className="pl-5 font-medium">{p.studentName}</TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{p.interests}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{p.careerGoals}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{p.aptitudeNotes}</span></TableCell><TableCell><Badge variant={p.consentGiven ? "success" : "secondary"}>{p.consentGiven ? "Yes" : "No"}</Badge></TableCell><TableCell><Badge variant={profileStatusVariant[p.status] ?? "secondary"} className="capitalize">{p.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="guidanceProfiles" onEdit={() => { setEditingProfile(p); setProfileOpen(true); }} onDelete={() => deleteProfile.mutate(p)} editLabel="Edit profile" deleteLabel="Delete profile" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          {sessions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Counselor</TableHead><TableHead>Date</TableHead><TableHead>Summary</TableHead><TableHead>Recommendations</TableHead><TableHead>Follow-Up</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredSessions.map((se) => (<TableRow key={se.id} className="group"><TableCell className="pl-5 font-medium">{se.studentName}</TableCell><TableCell>{se.counselorName}</TableCell><TableCell><span className="text-sm font-mono">{se.sessionDate.slice(0, 10)}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{se.summary}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{se.recommendations}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{se.followUp}</span></TableCell><TableCell><Badge variant={sessionStatusVariant[se.status] ?? "secondary"} className="capitalize">{se.status.replace("_", " ")}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="guidanceSessions" onEdit={() => {}} onDelete={() => deleteSession.mutate(se)} editLabel="Edit session" deleteLabel="Delete session" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          {apps.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Student</TableHead><TableHead>Destination</TableHead><TableHead>Deadline</TableHead><TableHead>Applied</TableHead><TableHead>Documents</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredApps.map((a) => (<TableRow key={a.id} className="group"><TableCell className="pl-5 font-medium">{a.studentName}</TableCell><TableCell><Badge variant="secondary">{a.destination}</Badge></TableCell><TableCell><span className="text-sm font-mono">{a.deadline.slice(0, 10)}</span></TableCell><TableCell><span className="text-sm font-mono">{a.applicationDate.slice(0, 10)}</span></TableCell><TableCell><span className="line-clamp-1 text-sm text-muted-foreground">{a.documents}</span></TableCell><TableCell><Badge variant={appStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="externalApplications" onEdit={() => {}} onDelete={() => deleteApp.mutate(a)} editLabel="Edit application" deleteLabel="Delete application" /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <GuidanceProfileFormDialog open={profileOpen} onOpenChange={setProfileOpen} profile={editingProfile} />
    </div>
  );
}
