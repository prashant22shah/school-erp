import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveMessManagement, useMealPlans } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { MessManagement, ServingMeal } from "@/lib/types";

const MEAL_TYPES: ServingMeal[] = ["breakfast", "lunch", "dinner", "snack"];
const STATUSES: MessManagement["status"][] = ["planned", "prepared", "served", "cancelled"];

export function MessManagementFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: MessManagement }) {
  const save = useSaveMessManagement();
  const plans = useMealPlans();
  const [form, setForm] = useState<Partial<MessManagement>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { date: todayISO(), mealType: "breakfast", mealPlanRef: "", preparedFor: 0, servedCount: 0, costPerHead: 0, totalCost: 0, notes: "", status: "planned", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<MessManagement>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.date || !form.mealType || !form.mealPlanRef) return;
    save.mutate(
      { ...(editing ?? { id: uid() }), ...form } as MessManagement,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit mess entry — ${editing.date} ${editing.mealType}` : "Create mess entry"}</DialogTitle>
          <DialogDescription>Record a mess meal serving with cost and count details (M18.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input type="date" value={form.date ?? ""} onChange={(e) => set({ date: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Meal type</Label>
            <Select value={form.mealType} onValueChange={(v) => set({ mealType: v as ServingMeal })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{MEAL_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Meal plan</Label>
            <Select value={form.mealPlanRef} onValueChange={(v) => set({ mealPlanRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select plan" /></SelectTrigger>
              <SelectContent>{(plans.data ?? []).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as MessManagement["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Prepared for</Label>
            <Input type="number" placeholder="0" value={form.preparedFor ?? ""} onChange={(e) => set({ preparedFor: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Served count</Label>
            <Input type="number" placeholder="0" value={form.servedCount ?? ""} onChange={(e) => set({ servedCount: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Cost per head (NPR)</Label>
            <Input type="number" placeholder="0" value={form.costPerHead ?? ""} onChange={(e) => set({ costPerHead: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total cost (NPR)</Label>
            <Input type="number" placeholder="0" value={form.totalCost ?? ""} onChange={(e) => set({ totalCost: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes…" value={form.notes ?? ""} onChange={(e) => set({ notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.date || !form.mealType || !form.mealPlanRef}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
