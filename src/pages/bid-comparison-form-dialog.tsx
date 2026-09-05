import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveBidComparison, useRfqs } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { BidComparison } from "@/lib/types";

const STATUSES: BidComparison["status"][] = ["submitted", "evaluated", "selected", "rejected"];

export function BidComparisonFormDialog({ open, onOpenChange, bid }: { open: boolean; onOpenChange: (o: boolean) => void; bid?: BidComparison }) {
  const save = useSaveBidComparison();
  const rfqs = useRfqs();
  const [form, setForm] = useState<Partial<BidComparison>>({});

  useEffect(() => {
    if (open) {
      setForm(bid ?? { rfqRef: "", vendorRef: "", vendorName: "", quotedAmount: 0, deliveryTerms: "", paymentTerms: "", technicalScore: 0, commercialScore: 0, totalScore: 0, rank: 0, status: "submitted" as const });
    }
  }, [open, bid]);

  const set = (patch: Partial<BidComparison>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.rfqRef || !form.vendorName || !form.status) return;
    const total = (form.technicalScore ?? 0) + (form.commercialScore ?? 0);
    save.mutate(
      { ...(bid ?? { id: uid(), createdOn: todayISO() }), ...form, totalScore: total } as BidComparison,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{bid ? `Edit bid — ${bid.vendorName}` : "Add bid comparison"}</DialogTitle>
          <DialogDescription>Vendor bid comparison entry (M14.03).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>RFQ</Label>
            <Select value={form.rfqRef} onValueChange={(v) => set({ rfqRef: v })}>
              <SelectTrigger><SelectValue placeholder="Select RFQ" /></SelectTrigger>
              <SelectContent>{rfqs.data?.map((r) => <SelectItem key={r.id} value={r.id}>{r.rfqNo}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Vendor Name</Label>
            <Input placeholder="Vendor name" value={form.vendorName ?? ""} onChange={(e) => set({ vendorName: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Quoted Amount (Rs)</Label>
            <Input type="number" min={0} value={form.quotedAmount ?? 0} onChange={(e) => set({ quotedAmount: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Rank</Label>
            <Input type="number" min={1} value={form.rank ?? 0} onChange={(e) => set({ rank: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Technical Score</Label>
            <Input type="number" min={0} max={100} value={form.technicalScore ?? 0} onChange={(e) => set({ technicalScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Commercial Score</Label>
            <Input type="number" min={0} max={100} value={form.commercialScore ?? 0} onChange={(e) => set({ commercialScore: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as BidComparison["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Delivery Terms</Label>
            <Input placeholder="Delivery terms" value={form.deliveryTerms ?? ""} onChange={(e) => set({ deliveryTerms: e.target.value })} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label>Payment Terms</Label>
            <Textarea placeholder="Payment terms" value={form.paymentTerms ?? ""} onChange={(e) => set({ paymentTerms: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.rfqRef || !form.vendorName || !form.status}>
            <Plus className="h-4 w-4" /> {bid ? "Save changes" : "Add bid"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
