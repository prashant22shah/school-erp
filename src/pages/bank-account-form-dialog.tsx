import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSaveBankAccount } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { BankAccount } from "@/lib/types";

export function BankAccountFormDialog({ open, onOpenChange, account }: { open: boolean; onOpenChange: (o: boolean) => void; account?: BankAccount }) {
  const save = useSaveBankAccount();
  const [form, setForm] = useState<Partial<BankAccount>>({});

  useEffect(() => {
    if (open) {
      setForm(
        account ?? {
          bankName: "",
          accountNo: "",
          accountName: "",
          balance: 0,
          currency: "NPR",
          isActive: true,
        }
      );
    }
  }, [open, account]);

  const set = (patch: Partial<BankAccount>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.bankName || !form.accountNo || !form.accountName || form.balance == null || !form.currency) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: account?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: account?.createdOn ?? now,
        updatedOn: now,
        bankName: form.bankName!,
        accountNo: form.accountNo!,
        accountName: form.accountName!,
        balance: Number(form.balance),
        currency: form.currency!,
        isActive: form.isActive ?? true,
      } as BankAccount,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{account ? `Edit bank account — ${account.accountName}` : "Create bank account"}</DialogTitle>
          <DialogDescription>Manage school bank accounts and balances (M12.17).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Bank Name</Label>
            <Input placeholder="e.g. Nepal Bank Limited" value={form.bankName ?? ""} onChange={(e) => set({ bankName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Account No</Label>
            <Input placeholder="e.g. 00123456789" value={form.accountNo ?? ""} onChange={(e) => set({ accountNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Input placeholder="e.g. NPR" value={form.currency ?? ""} onChange={(e) => set({ currency: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Account Name</Label>
            <Input placeholder="e.g. School Operating Account" value={form.accountName ?? ""} onChange={(e) => set({ accountName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Balance</Label>
            <Input type="number" value={form.balance ?? 0} onChange={(e) => set({ balance: +e.target.value })} />
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={!!form.isActive} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.bankName || !form.accountNo || !form.accountName || !form.currency}>
            <Plus className="h-4 w-4" /> {account ? "Save changes" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
