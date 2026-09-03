import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLibraryLoan } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LibraryLoan, LoanStatus } from "@/lib/types";

const STATUSES: LoanStatus[] = ["issued", "returned", "overdue", "lost", "renewed"];

export function LibraryLoanFormDialog({ open, onOpenChange, loan }: { open: boolean; onOpenChange: (o: boolean) => void; loan?: LibraryLoan | null }) {
  const save = useSaveLibraryLoan();
  const [form, setForm] = useState<Partial<LibraryLoan>>({});

  useEffect(() => {
    if (open) {
      setForm(
        loan ?? {
          memberId: "",
          holdingId: "",
          resourceTitle: "",
          issuedOn: new Date().toISOString().slice(0, 10),
          dueOn: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
          returnedOn: "",
          status: "issued",
          fineAmount: 0,
        }
      );
    }
  }, [open, loan]);

  const set = (patch: Partial<LibraryLoan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.memberId || !form.holdingId || !form.issuedOn || !form.dueOn || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: loan?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: loan?.createdOn ?? now,
        updatedOn: now,
        memberId: form.memberId!,
        memberName: form.memberName || undefined,
        holdingId: form.holdingId!,
        resourceTitle: form.resourceTitle || undefined,
        issuedOn: form.issuedOn!,
        dueOn: form.dueOn!,
        returnedOn: form.returnedOn || undefined,
        status: form.status!,
        fineAmount: form.fineAmount ?? 0,
      } as LibraryLoan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{loan ? `Edit loan — ${loan.id}` : "Create library loan"}</DialogTitle>
          <DialogDescription>Circulation issue and return (M16.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Member ID</Label>
            <Input placeholder="e.g. lm-2" value={form.memberId ?? ""} onChange={(e) => set({ memberId: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Holding ID</Label>
            <Input placeholder="e.g. lh-2" value={form.holdingId ?? ""} onChange={(e) => set({ holdingId: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Resource Title (optional)</Label>
            <Input placeholder="Title for display" value={form.resourceTitle ?? ""} onChange={(e) => set({ resourceTitle: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Issued On</Label>
            <Input type="date" value={form.issuedOn ? form.issuedOn.slice(0, 10) : ""} onChange={(e) => set({ issuedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Due On</Label>
            <Input type="date" value={form.dueOn ? form.dueOn.slice(0, 10) : ""} onChange={(e) => set({ dueOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Returned On (optional)</Label>
            <Input type="date" value={form.returnedOn ? form.returnedOn.slice(0, 10) : ""} onChange={(e) => set({ returnedOn: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as LoanStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Fine Amount (NPR)</Label>
            <Input type="number" placeholder="0" value={form.fineAmount ?? 0} onChange={(e) => set({ fineAmount: Number(e.target.value) || 0 })} />
          </div>
          <div className="space-y-1.5">
            <Label>Member Name (optional)</Label>
            <Input placeholder="Member display name" value={form.memberName ?? ""} onChange={(e) => set({ memberName: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.memberId || !form.holdingId || !form.issuedOn || !form.dueOn || !form.status}>
            <Plus className="h-4 w-4" /> {loan ? "Save changes" : "Create loan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
