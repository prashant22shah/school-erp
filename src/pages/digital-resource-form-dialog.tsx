import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDigitalResource } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { DigitalResource, DigitalAccessStatus } from "@/lib/types";

const STATUSES: DigitalAccessStatus[] = ["active", "expired", "revoked"];
const ACCESS_TYPES: DigitalResource["accessType"][] = ["open", "subscription", "per_user"];

export function DigitalResourceFormDialog({ open, onOpenChange, resource }: { open: boolean; onOpenChange: (o: boolean) => void; resource?: DigitalResource | null }) {
  const save = useSaveDigitalResource();
  const [form, setForm] = useState<Partial<DigitalResource>>({});

  useEffect(() => {
    if (open) {
      setForm(
        resource ?? {
          title: "",
          provider: "",
          url: "",
          licenseKey: "",
          accessType: "open",
          validFrom: new Date().toISOString().slice(0, 10),
          validUntil: "",
          status: "active",
        }
      );
    }
  }, [open, resource]);

  const set = (patch: Partial<DigitalResource>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.title || !form.provider || !form.accessType || !form.validFrom || !form.status) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        id: resource?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: resource?.createdOn ?? now,
        updatedOn: now,
        title: form.title!,
        provider: form.provider!,
        url: form.url || undefined,
        licenseKey: form.licenseKey || undefined,
        accessType: form.accessType!,
        validFrom: form.validFrom!,
        validUntil: form.validUntil || undefined,
        status: form.status!,
      } as DigitalResource,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{resource ? `Edit digital resource — ${resource.title}` : "Create digital resource"}</DialogTitle>
          <DialogDescription>Digital resources and access (M16.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Title</Label>
            <Input placeholder="e.g. Pustakalaya E-Library" value={form.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Provider</Label>
            <Input placeholder="e.g. OLE Nepal" value={form.provider ?? ""} onChange={(e) => set({ provider: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Access Type</Label>
            <Select value={form.accessType} onValueChange={(v) => set({ accessType: v as DigitalResource["accessType"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{ACCESS_TYPES.map((a) => <SelectItem key={a} value={a} className="capitalize">{a.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>URL (optional)</Label>
            <Input placeholder="https://…" value={form.url ?? ""} onChange={(e) => set({ url: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>License Key (optional)</Label>
            <Input placeholder="License key" value={form.licenseKey ?? ""} onChange={(e) => set({ licenseKey: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid From</Label>
            <Input type="date" value={form.validFrom ? form.validFrom.slice(0, 10) : ""} onChange={(e) => set({ validFrom: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Valid Until (optional)</Label>
            <Input type="date" value={form.validUntil ? form.validUntil.slice(0, 10) : ""} onChange={(e) => set({ validUntil: e.target.value || undefined })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as DigitalAccessStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.title || !form.provider || !form.accessType || !form.validFrom || !form.status}>
            <Plus className="h-4 w-4" /> {resource ? "Save changes" : "Create digital resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
