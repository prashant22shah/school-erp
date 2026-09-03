import { useMemo, useState } from "react";
import { UsersRound, Trophy, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ActivityGroupFormDialog } from "@/pages/activity-group-form-dialog";
import { useActivityGroups, useGroupMemberships, useDeleteActivityGroup, useDeleteGroupMembership } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { ActivityGroup, GroupMembership } from "@/lib/types";

const groupStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", inactive: "secondary", dissolved: "warning",
};
const membershipStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  active: "success", inactive: "secondary",
};

export default function ClubsActivitiesPage() {
  const groups = useActivityGroups();
  const memberships = useGroupMemberships();
  const deleteGroup = useDeleteActivityGroup();
  const deleteMembership = useDeleteGroupMembership();
  const [q, setQ] = useState("");
  const [groupOpen, setGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ActivityGroup | undefined>();
  const [membershipOpen, setMembershipOpen] = useState(false);
  const [editingMembership, setEditingMembership] = useState<GroupMembership | undefined>();

  const filteredGroups = useMemo(() => {
    let list = groups.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((g) => g.name.toLowerCase().includes(s) || g.type.toLowerCase().includes(s) || g.code.toLowerCase().includes(s)); }
    return list;
  }, [groups.data, q]);

  const filteredMemberships = useMemo(() => {
    let list = memberships.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((m) => m.memberName.toLowerCase().includes(s) || m.groupName.toLowerCase().includes(s) || m.role.toLowerCase().includes(s)); }
    return list;
  }, [memberships.data, q]);

  const activeGroups = (groups.data ?? []).filter((g) => g.status === "active").length;

  return (
    <div className="space-y-6">
      <PageHeader icon={UsersRound} title="Clubs, Houses & Societies" titleNe="क्लब" microModule="M20.02" description="Manage activity groups, houses, clubs and society memberships." actions={<div className="flex gap-2"><CanCreate resource="activityGroups"><Button variant="outline" onClick={() => { setEditingGroup(undefined); setGroupOpen(true); }}><Plus className="h-4 w-4" /> New Group</Button></CanCreate><CanCreate resource="groupMemberships"><Button onClick={() => { setEditingMembership(undefined); setMembershipOpen(true); }}><Plus className="h-4 w-4" /> New Membership</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><UsersRound className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Groups</p><p className="text-lg font-bold">{groups.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><UsersRound className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeGroups}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Trophy className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Memberships</p><p className="text-lg font-bold">{memberships.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search groups or memberships…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="groups">
        <TabsList><TabsTrigger value="groups">Groups</TabsTrigger><TabsTrigger value="memberships">Memberships</TabsTrigger></TabsList>
        <TabsContent value="groups" className="mt-4">
          {groups.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Type</TableHead><TableHead>Code</TableHead><TableHead>Advisor</TableHead><TableHead>Members</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredGroups.map((g) => (<TableRow key={g.id} className="group"><TableCell className="pl-5 font-medium">{g.name}</TableCell><TableCell><Badge variant="secondary" className="capitalize">{g.type}</Badge></TableCell><TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{g.code}</code></TableCell><TableCell><span className="text-sm">{g.advisorName}</span></TableCell><TableCell><span className="text-sm">{g.memberCount}</span></TableCell><TableCell><Badge variant={groupStatusVariant[g.status] ?? "secondary"} className="capitalize">{g.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="activityGroups" onEdit={() => { setEditingGroup(g); setGroupOpen(true); }} onDelete={() => deleteGroup.mutate(g)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="memberships" className="mt-4">
          {memberships.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Member</TableHead><TableHead>Group</TableHead><TableHead>Role</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredMemberships.map((m) => (<TableRow key={m.id} className="group"><TableCell className="pl-5 font-medium">{m.memberName}</TableCell><TableCell><Badge variant="secondary">{m.groupName}</Badge></TableCell><TableCell><span className="text-sm capitalize">{m.role.replace("_", " ")}</span></TableCell><TableCell><span className="text-sm font-mono">{m.validFrom} → {m.validTo}</span></TableCell><TableCell><Badge variant={membershipStatusVariant[m.status] ?? "secondary"} className="capitalize">{m.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="groupMemberships" onEdit={() => { setEditingMembership(m); setMembershipOpen(true); }} onDelete={() => deleteMembership.mutate(m)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <ActivityGroupFormDialog open={groupOpen} onOpenChange={setGroupOpen} group={editingGroup} />
      <ActivityGroupFormDialog open={membershipOpen} onOpenChange={setMembershipOpen} membership={editingMembership} />
    </div>
  );
}
