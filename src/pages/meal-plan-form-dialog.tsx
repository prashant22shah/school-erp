import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveMealPlan } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { MealPlan, MealType } from "@/lib/types";

const MEAL_TYPES: MealType[] = ["vegetarian", "non_vegetarian", "vegan", "special"];
const STATUSES: MealPlan["status"][] = ["active", "inactive"];

export function MealPlanFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: MealPlan }) {
  const save = useSaveMealPlan();
  const [form, setForm] = useState<Partial<MealPlan>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", type: "vegetarian", mealsPerDay: 3, monthlyRate: 0, description: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<MealPlan>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as MealPlan,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit meal plan — ${editing.name}` : "Create meal plan"}</DialogTitle>
          <DialogDescription>Define a meal plan with type, meals per day, and monthly rate (M18.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. VEG-STD" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Meal plan name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as MealType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MEAL_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Meals per day</Label>
            <Input type="number" placeholder="3" value={form.mealsPerDay ?? ""} onChange={(e) => set({ mealsPerDay: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Monthly rate (NPR)</Label>
            <Input type="number" placeholder="0" value={form.monthlyRate ?? ""} onChange={(e) => set({ monthlyRate: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as MealPlan["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Meal plan description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create meal plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
