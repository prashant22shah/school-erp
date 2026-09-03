import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveGrievance } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Grievance } from "@/lib/types";

const COMPLAINANT_TYPES = ["student", "parent", "staff", "other"] as const;
const CATEGORIES = ["academic", "behavioral", "safety", "discrimination", "facilities", "other"] as const;
const STATUSES = ["filed", "acknowledged", "investigating", "resolved", "appealed", "closed"] as const;

export function GrievanceFormDialog({ open, onOpenChange, grievance }: { open: boolean; onOpenChange: (o: boolean) => void; grievance?: Grievance }) {
  const save = useSaveGrievance();
  const [form, setForm] = useState<Partial<Grievance>>({});

  useEffect(() => {
    if (open) {
      setForm(
        grievance ?? {
          complainantName: "", complainantType: "student",
          category: "academic", description: "",
          receivedDate: new Date().toISOString().slice(0, 10),
          assignedTo: "", status: "filed",
        }
      );
    }
  }, [open, grievance]);

  const set = (patch: Partial<Grievance>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.complainantName || !form.complainantType || !form.category || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: grievance?.id ?? uid(),
        createdOn: grievance?.createdOn ?? now,
        complainantName: form.complainantName!,
        complainantType: form.complainantType!,
        category: form.category!,
        description: form.description || "",
        receivedDate: form.receivedDate || now.slice(0, 10),
        assignedTo: form.assignedTo || "",
        status: form.status!,
      } as Grievance,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{grievance ? `Edit grievance — ${grievance.complainantName}` : "Create grievance"}</DialogTitle>
          <DialogDescription>File a student or parent grievance (M19.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Complainant Name</Label>
            <Input placeholder="Full name" value={form.complainantName ?? ""} onChange={(e) => set({ complainantName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Complainant Type</Label>
            <Select value={form.complainantType} onValueChange={(v) => set({ complainantType: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{COMPLAINANT_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Received Date</Label>
            <Input type="date" value={form.receivedDate ?? ""} onChange={(e) => set({ receivedDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned To</Label>
            <Input placeholder="Investigator / Staff name" value={form.assignedTo ?? ""} onChange={(e) => set({ assignedTo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the grievance…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.complainantName || !form.complainantType || !form.category || !form.status}>
            <Plus className="h-4 w-4" /> {grievance ? "Save changes" : "Create grievance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
