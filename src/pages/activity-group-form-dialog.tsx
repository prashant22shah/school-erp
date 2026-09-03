import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveActivityGroup, useSaveGroupMembership, useActivityGroups } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ActivityGroup, GroupMembership } from "@/lib/types";

const GROUP_TYPES: ActivityGroup["type"][] = ["club", "house", "society", "team", "committee"];
const GROUP_STATUSES: ActivityGroup["status"][] = ["active", "inactive", "dissolved"];
const MEMBERSHIP_ROLES: GroupMembership["role"][] = ["member", "officer", "president", "vice_president", "secretary", "treasurer"];
const MEMBERSHIP_STATUSES: GroupMembership["status"][] = ["active", "inactive"];

export function ActivityGroupFormDialog({ open, onOpenChange, group, membership }: { open: boolean; onOpenChange: (o: boolean) => void; group?: ActivityGroup; membership?: GroupMembership }) {
  const saveGroup = useSaveActivityGroup();
  const saveMembership = useSaveGroupMembership();
  const groups = useActivityGroups();
  const [groupForm, setGroupForm] = useState<Partial<ActivityGroup>>({});
  const [membershipForm, setMembershipForm] = useState<Partial<GroupMembership>>({});
  const isGroup = !membership;

  useEffect(() => {
    if (open) {
      if (group) setGroupForm(group);
      else setGroupForm({ name: "", type: "club", code: "", description: "", advisorName: "", memberCount: 0, status: "active" });
      if (membership) setMembershipForm(membership);
      else setMembershipForm({ groupRef: "", memberName: "", memberRef: "", role: "member", validFrom: "", validTo: "", status: "active" });
    }
  }, [open, group, membership]);

  const setGroup = (patch: Partial<ActivityGroup>) => setGroupForm((f) => ({ ...f, ...patch }));
  const setMembership = (patch: Partial<GroupMembership>) => setMembershipForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (isGroup) {
      if (!groupForm.name || !groupForm.type || !groupForm.code) return;
      saveGroup.mutate(
        { ...(group ?? { id: uid(), createdOn: now }), ...groupForm } as ActivityGroup,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      if (!membershipForm.memberName || !membershipForm.groupRef) return;
      saveMembership.mutate(
        { ...(membership ?? { id: uid(), createdOn: now }), ...membershipForm } as GroupMembership,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isGroup ? (group ? `Edit group — ${group.name}` : "Create group") : (membership ? `Edit membership — ${membership.memberName}` : "Create membership")}</DialogTitle>
          <DialogDescription>{isGroup ? "Manage an activity group (M20.02)." : "Add a member to a group (M20.02)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isGroup ? (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Name</Label>
                <Input placeholder="e.g. Science Club" value={groupForm.name ?? ""} onChange={(e) => setGroup({ name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={groupForm.type} onValueChange={(v) => setGroup({ type: v as ActivityGroup["type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GROUP_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Code</Label>
                <Input placeholder="e.g. SC-01" value={groupForm.code ?? ""} onChange={(e) => setGroup({ code: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Advisor</Label>
                <Input placeholder="e.g. Mrs. Sharma" value={groupForm.advisorName ?? ""} onChange={(e) => setGroup({ advisorName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={groupForm.status} onValueChange={(v) => setGroup({ status: v as ActivityGroup["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GROUP_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Input placeholder="Group description" value={groupForm.description ?? ""} onChange={(e) => setGroup({ description: e.target.value })} />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Member Name</Label>
                <Input placeholder="e.g. Hari Prasad" value={membershipForm.memberName ?? ""} onChange={(e) => setMembership({ memberName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Group</Label>
                <Select value={membershipForm.groupRef} onValueChange={(v) => setMembership({ groupRef: v })}>
                  <SelectTrigger><SelectValue placeholder="Select group" /></SelectTrigger>
                  <SelectContent>{(groups.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={membershipForm.role} onValueChange={(v) => setMembership({ role: v as GroupMembership["role"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MEMBERSHIP_ROLES.map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace("_", " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Valid From</Label>
                <Input type="date" value={membershipForm.validFrom ?? ""} onChange={(e) => setMembership({ validFrom: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Valid To</Label>
                <Input type="date" value={membershipForm.validTo ?? ""} onChange={(e) => setMembership({ validTo: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={membershipForm.status} onValueChange={(v) => setMembership({ status: v as GroupMembership["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MEMBERSHIP_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(isGroup ? saveGroup : saveMembership).isPending}>
            <Plus className="h-4 w-4" /> {isGroup ? (group ? "Save changes" : "Create group") : (membership ? "Save changes" : "Create membership")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
