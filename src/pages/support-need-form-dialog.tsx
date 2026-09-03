import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveSupportNeed, useSaveAccommodationPlan } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { SupportNeed, AccommodationPlan } from "@/lib/types";

const CATEGORIES = ["learning", "physical", "sensory", "behavioral", "medical"] as const;
const NEED_STATUSES = ["identified", "active", "resolved"] as const;
const PLAN_STATUSES = ["draft", "approved", "active", "expired"] as const;

export function SupportNeedFormDialog({ open, onOpenChange, supportNeed, accommodationPlan }: { open: boolean; onOpenChange: (o: boolean) => void; supportNeed?: SupportNeed; accommodationPlan?: AccommodationPlan }) {
  const saveNeed = useSaveSupportNeed();
  const savePlan = useSaveAccommodationPlan();
  const isPlan = !!accommodationPlan;
  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (open) {
      if (accommodationPlan) {
        setForm(accommodationPlan);
      } else if (supportNeed) {
        setForm(supportNeed);
      } else {
        setForm({
          studentName: "", studentRef: "", category: "learning",
          description: "", identifiedDate: new Date().toISOString().slice(0, 10),
          status: "identified",
        });
      }
    }
  }, [open, supportNeed, accommodationPlan]);

  const set = (patch: Record<string, any>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.studentName) return;
    const now = new Date().toISOString();
    if (isPlan) {
      savePlan.mutate(
        {
          id: accommodationPlan?.id ?? uid(),
          createdOn: accommodationPlan?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          validFrom: (form as any).validFrom || now.slice(0, 10),
          validTo: (form as any).validTo || "",
          adjustments: (form as any).adjustments || "",
          approvedBy: (form as any).approvedBy || "",
          status: (form as any).status || "draft",
        } as AccommodationPlan,
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      saveNeed.mutate(
        {
          id: supportNeed?.id ?? uid(),
          createdOn: supportNeed?.createdOn ?? now,
          studentName: form.studentName!,
          studentRef: form.studentRef || "",
          category: form.category || "learning",
          description: form.description || "",
          identifiedDate: form.identifiedDate || now.slice(0, 10),
          status: form.status || "identified",
        } as SupportNeed,
        { onSuccess: () => onOpenChange(false) }
      );
    }
  };

  const savePending = isPlan ? savePlan.isPending : saveNeed.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isPlan ? (accommodationPlan ? `Edit accommodation plan — ${accommodationPlan.studentName}` : "Create accommodation plan") : (supportNeed ? `Edit support need — ${supportNeed.studentName}` : "Create support need")}</DialogTitle>
          <DialogDescription>{isPlan ? "Define accommodation adjustments for a student (M19.04)." : "Identify a student support need (M19.04)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Student Name</Label>
            <Input placeholder="Full name" value={form.studentName ?? ""} onChange={(e) => set({ studentName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Student Ref</Label>
            <Input placeholder="e.g. STU-001" value={form.studentRef ?? ""} onChange={(e) => set({ studentRef: e.target.value })} />
          </div>
          {isPlan ? (
            <>
              <div className="space-y-1.5">
                <Label>Valid From</Label>
                <Input type="date" value={(form as any).validFrom ?? ""} onChange={(e) => set({ validFrom: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Valid To</Label>
                <Input type="date" value={(form as any).validTo ?? ""} onChange={(e) => set({ validTo: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Adjustments</Label>
                <Textarea placeholder="Describe accommodation adjustments…" value={(form as any).adjustments ?? ""} onChange={(e) => set({ adjustments: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Approved By</Label>
                <Input placeholder="Approver name" value={(form as any).approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value } as any)} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={(form as any).status} onValueChange={(v) => set({ status: v } as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{PLAN_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => set({ category: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{NEED_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Identified Date</Label>
                <Input type="date" value={form.identifiedDate ?? ""} onChange={(e) => set({ identifiedDate: e.target.value })} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe the support need…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={savePending || !form.studentName}>
            <Plus className="h-4 w-4" /> {isPlan ? (accommodationPlan ? "Save changes" : "Create plan") : (supportNeed ? "Save changes" : "Create need")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
