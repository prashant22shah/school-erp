import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveRfq, usePurchaseRequisitions } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { RFQ } from "@/lib/types";

const STATUSES: RFQ["status"][] = ["draft", "issued", "closed", "evaluated"];

export function RfqFormDialog({ open, onOpenChange, rfq }: { open: boolean; onOpenChange: (o: boolean) => void; rfq?: RFQ }) {
  const save = useSaveRfq();
  const requisitions = usePurchaseRequisitions();
  const [form, setForm] = useState<Partial<RFQ>>({});

  useEffect(() => {
    if (open) {
      setForm(rfq ?? { rfqNo: "", requisitionRef: "", title: "", issueDate: "", closingDate: "", vendorsInvited: 0, status: "draft" as const });
    }
  }, [open, rfq]);

  const set = (patch: Partial<RFQ>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.rfqNo || !form.title || !form.status) return;
    save.mutate(
      { ...(rfq ?? { id: uid(), createdOn: new Date().toISOString() }), ...form } as RFQ,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{rfq ? `Edit RFQ — ${rfq.rfqNo}` : "Create RFQ"}</DialogTitle>
          <DialogDescription>Request for quotation details (M14.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>RFQ No</Label>
            <Input placeholder="e.g. RFQ-2026-001" value={form.rfqNo ?? ""} onChange={(e) => set({ rfqNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Requisition</Label>
            <Select value={form.requisitionRef} onValueChange={(v) => set({ requisitionRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select requisition" /></SelectTrigger>
              <SelectContent>{requisitions.data?.map((r) => <SelectItem key={r.id} value={r.id}>{r.requisitionNo}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Title</Label>
            <Input placeholder="RFQ title" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Issue Date</Label>
            <Input type="date" value={form.issueDate ? form.issueDate.slice(0, 10) : ""} onChange={(e) => set({ issueDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Closing Date</Label>
            <Input type="date" value={form.closingDate ? form.closingDate.slice(0, 10) : ""} onChange={(e) => set({ closingDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendors Invited</Label>
            <Input type="number" min={0} value={form.vendorsInvited ?? 0} onChange={(e) => set({ vendorsInvited: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as RFQ["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.rfqNo || !form.title || !form.status}>
            <Plus className="h-4 w-4" /> {rfq ? "Save changes" : "Create RFQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
