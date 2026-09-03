import { useMemo, useState } from "react";
import { Heart, DollarSign, Plus, Search } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FundraisingCampaignFormDialog } from "@/pages/fundraising-campaign-form-dialog";
import { useFundraisingCampaigns, useDonations, useDeleteFundraisingCampaign, useDeleteDonation } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import type { FundraisingCampaign, Donation } from "@/lib/types";

const campaignStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  planned: "secondary", active: "info", completed: "success", cancelled: "secondary",
};
const donationStatusVariant: Record<string, "default" | "info" | "warning" | "secondary" | "success"> = {
  received: "info", acknowledged: "secondary", receipted: "success",
};

export default function FundraisingDonationsPage() {
  const campaigns = useFundraisingCampaigns();
  const donations = useDonations();
  const deleteCampaign = useDeleteFundraisingCampaign();
  const deleteDonation = useDeleteDonation();
  const [q, setQ] = useState("");
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<FundraisingCampaign | undefined>();
  const [donationOpen, setDonationOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | undefined>();

  const filteredCampaigns = useMemo(() => {
    let list = campaigns.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.purpose.toLowerCase().includes(s) || c.status.toLowerCase().includes(s)); }
    return list;
  }, [campaigns.data, q]);

  const filteredDonations = useMemo(() => {
    let list = donations.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((d) => d.donorName.toLowerCase().includes(s) || d.method.toLowerCase().includes(s) || d.receiptNo.toLowerCase().includes(s)); }
    return list;
  }, [donations.data, q]);

  const totalRaised = (campaigns.data ?? []).reduce((sum, c) => sum + c.raisedAmount, 0);

  return (
    <div className="space-y-6">
      <PageHeader icon={Heart} title="Fundraising & Donations" titleNe="कोष जुटाउने" microModule="M20.06" description="Manage fundraising campaigns and track donations." actions={<div className="flex gap-2"><CanCreate resource="fundraisingCampaigns"><Button variant="outline" onClick={() => { setEditingCampaign(undefined); setCampaignOpen(true); }}><Plus className="h-4 w-4" /> New Campaign</Button></CanCreate><CanCreate resource="donations"><Button onClick={() => { setEditingDonation(undefined); setDonationOpen(true); }}><Plus className="h-4 w-4" /> Record Donation</Button></CanCreate></div>} />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Heart className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Campaigns</p><p className="text-lg font-bold">{campaigns.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Raised</p><p className="text-lg font-bold">₹{totalRaised.toLocaleString()}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><DollarSign className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Donations</p><p className="text-lg font-bold">{donations.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search campaigns or donations…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <Tabs defaultValue="campaigns">
        <TabsList><TabsTrigger value="campaigns">Campaigns</TabsTrigger><TabsTrigger value="donations">Donations</TabsTrigger></TabsList>
        <TabsContent value="campaigns" className="mt-4">
          {campaigns.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Name</TableHead><TableHead>Purpose</TableHead><TableHead>Target</TableHead><TableHead>Raised</TableHead><TableHead>Period</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredCampaigns.map((c) => (<TableRow key={c.id} className="group"><TableCell className="pl-5 font-medium">{c.name}</TableCell><TableCell><span className="text-sm">{c.purpose}</span></TableCell><TableCell><span className="text-sm font-mono">₹{c.targetAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">₹{c.raisedAmount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm font-mono">{c.startDate} → {c.endDate}</span></TableCell><TableCell><Badge variant={campaignStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="fundraisingCampaigns" onEdit={() => { setEditingCampaign(c); setCampaignOpen(true); }} onDelete={() => deleteCampaign.mutate(c)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
        <TabsContent value="donations" className="mt-4">
          {donations.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Donor</TableHead><TableHead>Campaign</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDonations.map((d) => (<TableRow key={d.id} className="group"><TableCell className="pl-5 font-medium">{d.donorName}</TableCell><TableCell><Badge variant="secondary">{d.campaignRef}</Badge></TableCell><TableCell><span className="text-sm font-mono">₹{d.amount.toLocaleString()}</span></TableCell><TableCell><span className="text-sm capitalize">{d.method.replace("_", " ")}</span></TableCell><TableCell><span className="text-sm font-mono">{d.donatedDate}</span></TableCell><TableCell><Badge variant={donationStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell><TableCell className="pr-5 text-right"><RowActionMenu resource="donations" onEdit={() => { setEditingDonation(d); setDonationOpen(true); }} onDelete={() => deleteDonation.mutate(d)} /></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
      <FundraisingCampaignFormDialog open={campaignOpen} onOpenChange={setCampaignOpen} campaign={editingCampaign} />
      <FundraisingCampaignFormDialog open={donationOpen} onOpenChange={setDonationOpen} donation={editingDonation} />
    </div>
  );
}
