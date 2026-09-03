import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveOffer, useApplications, useGradeClasses, useStreams } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Offer, OfferStatus } from "@/lib/types";

const OFFER_TYPES = ["unconditional", "conditional", "waitlist"] as const;
const STATUSES: OfferStatus[] = ["pending", "offered", "accepted", "declined", "waitlisted", "expired", "withdrawn"];

export function OfferFormDialog({ open, onOpenChange, offer }: { open: boolean; onOpenChange: (o: boolean) => void; offer?: Offer }) {
  const save = useSaveOffer();
  const applications = useApplications();
  const grades = useGradeClasses();
  const streams = useStreams();
  const [form, setForm] = useState<Partial<Offer>>({});

  useEffect(() => {
    if (open) {
      setForm(offer ?? {
        applicationId: "", applicationName: "", offerType: "unconditional",
        offeredGradeId: "", offeredGradeName: "", offeredStreamId: "", offeredStreamName: "",
        conditions: "", validUntil: "", status: "pending", issuedOn: todayISO(), issuedBy: "",
      });
    }
  }, [open, offer]);

  const set = (patch: Partial<Offer>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.applicationId || !form.offeredGradeId || !form.validUntil) return;
    const appName = (applications.data ?? []).find((a) => a.id === form.applicationId)?.studentName ?? form.applicationName ?? "";
    const gradeName = (grades.data ?? []).find((g) => g.id === form.offeredGradeId)?.name ?? form.offeredGradeName ?? "";
    const streamName = form.offeredStreamId ? (streams.data ?? []).find((s) => s.id === form.offeredStreamId)?.name ?? "" : "";
    save.mutate(
      { ...(offer ?? { id: uid() }), ...form, applicationName: appName, offeredGradeName: gradeName, offeredStreamName: streamName, tenantId: "tenant-default" } as Offer,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{offer ? `Edit offer` : "Create offer"}</DialogTitle>
          <DialogDescription>Issue an admission offer to an applicant (M04.06).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Application</Label>
            <Select value={form.applicationId} onValueChange={(v) => set({ applicationId: v })}>
              <SelectTrigger><SelectValue placeholder="Select application" /></SelectTrigger>
              <SelectContent>{(applications.data ?? []).map((a) => <SelectItem key={a.id} value={a.id}>{a.applicationNo} — {a.studentName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Offer type</Label>
            <Select value={form.offerType} onValueChange={(v) => set({ offerType: v as Offer["offerType"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{OFFER_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Offered grade</Label>
            <Select value={form.offeredGradeId} onValueChange={(v) => set({ offeredGradeId: v })}>
              <SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger>
              <SelectContent>{(grades.data ?? []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Stream (optional)</Label>
            <Select value={form.offeredStreamId ?? ""} onValueChange={(v) => set({ offeredStreamId: v || undefined })}>
              <SelectTrigger><SelectValue placeholder="Select stream" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {(streams.data ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Valid until</Label>
            <Input type="date" value={form.validUntil ?? ""} onChange={(e) => set({ validUntil: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as OfferStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Issued by</Label>
            <Input placeholder="Staff name" value={form.issuedBy ?? ""} onChange={(e) => set({ issuedBy: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Conditions</Label>
            <Textarea placeholder="Any conditions for the offer…" value={form.conditions ?? ""} onChange={(e) => set({ conditions: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.applicationId || !form.offeredGradeId || !form.validUntil}>
            <Plus className="h-4 w-4" /> {offer ? "Save changes" : "Create offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
