import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveGuardian, usePersons } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Guardian } from "@/lib/types";

export function GuardianFormDialog({ open, onOpenChange, guardian }: { open: boolean; onOpenChange: (v: boolean) => void; guardian?: Guardian }) {
  const save = useSaveGuardian();
  const persons = usePersons();
  const [form, setForm] = useState<Partial<Guardian>>({});

  useEffect(() => {
    if (open) {
      setForm(guardian ?? { personId: "", personName: "", name: "", phone: "", email: "", occupation: "", relationToStudent: "", createdOn: todayISO() });
    }
  }, [open, guardian]);

  const set = (patch: Partial<Guardian>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.personId || !form.name || !form.phone || !form.relationToStudent) return;
    const personName = persons.data?.find((p) => p.id === form.personId)?.legalName ?? form.personName ?? "";
    save.mutate(
      { ...(guardian ?? { id: uid() }), ...form, personName, tenantId: "tenant-default" } as Guardian,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{guardian ? `Edit guardian — ${guardian.name}` : "Create guardian"}</DialogTitle>
          <DialogDescription>Register guardian contact and relationship details (M05.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Person</Label>
            <Select value={form.personId ?? ""} onValueChange={(v) => set({ personId: v })}>
              <SelectTrigger><SelectValue placeholder="Select person" /></SelectTrigger>
              <SelectContent>{persons.data?.map((p) => <SelectItem key={p.id} value={p.id}>{p.legalName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Guardian name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input placeholder="Phone number" value={form.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" placeholder="Email address" value={form.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Occupation</Label>
            <Input placeholder="Occupation" value={form.occupation ?? ""} onChange={(e) => set({ occupation: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Relation to student</Label>
            <Input placeholder="e.g. Father, Mother, Guardian" value={form.relationToStudent ?? ""} onChange={(e) => set({ relationToStudent: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.personId || !form.name || !form.phone || !form.relationToStudent}>
            <Plus className="h-4 w-4" /> {guardian ? "Save changes" : "Create guardian"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
