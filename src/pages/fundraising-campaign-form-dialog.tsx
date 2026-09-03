import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveFundraisingCampaign, useSaveDonation, useFundraisingCampaigns } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { FundraisingCampaign, Donation } from "@/lib/types";

const CAMPAIGN_STATUSES: FundraisingCampaign["status"][] = ["planned", "active", "completed", "cancelled"];
const DONATION_METHODS: Donation["method"][] = ["cash", "bank_transfer", "online", "cheque", "other"];
const DONATION_STATUSES: Donation["status"][] = ["received", "acknowledged", "receipted"];

export function FundraisingCampaignFormDialog({ open, onOpenChange, campaign, donation }: { open: boolean; onOpenChange: (o: boolean) => void; campaign?: FundraisingCampaign; donation?: Donation }) {
  const saveCampaign = useSaveFundraisingCampaign();
  const saveDonation = useSaveDonation();
  const campaigns = useFundraisingCampaigns();
  const [campaignForm, setCampaignForm] = useState<Partial<FundraisingCampaign>>({});
  const [donationForm, setDonationForm] = useState<Partial<Donation>>({});
  const isCampaign = !donation;

  useEffect(() => {
    if (open) {
      if (campaign) setCampaignForm(campaign);
      else setCampaignForm({ name: "", purpose: "", targetAmount: 0, raisedAmount: 0, startDate: "", endDate: "", status: "planned" });
      if (donation) setDonationForm(donation);
      else setDonationForm({ campaignRef: "", donorName: "", amount: 0, donatedDate: "", method: "cash", receiptNo: "", status: "received" });
    }
  }, [open, campaign, donation]);

  const setCampaign = (patch: Partial<FundraisingCampaign>) => setCampaignForm((f) => ({ ...f, ...patch }));
  const setDonation = (patch: Partial<Donation>) => setDonationForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (isCampaign) {
      if (!campaignForm.name || !campaignForm.purpose || !campaignForm.startDate) return;
      saveCampaign.mutate({ ...(campaign ?? { id: uid(), createdOn: now }), ...campaignForm } as FundraisingCampaign, { onSuccess: () => onOpenChange(false) });
    } else {
      if (!donationForm.donorName || !donationForm.campaignRef) return;
      saveDonation.mutate({ ...(donation ?? { id: uid(), createdOn: now }), ...donationForm } as Donation, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCampaign ? (campaign ? `Edit campaign — ${campaign.name}` : "Create campaign") : (donation ? `Edit donation — ${donation.donorName}` : "Record donation")}</DialogTitle>
          <DialogDescription>{isCampaign ? "Create a fundraising campaign (M20.06)." : "Record a donation (M20.06)."}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {isCampaign ? (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. Library Fund" value={campaignForm.name ?? ""} onChange={(e) => setCampaign({ name: e.target.value })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Purpose</Label><Input placeholder="e.g. New library books" value={campaignForm.purpose ?? ""} onChange={(e) => setCampaign({ purpose: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Target Amount (₹)</Label><Input type="number" value={campaignForm.targetAmount ?? 0} onChange={(e) => setCampaign({ targetAmount: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={campaignForm.status} onValueChange={(v) => setCampaign({ status: v as FundraisingCampaign["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CAMPAIGN_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={campaignForm.startDate ?? ""} onChange={(e) => setCampaign({ startDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={campaignForm.endDate ?? ""} onChange={(e) => setCampaign({ endDate: e.target.value })} /></div>
            </>
          ) : (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Donor Name</Label><Input placeholder="e.g. Ram Shrestha" value={donationForm.donorName ?? ""} onChange={(e) => setDonation({ donorName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Campaign</Label><Select value={donationForm.campaignRef} onValueChange={(v) => setDonation({ campaignRef: v })}><SelectTrigger><SelectValue placeholder="Select campaign" /></SelectTrigger><SelectContent>{(campaigns.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Amount (₹)</Label><Input type="number" value={donationForm.amount ?? 0} onChange={(e) => setDonation({ amount: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Method</Label><Select value={donationForm.method} onValueChange={(v) => setDonation({ method: v as Donation["method"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DONATION_METHODS.map((m) => <SelectItem key={m} value={m} className="capitalize">{m.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Donation Date</Label><Input type="date" value={donationForm.donatedDate ?? ""} onChange={(e) => setDonation({ donatedDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Receipt No</Label><Input placeholder="e.g. RCPT-001" value={donationForm.receiptNo ?? ""} onChange={(e) => setDonation({ receiptNo: e.target.value })} /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Status</Label><Select value={donationForm.status} onValueChange={(v) => setDonation({ status: v as Donation["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{DONATION_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(isCampaign ? saveCampaign : saveDonation).isPending}>
            <Plus className="h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
