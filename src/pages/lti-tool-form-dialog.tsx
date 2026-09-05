import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveLtiTool } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { LTITool } from "@/lib/types";

const STATUSES: LTITool["status"][] = ["active", "inactive", "pending_config"];

export function LTIToolFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (o: boolean) => void; editing?: LTITool }) {
  const save = useSaveLtiTool();
  const [form, setForm] = useState<Partial<LTITool>>({});

  useEffect(() => {
    if (open) {
      setForm(
        editing ?? {
          name: "", vendor: "", launchUrl: "",
          consumerKey: "", version: "1.3", status: "pending_config",
        }
      );
    }
  }, [open, editing]);

  const set = (patch: Partial<LTITool>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.name || !form.launchUrl) return;
    const now = new Date().toISOString();
    save.mutate(
      {
        ...(editing ?? { id: uid(), createdOn: now }),
        ...form,
      } as LTITool,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? `Edit tool — ${editing.name}` : "Register LTI tool"}</DialogTitle>
          <DialogDescription>Configure an external LTI tool provider (M10.07).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Name</Label>
            <Input placeholder="e.g. Google Classroom" value={form.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Vendor</Label>
            <Input placeholder="e.g. Google" value={form.vendor ?? ""} onChange={(e) => set({ vendor: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Version</Label>
            <Input placeholder="e.g. 1.3" value={form.version ?? ""} onChange={(e) => set({ version: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Launch URL</Label>
            <Input placeholder="https://..." value={form.launchUrl ?? ""} onChange={(e) => set({ launchUrl: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Consumer Key</Label>
            <Input placeholder="LTI consumer key" value={form.consumerKey ?? ""} onChange={(e) => set({ consumerKey: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as LTITool["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name || !form.launchUrl}>
            <Plus className="h-4 w-4" /> {editing ? "Save changes" : "Register tool"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
