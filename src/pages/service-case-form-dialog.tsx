import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveServiceCase } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ServiceCase } from "@/lib/types";

const CATEGORIES = ["it", "transport", "finance", "academic", "general"] as const;
const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
const STATUSES = ["open", "in_progress", "resolved", "closed"] as const;

export function ServiceCaseFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: ServiceCase }) {
  const save = useSaveServiceCase();
  const [form, setForm] = useState<Partial<ServiceCase>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          name: "", category: "general", requesterRef: "",
          priority: "medium", status: "open",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<ServiceCase>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.category || !form.status) return;
    save.mutate(
      {
        id: editing?.id ?? uid(),
        tenantId: editing?.tenantId ?? "",
        schoolId: editing?.schoolId ?? "",
        name: form.name!,
        category: form.category!,
        requesterRef: form.requesterRef || "",
        priority: form.priority || "medium",
        status: form.status!,
      } as ServiceCase,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Service Case" : "Create Service Case"}</DialogTitle>
          <DialogDescription>Open or edit a service case (M23.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="Case name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set({ category: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Priority</Label>
            <Select value={form.priority} onValueChange={(v) => set({ priority: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as any })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Requester Reference</Label>
            <Input placeholder="Requester ID" value={form.requesterRef ?? ""} onChange={(e) => set({ requesterRef: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.category || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create Case"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
