import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLibraryReservation } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryReservation, ReservationStatus } from "@/lib/types";

const STATUSES: ReservationStatus[] = ["pending", "ready", "collected", "cancelled", "expired"];

export function LibraryReservationFormDialog({ open, onOpenChange, reservation }: { open: boolean; onOpenChange: (o: boolean) => void; reservation?: LibraryReservation | null }) {
  const save = useSaveLibraryReservation();
  const [form, setForm] = useState<Partial<LibraryReservation>>({});

  useEffect(() => {
    if (open) {
      setForm(
        reservation ?? {
          memberId: "",
          resourceId: "",
          reservedOn: new Date().toISOString().slice(0, 10),
          expiresOn: "",
          status: "pending",
        }
      );
    }
  }, [open, reservation]);

  const set = (patch: Partial<LibraryReservation>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.memberId || !form.resourceId || !form.reservedOn || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: reservation?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: reservation?.createdOn ?? now,
        updatedOn: now,
        memberId: form.memberId!,
        memberName: form.memberName || undefined,
        resourceId: form.resourceId!,
        resourceTitle: form.resourceTitle || undefined,
        reservedOn: form.reservedOn!,
        expiresOn: form.expiresOn || undefined,
        status: form.status!,
      } as LibraryReservation,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{reservation ? `Edit reservation — ${reservation.id}` : "Create reservation"}</DialogTitle>
          <DialogDescription>Reserve resources for members (M16.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Member ID</Label>
            <Input placeholder="e.g. lm-2" value={form.memberId ?? ""} onChange={(e) => set({ memberId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Resource ID</Label>
            <Input placeholder="e.g. lr-2" value={form.resourceId ?? ""} onChange={(e) => set({ resourceId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Member Name (optional)</Label>
            <Input placeholder="Member display name" value={form.memberName ?? ""} onChange={(e) => set({ memberName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Resource Title (optional)</Label>
            <Input placeholder="Title for display" value={form.resourceTitle ?? ""} onChange={(e) => set({ resourceTitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Reserved On</Label>
            <Input type="date" value={form.reservedOn ? form.reservedOn.slice(0, 10) : ""} onChange={(e) => set({ reservedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Expires On (optional)</Label>
            <Input type="date" value={form.expiresOn ? form.expiresOn.slice(0, 10) : ""} onChange={(e) => set({ expiresOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ReservationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.memberId || !form.resourceId || !form.reservedOn || !form.status}>
            <Plus className="h-4 w-4" /> {reservation ? "Save changes" : "Create reservation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
