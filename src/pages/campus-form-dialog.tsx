import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCampus } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Campus, CampusStatus } from "@/lib/types";

const PROVINCES = ["Bagmati", "Koshi", "Madhesh", "Gandaki", "Lumbini", "Karnali", "Sudurpashchim"];
const STATUSES: CampusStatus[] = ["open", "closing", "closed", "archived"];
const COLORS = ["#4f46e5", "#0d9488", "#f59e0b", "#dc2626", "#0284c7", "#7c3aed", "#16a34a"];

export function CampusFormDialog({ open, onOpenChange, campus }: { open: boolean; onOpenChange: (o: boolean) => void; campus?: Campus }) {
  const save = useSaveCampus();
  const [form, setForm] = useState<Partial<Campus>>({});

  useEffect(() => {
    if (open) {
      setForm(
        campus ?? {
          name: "", code: `CAMP-${Math.floor(100 + Math.random() * 900)}`, status: "open", type: "branch",
          province: "Bagmati", district: "", localLevel: "", ward: 1, phone: "", email: "",
          head: "", gradeFrom: "ECED", gradeTo: "10", brandingColor: COLORS[3], studentCount: 0, address: "",
        }
      );
    }
  }, [open, campus]);

  const set = (patch: Partial<Campus>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.name) return;
    save.mutate({ ...(campus ?? { id: uid() }), ...form } as Campus, { onSuccess: () => onOpenChange(false) });
  };

  const field = (label: string, key: keyof Campus, opts?: { type?: string; className?: string; placeholder?: string }) => (
    <div className={opts?.className ?? "space-y-1.5"}>
      <Label>{label}</Label>
      <Input
        type={opts?.type ?? "text"}
        placeholder={opts?.placeholder}
        value={(form[key] as string | number) ?? ""}
        onChange={(e) => set({ [key]: opts?.type === "number" ? +e.target.value : e.target.value } as Partial<Campus>)}
      />
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{campus ? `Edit campus — ${campus.name}` : "Open a new campus"}</DialogTitle>
          <DialogDescription>
            A campus belongs to exactly one institution and legal entity at a time; structural changes preserve history (M01.02).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {field("Campus name", "name", { placeholder: "e.g. Bhaktapur Branch" })}
          {field("Campus code", "code", { placeholder: "CAMP-BKT" })}
          {field("Nepali name", "nameNe", { placeholder: "शाखाको नाम", className: "space-y-1.5 font-nepali" })}
          <div className="space-y-1.5">
            <Label>Lifecycle status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CampusStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {field("Campus head", "head", { placeholder: "Principal / coordinator" })}
          {field("Contact phone", "phone", { placeholder: "+977-…" })}
          {field("Province", "province")}
          {field("District", "district")}
          {field("Local level", "localLevel", { placeholder: "Municipality / rural municipality" })}
          {field("Ward no.", "ward", { type: "number" })}
          {field("Grades from", "gradeFrom", { placeholder: "ECED / 1" })}
          {field("Grades to", "gradeTo", { placeholder: "10 / 12" })}
          {field("Student count", "studentCount", { type: "number", className: "space-y-1.5" })}
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Input value={form.address ?? ""} onChange={(e) => set({ address: e.target.value })} placeholder="Street / area" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Branding colour</Label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set({ brandingColor: c })}
                  className={`h-8 w-8 rounded-full transition-transform ${form.brandingColor === c ? "ring-2 ring-offset-2 ring-foreground scale-110" : "hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> {campus ? "Save campus" : "Open campus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
