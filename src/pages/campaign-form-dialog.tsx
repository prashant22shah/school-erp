import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCampaign } from "@/hooks/use-erp";
import { todayISO, uid } from "@/lib/utils";
import type { Campaign, CampaignStatus } from "@/lib/types";

const CHANNELS = ["web", "walk_in", "referral", "agent", "fair", "social"] as const;
const STATUSES: CampaignStatus[] = ["draft", "active", "paused", "completed", "archived"];

export function CampaignFormDialog({ open, onOpenChange, campaign }: { open: boolean; onOpenChange: (o: boolean) => void; campaign?: Campaign }) {
  const save = useSaveCampaign();
  const [form, setForm] = useState<Partial<Campaign>>({});

  useEffect(() => {
    if (open) {
      setForm(campaign ?? { name: "", nameNe: "", code: "", channel: "web", startDate: "", endDate: "", budget: 0, targetEnquiries: 0, status: "draft", createdOn: todayISO() });
    }
  }, [open, campaign]);

  const set = (patch: Partial<Campaign>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.code || !form.startDate || !form.endDate) return;
    save.mutate(
      { ...(campaign ?? { id: uid(), actualEnquiries: 0 }), ...form, tenantId: "tenant-default" } as Campaign,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{campaign ? `Edit campaign — ${campaign.name}` : "Create campaign"}</DialogTitle>
          <DialogDescription>Define a marketing campaign for student enquiry capture (M04.01).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input placeholder="Campaign name" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nepali name</Label>
            <Input className="font-nepali" placeholder="नेपाली नाम" value={form.nameNe ?? ""} onChange={(e) => set({ nameNe: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. CAMP-2081" value={form.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Channel</Label>
            <Select value={form.channel} onValueChange={(v) => set({ channel: v as Campaign["channel"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CHANNELS.map((c) => <SelectItem key={c} value={c} className="capitalize">{c.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
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
            <Label>Budget (NPR)</Label>
            <Input type="number" placeholder="0" value={form.budget ?? ""} onChange={(e) => set({ budget: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Target enquiries</Label>
            <Input type="number" placeholder="0" value={form.targetEnquiries ?? ""} onChange={(e) => set({ targetEnquiries: Number(e.target.value) })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as CampaignStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.code || !form.startDate || !form.endDate}>
            <Plus className="h-4 w-4" /> {campaign ? "Save changes" : "Create campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
