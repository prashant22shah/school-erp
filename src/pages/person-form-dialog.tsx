import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavePerson } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Person, Gender } from "@/lib/types";

const GENDERS: Gender[] = ["male", "female", "other"];

export function PersonFormDialog({ open, onOpenChange, person }: { open: boolean; onOpenChange: (o: boolean) => void; person?: Person }) {
  const save = useSavePerson();
  const [form, setForm] = useState<Partial<Person>>({});

  useEffect(() => {
    if (open) {
      setForm(person ?? { legalName: "", officialName: "", officialNameNe: "", preferredName: "", dateOfBirth: "", dateOfBirthBs: "", gender: "male", nationality: "Nepal", createdOn: todayISO() });
    }
  }, [open, person]);

  const set = (patch: Partial<Person>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.legalName || !form.officialName || !form.dateOfBirth || !form.gender) return;
    save.mutate(
      { ...(person ?? { id: uid() }), ...form, tenantId: "tenant-default" } as Person,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{person ? `Edit person — ${person.legalName}` : "Create person"}</DialogTitle>
          <DialogDescription>Define person demographics and identity (M05.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Legal name</Label>
            <Input placeholder="Legal name" value={form.legalName ?? ""} onChange={(e) => set({ legalName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Official name</Label>
            <Input placeholder="Official name" value={form.officialName ?? ""} onChange={(e) => set({ officialName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Official name (Nepali)</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.officialNameNe ?? ""} onChange={(e) => set({ officialNameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Preferred name</Label>
            <Input placeholder="Preferred name" value={form.preferredName ?? ""} onChange={(e) => set({ preferredName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Date of birth</Label>
            <Input type="date" value={form.dateOfBirth ?? ""} onChange={(e) => set({ dateOfBirth: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Date of birth (BS)</Label>
            <Input placeholder="e.g. 2081-01-15" value={form.dateOfBirthBs ?? ""} onChange={(e) => set({ dateOfBirthBs: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={(v) => set({ gender: v as Gender })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{GENDERS.map((g) => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Nationality</Label>
            <Input placeholder="Nationality" value={form.nationality ?? ""} onChange={(e) => set({ nationality: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.legalName || !form.officialName || !form.dateOfBirth || !form.gender}>
            <Plus className="h-4 w-4" /> {person ? "Save changes" : "Create person"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
