import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSaveJournalEntry, useFiscalYears } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { JournalEntry, JournalStatus } from "@/lib/types";

const STATUSES: JournalStatus[] = ["draft", "posted", "reversed"];

export function JournalEntryFormDialog({ open, onOpenChange, entry }: { open: boolean; onOpenChange: (o: boolean) => void; entry?: JournalEntry }) {
  const save = useSaveJournalEntry();
  const fiscalYears = useFiscalYears();
  const [form, setForm] = useState<Partial<JournalEntry>>({});

  useEffect(() => {
    if (open) {
      setForm(
        entry ?? {
          fiscalYearId: "",
          entryNo: `JE-${Math.floor(1000 + Math.random() * 9000)}`,
          entryDate: new Date().toISOString().slice(0, 10),
          description: "",
          totalDebit: 0,
          totalCredit: 0,
          status: "draft",
        }
      );
    }
  }, [open, entry]);

  const set = (patch: Partial<JournalEntry>) => setForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    if (!form.fiscalYearId || !form.entryNo || !form.entryDate || !form.description || form.totalDebit == null || form.totalCredit == null || !form.status) return;
    const now = new Date().toISOString();
    const fiscalYearName = fiscalYears.data?.find((f) => f.id === form.fiscalYearId)?.name ?? "";
    save.mutate(
      {
        id: entry?.id ?? uid(),
        tenantId: "tenant-default",
        schoolId: "camp-main",
        createdOn: entry?.createdOn ?? now,
        updatedOn: now,
        fiscalYearId: form.fiscalYearId!,
        fiscalYearName,
        entryNo: form.entryNo!,
        entryDate: form.entryDate!,
        description: form.description!,
        totalDebit: Number(form.totalDebit),
        totalCredit: Number(form.totalCredit),
        status: form.status!,
      } as JournalEntry,
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{entry ? `Edit journal entry — ${entry.entryNo}` : "Create journal entry"}</DialogTitle>
          <DialogDescription>Record double-entry journal with fiscal year linkage (M12.03/M12.04).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Fiscal Year</Label>
            <Select value={form.fiscalYearId} onValueChange={(v) => set({ fiscalYearId: v })}>
              <SelectTrigger><SelectValue placeholder="Select fiscal year" /></SelectTrigger>
              <SelectContent>{(fiscalYears.data ?? []).map((fy) => <SelectItem key={fy.id} value={fy.id}>{fy.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Entry No</Label>
            <Input placeholder="e.g. JE-1001" value={form.entryNo ?? ""} onChange={(e) => set({ entryNo: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Entry Date</Label>
            <Input type="date" value={form.entryDate ? form.entryDate.slice(0, 10) : ""} onChange={(e) => set({ entryDate: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set({ status: v as JournalStatus })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Total Debit</Label>
            <Input type="number" min={0} value={form.totalDebit ?? 0} onChange={(e) => set({ totalDebit: +e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Total Credit</Label>
            <Input type="number" min={0} value={form.totalCredit ?? 0} onChange={(e) => set({ totalCredit: +e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Journal description…" value={form.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.fiscalYearId || !form.entryNo || !form.entryDate || !form.description}>
            <Plus className="h-4 w-4" /> {entry ? "Save changes" : "Create entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
