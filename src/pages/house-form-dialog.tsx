import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveHouse } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { House } from "@/lib/types";

export function HouseFormDialog({ open, onOpenChange, house }: { open: boolean; onOpenChange: (o: boolean) => void; house?: House }) {
  const save = useSaveHouse();
  const [form, setForm] = useState<Partial<House>>({});
  useEffect(() => {
    if (open) setForm(house ?? { name: "", code: "", color: "#3B82F6", description: "", memberCount: 0 });
  }, [open, house]);
  const set = (patch: Partial<House>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.name || !form.code) return;
    save.mutate({ ...(house ?? { id: uid(), tenantId: "tenant-default" }), ...form } as House, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{house ? `Edit house — ${house.name}` : "Create house"}</DialogTitle>
          <DialogDescription>House with color and member count (M03.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Name</Label><Input placeholder="e.g. Sagarmatha" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Code</Label><Input placeholder="e.g. SAG" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Color</Label><Input type="color" value={form.color ?? "#3B82F6"} onChange={(e) => set({ color: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Member Count</Label><Input type="number" value={form.memberCount ?? 0} onChange={(e) => set({ memberCount: +e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Description</Label><Input placeholder="Description" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code}><Plus className="h-4 w-4" /> {house ? "Save changes" : "Create house"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
