import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveContinuityPlan } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ContinuityPlan } from "@/lib/types";

const STATUSES = ["draft", "active", "under_review", "archived"] as const;

export function ContinuityPlanFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: ContinuityPlan }) {
  const save = useSaveContinuityPlan();
  const [form, setForm] = useState<Partial<ContinuityPlan>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          title: "", description: "",
          planType: "emergency", scope: "", objectives: "",
          contactList: "", procedures: "",
          lastTestedDate: "", nextTestDate: "",
          version: 1, status: "draft",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<ContinuityPlan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.planType || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        title: form.title!,
        description: form.description || "",
        planType: form.planType!,
        scope: form.scope || "",
        objectives: form.objectives || "",
        contactList: form.contactList || "",
        procedures: form.procedures || "",
        lastTestedDate: form.lastTestedDate || "",
        nextTestDate: form.nextTestDate || "",
        version: form.version || 1,
        status: form.status!,
      } as ContinuityPlan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Continuity Plan" : "Create Continuity Plan"}</DialogTitle>
          <DialogDescription>Define a business continuity or disaster recovery plan (M22.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Plan name" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Scenario</Label>
            <Input placeholder="e.g. Earthquake, Flood" value={form.planType ?? ""} onChange={(e) => set({ planType: e.target.value as any })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version ?? 1} onChange={(e) => set({ version: parseInt(e.target.value) || 1 })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.planType || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
