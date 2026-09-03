import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLibraryMember } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryMember, MemberType, LibraryMemberStatus } from "@/lib/types";

const MEMBER_TYPES: MemberType[] = ["student", "staff", "external"];
const STATUSES: LibraryMemberStatus[] = ["active", "suspended", "expired", "blocked"];

export function LibraryMemberFormDialog({ open, onOpenChange, member }: { open: boolean; onOpenChange: (o: boolean) => void; member?: LibraryMember | null }) {
  const save = useSaveLibraryMember();
  const [form, setForm] = useState<Partial<LibraryMember>>({});

  useEffect(() => {
    if (open) {
      setForm(
        member ?? {
          userRef: "",
          userName: "",
          memberType: "student",
          cardNo: "",
          enrolledOn: new Date().toISOString().slice(0, 10),
          validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
          status: "active",
        }
      );
    }
  }, [open, member]);

  const set = (patch: Partial<LibraryMember>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.userRef || !form.userName || !form.memberType || !form.cardNo || !form.enrolledOn || !form.validUntil || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: member?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: member?.createdOn ?? now,
        updatedOn: now,
        userRef: form.userRef!,
        userName: form.userName!,
        memberType: form.memberType!,
        cardNo: form.cardNo!,
        enrolledOn: form.enrolledOn!,
        validUntil: form.validUntil!,
        status: form.status!,
      } as LibraryMember,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{member ? `Edit member — ${member.userName}` : "Create library member"}</DialogTitle>
          <DialogDescription>Membership and borrower management (M16.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>User Ref</Label>
            <Input placeholder="e.g. uid-5" value={form.userRef ?? ""} onChange={(e) => set({ userRef: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Member Type</Label>
            <Select value={form.memberType} onValueChange={(v) => set({ memberType: v as MemberType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MEMBER_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>User Name</Label>
            <Input placeholder="Full name" value={form.userName ?? ""} onChange={(e) => set({ userName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Card No</Label>
            <Input placeholder="e.g. LIB-ST-883" value={form.cardNo ?? ""} onChange={(e) => set({ cardNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as LibraryMemberStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Enrolled On</Label>
            <Input type="date" value={form.enrolledOn ? form.enrolledOn.slice(0, 10) : ""} onChange={(e) => set({ enrolledOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid Until</Label>
            <Input type="date" value={form.validUntil ? form.validUntil.slice(0, 10) : ""} onChange={(e) => set({ validUntil: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.userRef || !form.userName || !form.memberType || !form.cardNo || !form.enrolledOn || !form.validUntil || !form.status}>
            <Plus className="h-4 w-4" /> {member ? "Save changes" : "Create member"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
