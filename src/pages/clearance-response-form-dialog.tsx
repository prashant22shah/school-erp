import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveClearanceResponse, useClearanceCases } from "@/hooks/use-erp";
import { uid, todayISO } from "@/lib/utils";
import type { ClearanceResponse } from "@/lib/types";

export function ClearanceResponseFormDialog({ open, onOpenChange, response }: { open: boolean; onOpenChange: (o: boolean) => void; response?: ClearanceResponse }) {
  const save = useSaveClearanceResponse();
  const cases = useClearanceCases();
  const [form, setForm] = useState<Partial<ClearanceResponse>>({});
  useEffect(() => {
    if (open) setForm(response ?? { clearanceId: "", moduleCode: "", moduleName: "", decision: "cleared", respondedBy: "", respondedOn: todayISO() });
  }, [open, response]);
  const set = (patch: Partial<ClearanceResponse>) => setForm((f) => ({ ...f, ...patch }));
  const submit = () => {
    if (!form.clearanceId || !form.moduleCode || !form.decision) return;
    save.mutate({ ...(response ?? { id: uid(), tenantId: "tenant-default" }), ...form } as ClearanceResponse, { onSuccess: () => onOpenChange(false) });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{response ? `Edit response — ${response.moduleName}` : "Create clearance response"}</DialogTitle>
          <DialogDescription>Module clearance decision (M05.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Clearance Case</Label><Select value={form.clearanceId} onValueChange={(v) => set({ clearanceId: v })}><SelectTrigger><SelectValue placeholder="Select case" /></SelectTrigger><SelectContent>{(cases.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.studentName} — {c.purpose}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Module Code</Label><Input placeholder="e.g. M12" value={form.moduleCode ?? ""} onChange={(e) => set({ moduleCode: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Module Name</Label><Input placeholder="e.g. Fees & Finance" value={form.moduleName ?? ""} onChange={(e) => set({ moduleName: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Decision</Label><Select value={form.decision} onValueChange={(v) => set({ decision: v as ClearanceResponse["decision"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cleared">cleared</SelectItem><SelectItem value="not_cleared">not_cleared</SelectItem><SelectItem value="not_applicable">not_applicable</SelectItem></SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Responded By</Label><Input placeholder="Responder" value={form.respondedBy ?? ""} onChange={(e) => set({ respondedBy: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Remarks</Label><Input placeholder="Remarks" value={form.remarks ?? ""} onChange={(e) => set({ remarks: e.target.value })} /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.clearanceId || !form.moduleCode || !form.decision}><Plus className="h-4 w-4" /> {response ? "Save changes" : "Create response"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
