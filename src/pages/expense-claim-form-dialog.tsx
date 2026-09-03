import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveExpenseClaim, useStaffProfiles } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ExpenseClaim, ExpenseClaimStatus } from "@/lib/types";

const STATUSES: ExpenseClaimStatus[] = ["draft", "submitted", "approved", "rejected", "paid"];
const CATEGORIES = ["travel", "food", "stationery", "communication", "medical", "training", "other"];

export function ExpenseClaimFormDialog({ open, onOpenChange, claim }: { open: boolean; onOpenChange: (o: boolean) => void; claim?: ExpenseClaim }) {
  const save = useSaveExpenseClaim();
  const staff = useStaffProfiles();
  const [form, setForm] = useState<Partial<ExpenseClaim>>({});

  useEffect(() => {
    if (open) {
      setForm(
        claim ?? {
          staffRef: "",
          staffName: "",
          category: "travel",
          amount: 0,
          claimDate: new Date().toISOString().slice(0, 10),
          status: "draft",
          description: "",
        }
      );
    }
  }, [open, claim]);

  const set = (patch: Partial<ExpenseClaim>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.staffRef || !form.category || form.amount == null || !form.claimDate || !form.status) return;
    const now = new Date().toISOString();
    const staffName = staff.data?.find((s) => s.id === form.staffRef)?.name ?? form.staffName ?? form.staffRef!;
    save.mutate(
      {
        id: claim?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: claim?.createdOn ?? now,
        updatedOn: now,
        staffRef: form.staffRef!,
        staffName,
        category: form.category!,
        amount: Number(form.amount),
        claimDate: form.claimDate!,
        status: form.status!,
        description: form.description || undefined,
      } as ExpenseClaim,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{claim ? `Edit expense claim — ${claim.staffName}` : "Create expense claim"}</DialogTitle>
          <DialogDescription>Submit staff reimbursement claim (M12.16).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Staff</Label>
            <Select value={form.staffRef} onValueChange={(v) => set({ staffRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>{(staff.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name} ({s.staffCode})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {(staff.data ?? []).length === 0 && (
            <div className="space-y-1.5">
              <Label>Staff Name (manual)</Label>
              <Input placeholder="Staff name" value={form.staffName ?? ""} onChange={(e) => set({ staffName: e.target.value, staffRef: e.target.value || form.staffRef })} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Amount</Label>
            <Input type="number" min={0} value={form.amount ?? 0} onChange={(e) => set({ amount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Claim Date</Label>
            <Input type="date" value={form.claimDate ? form.claimDate.slice(0, 10) : ""} onChange={(e) => set({ claimDate: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as ExpenseClaimStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description (optional)</Label>
            <Textarea placeholder="Claim details…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.staffRef || !form.category || !form.claimDate || !form.status}>
            <Plus className="h-4 w-4" /> {claim ? "Save changes" : "Create claim"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
