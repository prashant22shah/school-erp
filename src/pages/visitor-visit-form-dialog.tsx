import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveVisitorVisit } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { VisitorVisit } from "@/lib/types";

export function VisitorVisitFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: VisitorVisit }) {
  const save = useSaveVisitorVisit();
  const [form, setForm] = useState<Partial<VisitorVisit>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          visitorName: "", visitorPhone: "", visitorIdType: "citizenship",
          visitorIdNo: "", purpose: "",
          hostName: "", hostRef: "",
          vehicleNo: "", checkInTime: "", checkOutTime: "",
          status: "checked_in",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<VisitorVisit>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.visitorName || !form.hostName || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: editing?.id ?? uid(),
        createdOn: editing?.createdOn ?? now,
        visitorName: form.visitorName!,
        visitorPhone: form.visitorPhone || "",
        visitorIdType: form.visitorIdType || "citizenship",
        visitorIdNo: form.visitorIdNo || "",
        purpose: form.purpose || "",
        hostName: form.hostName!,
        hostRef: form.hostRef || "",
        vehicleNo: form.vehicleNo || "",
        checkInTime: form.checkInTime || now,
        checkOutTime: form.checkOutTime || "",
        status: form.status!,
      } as VisitorVisit,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Visitor Visit" : "Register Visitor"}</DialogTitle>
          <DialogDescription>Log a campus visitor entry (M22.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Visitor</Label>
            <Input placeholder="Visitor name" value={form.visitorName ?? ""} onChange={(e) => set({ visitorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Host</Label>
            <Input placeholder="Host name" value={form.hostName ?? ""} onChange={(e) => set({ hostName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Purpose</Label>
            <Input placeholder="Purpose of visit" value={form.purpose ?? ""} onChange={(e) => set({ purpose: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Check In</Label>
            <Input type="datetime-local" value={form.checkInTime ?? ""} onChange={(e) => set({ checkInTime: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Check Out (optional)</Label>
            <Input type="datetime-local" value={form.checkOutTime ?? ""} onChange={(e) => set({ checkOutTime: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.visitorName || !form.hostName || !form.status}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Register Visitor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
