import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSaveAcademicYear } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { AcademicYear, AcademicYearStatus } from "@/lib/types";

const STATUSES: AcademicYearStatus[] = ["planning", "active", "closed"];

export function AcademicYearFormDialog({ open, onOpenChange, year }: { open: boolean; onOpenChange: (o: boolean) => void; year?: AcademicYear }) {
  const save = useSaveAcademicYear();
  const [form, setForm] = useState<Partial<AcademicYear>>({});

  useEffect(() => {
    if (open) {
      setForm(year ?? { name: "", nameNe: "", startDate: "", endDate: "", bsYear: "", status: "planning", isCurrent: false, createdOn: todayISO() });
    }
  }, [open, year]);

  const set = (patch: Partial<AcademicYear>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.startDate || !form.endDate) return;
    save.mutate(
      { ...(year ?? { id: uid() }), ...form, tenantId: "tenant-default" } as AcademicYear,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{year ? `Edit academic year — ${year.name}` : "Create academic year"}</DialogTitle>
          <DialogDescription>Define academic year boundaries and status (M03.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="e.g. 2081/82" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Start date</Label>
            <Input type="date" value={form.startDate ?? ""} onChange={(e) => set({ startDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>End date</Label>
            <Input type="date" value={form.endDate ?? ""} onChange={(e) => set({ endDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>BS Year</Label>
            <Input placeholder="e.g. 2081" value={form.bsYear ?? ""} onChange={(e) => set({ bsYear: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as AcademicYearStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 pt-6">
            <Switch checked={form.isCurrent ?? false} onCheckedChange={(v) => set({ isCurrent: v })} />
            <Label>Current academic year</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.startDate || !form.endDate}>
            <Plus className="h-4 w-4" /> {year ? "Save changes" : "Create year"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
