import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCurriculumMap, useCurriculumOfferings } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { CurriculumMap, CurriculumMapStatus } from "@/lib/types";

const STATUSES: CurriculumMapStatus[] = ["draft", "submitted", "verified", "approved", "published", "superseded"];

export function CurriculumMapFormDialog({ open, onOpenChange, map }: { open: boolean; onOpenChange: (o: boolean) => void; map?: CurriculumMap }) {
  const save = useSaveCurriculumMap();
  const offerings = useCurriculumOfferings();
  const [form, setForm] = useState<Partial<CurriculumMap>>({});

  useEffect(() => {
    if (open) {
      setForm(map ?? { offeringRef: "", version: 1, status: "draft" });
    }
  }, [open, map]);

  const set = (patch: Partial<CurriculumMap>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.offeringRef) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(map ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        version: form.version ?? 1,
        updatedOn: now,
      } as CurriculumMap,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{map ? `Edit curriculum map — ${map.offeringRef}` : "Create curriculum map"}</DialogTitle>
          <DialogDescription>Map a curriculum offering to a versioned curriculum map (M06.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Offering Ref</Label>
            <Select value={form.offeringRef} onValueChange={(v) => set({ offeringRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select offering" /></SelectTrigger>
              <SelectContent>{(offerings.data ?? []).map((o) => <SelectItem key={o.id} value={o.id}>{o.subjectName} - {o.gradeClassName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input type="number" min={1} value={form.version ?? 1} onChange={(e) => set({ version: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CurriculumMapStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.offeringRef}>
            <Plus className="h-4 w-4" /> {map ? "Save changes" : "Create map"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
