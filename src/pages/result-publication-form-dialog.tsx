import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveResultPublication, useResultRuns } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { ResultPublication, PublicationStatus } from "@/lib/types";

const STATUSES: PublicationStatus[] = ["draft", "approved", "published", "revoked"];

export function ResultPublicationFormDialog({ open, onOpenChange, publication }: { open: boolean; onOpenChange: (o: boolean) => void; publication?: ResultPublication }) {
  const save = useSaveResultPublication();
  const resultRuns = useResultRuns();
  const [form, setForm] = useState<Partial<ResultPublication>>({});

  useEffect(() => {
    if (open) setForm(publication ?? { resultRunId: "", publishedOn: new Date().toISOString().slice(0, 10), status: "draft", approvedBy: "" });
  }, [open, publication]);

  const set = (patch: Partial<ResultPublication>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.resultRunId || !form.publishedOn || !form.status) return;
    const now = new Date().toISOString();
    const resultRunName = resultRuns.data?.find((r) => r.id === form.resultRunId)?.name ?? "";
    save.mutate(
      {
        ...(publication ?? { id: uid(), tenantId: "tenant-default", schoolId: "camp-main", createdOn: now }),
        ...form,
        resultRunName,
        updatedOn: now,
      } as ResultPublication,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{publication ? `Edit publication — ${publication.resultRunName ?? publication.resultRunId}` : "Create result publication"}</DialogTitle>
          <DialogDescription>Publish or revoke a result run outcome (M09.02).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Result Run</Label>
            <Select value={form.resultRunId} onValueChange={(v) => set({ resultRunId: v })}>
              <SelectTrigger><SelectValue placeholder="Select run" /></SelectTrigger>
              <SelectContent>{(resultRuns.data ?? []).map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Published On</Label>
            <Input type="date" value={form.publishedOn ? form.publishedOn.slice(0, 10) : ""} onChange={(e) => set({ publishedOn: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as PublicationStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Approved By</Label>
            <Input placeholder="e.g. Ramesh Shrestha" value={form.approvedBy ?? ""} onChange={(e) => set({ approvedBy: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.resultRunId || !form.publishedOn || !form.status}>
            <Plus className="h-4 w-4" /> {publication ? "Save changes" : "Create publication"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
