import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveStore } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { Store, StoreKind } from "@/lib/types";

const TYPES: StoreKind[] = ["main", "department", "laboratory", "library", "maintenance"];
const STATUSES = ["active", "inactive"] as const;

export function StoreFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing?: Store }) {
  const save = useSaveStore();
  const [form, setForm] = useState<Partial<Store>>({});

  useEffect(() => {
    if (open) {
      setForm(editing ?? { code: "", name: "", location: "", type: "main", capacity: 0, manager: "", status: "active", createdOn: todayISO() });
    }
  }, [open, editing]);

  const set = (patch: Partial<Store>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.code || !form.name) return;
    save.mutate({ ...(editing ?? { id: uid() }), ...form } as Store, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit store — ${editing.name}` : "Create store"}</DialogTitle>
          <DialogDescription>Define a store or storage location (M15.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. STR-001" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Store name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="Building / floor / room" value={form.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => set({ type: v as StoreKind })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Capacity</Label>
            <Input type="number" placeholder="0" value={form.capacity ?? ""} onChange={(e) => set({ capacity: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Manager</Label>
            <Input placeholder="Manager name" value={form.manager ?? ""} onChange={(e) => set({ manager: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as Store["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.code || !form.name}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Create store"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
