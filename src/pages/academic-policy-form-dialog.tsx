import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveAcademicPolicy } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { AcademicPolicy, PolicyCategory, PolicyStatus } from "@/lib/types";

const CATEGORIES: PolicyCategory[] = ["attendance", "assessment", "promotion", "discipline", "examination", "general"];
const STATUSES: PolicyStatus[] = ["draft", "approved", "published", "archived"];

export function AcademicPolicyFormDialog({ open, onOpenChange, policy }: { open: boolean; onOpenChange: (o: boolean) => void; policy?: AcademicPolicy }) {
  const save = useSaveAcademicPolicy();
  const [form, setForm] = useState<Partial<AcademicPolicy>>({});

  useEffect(() => {
    if (open) {
      setForm(policy ?? { name: "", nameNe: "", category: "general", description: "", effectiveFrom: todayISO(), effectiveTo: "", status: "draft", approvedBy: "", createdOn: todayISO() });
    }
  }, [open, policy]);

  const set = (patch: Partial<AcademicPolicy>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.category || !form.effectiveFrom) return;
    save.mutate(
      { ...(policy ?? { id: uid() }), ...form, tenantId: "tenant-default" } as AcademicPolicy,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{policy ? `Edit policy — ${policy.name}` : "Create academic policy"}</DialogTitle>
          <DialogDescription>Define school academic policy with effective dates and approval (M03.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. Attendance Policy 2081" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as PolicyCategory })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PolicyStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Effective from</Label>
            <Input type="date" value={form.effectiveFrom ?? ""} onChange={(e) => set({ effectiveFrom: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Effective to</Label>
            <Input type="date" value={form.effectiveTo ?? ""} onChange={(e) => set({ effectiveTo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Approved by</Label>
            <Input placeholder="Approver name" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Input placeholder="Policy description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.category || !form.effectiveFrom}>
            <Plus className="h-4 w-4" /> {policy ? "Save changes" : "Create policy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
