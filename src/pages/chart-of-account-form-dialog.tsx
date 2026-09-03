import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveChartOfAccount, useChartOfAccounts } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ChartOfAccount, AccountType } from "@/lib/types";

const TYPES: AccountType[] = ["asset", "liability", "income", "expense", "equity"];

export function ChartOfAccountFormDialog({ open, onOpenChange, account }: { open: boolean; onOpenChange: (o: boolean) => void; account?: ChartOfAccount }) {
  const save = useSaveChartOfAccount();
  const accounts = useChartOfAccounts();
  const [form, setForm] = useState<Partial<ChartOfAccount>>({});

  useEffect(() => {
    if (open) {
      setForm(
        account ?? {
          code: "",
          name: "",
          type: "asset",
          parentId: "",
          parentName: "",
          isActive: true,
        }
      );
    }
  }, [open, account]);

  const set = (patch: Partial<ChartOfAccount>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name || !form.type) return;
    const now = new Date().toISOString();
    const parentName = form.parentId ? accounts.data?.find((a) => a.id === form.parentId)?.name : undefined;
    save.mutate(
      {
        id: account?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: account?.createdOn ?? now,
        updatedOn: now,
        code: form.code!,
        name: form.name!,
        type: form.type!,
        parentId: form.parentId || undefined,
        parentName: parentName || form.parentName || undefined,
        isActive: form.isActive ?? true,
      } as ChartOfAccount,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{account ? `Edit account — ${account.name}` : "Create chart of account"}</DialogTitle>
          <DialogDescription>Define ledger account with type and hierarchy (M12.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. 1001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as AccountType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Cash in Hand" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Parent Account (optional)</Label>
            <Select value={form.parentId ?? "none"} onValueChange={(v) => set({ parentId: v === "none" ? "" : v })}>
              <SelectTrigger><SelectValue placeholder="No parent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent</SelectItem>
                {(accounts.data ?? []).filter((a) => a.id !== account?.id).map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.code} — {a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch checked={!!form.isActive} onCheckedChange={(v) => set({ isActive: v })} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name || !form.type}>
            <Plus className="h-4 w-4" /> {account ? "Save changes" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
