import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveSubstitution, useTimetableAssignments } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Substitution, SubstitutionStatus } from "@/lib/types";

const STATUSES: SubstitutionStatus[] = ["pending", "approved", "rejected", "completed"];

export function SubstitutionFormDialog({ open, onOpenChange, substitution }: { open: boolean; onOpenChange: (o: boolean) => void; substitution?: Substitution }) {
  const save = useSaveSubstitution();
  const assignments = useTimetableAssignments();
  const [form, setForm] = useState<Partial<Substitution>>({});

  useEffect(() => {
    if (open) setForm(substitution ?? { assignmentId: "", localDate: "", replacementStaffRef: "", replacementStaffName: "", reason: "", status: "pending" });
  }, [open, substitution]);

  const set = (patch: Partial<Substitution>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.assignmentId || !form.localDate || !form.replacementStaffRef) return;
    const now = new Date().toISOString();
    const assignmentLabel = assignments.data?.find((a) => a.id === form.assignmentId)?.sectionName ?? "";
    save.mutate(
      {
        ...(substitution ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        assignmentLabel,
        updatedOn: now,
      } as Substitution,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{substitution ? `Edit substitution — ${substitution.localDate}` : "Create substitution"}</DialogTitle>
          <DialogDescription>Assign substitute teachers for a scheduled assignment (M07.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Assignment</Label>
            <Select value={form.assignmentId} onValueChange={(v) => set({ assignmentId: v })}>
              <SelectTrigger><SelectValue placeholder="Select assignment" /></SelectTrigger>
              <SelectContent>{(assignments.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.sectionName} — {a.offeringName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Local Date</Label>
            <Input type="date" value={form.localDate ?? ""} onChange={(e) => set({ localDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as SubstitutionStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Replacement Staff Ref</Label>
            <Select value={form.replacementStaffRef} onValueChange={(v) => {
              const names: Record<string,string> = { "uid-5": "Manoj Rai", "uid-2": "Ramesh Shrestha", "uid-3": "Laxmi Poudel" };
              set({ replacementStaffRef: v, replacementStaffName: names[v] ?? v });
            }}>
              <SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="uid-5">Manoj Rai</SelectItem>
                <SelectItem value="uid-2">Ramesh Shrestha</SelectItem>
                <SelectItem value="uid-3">Laxmi Poudel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Replacement Name</Label>
            <Input placeholder="Staff name" value={form.replacementStaffName ?? ""} onChange={(e) => set({ replacementStaffName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Reason</Label>
            <Input placeholder="Reason for substitution" value={form.reason ?? ""} onChange={(e) => set({ reason: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.assignmentId || !form.localDate || !form.replacementStaffRef}>
            <Plus className="h-4 w-4" /> {substitution ? "Save changes" : "Create substitution"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
