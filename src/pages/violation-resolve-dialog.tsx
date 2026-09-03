import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveDutyViolation } from "@/hooks/use-erp";
import { todayISO } from "@/lib/utils";
import type { DutyViolation } from "@/lib/types";

export function ViolationResolveDialog({ open, onOpenChange, violation }: { open: boolean; onOpenChange: (o: boolean) => void; violation: DutyViolation }) {
  const save = useSaveDutyViolation();
  const [status, setStatus] = useState<DutyViolation["status"]>("resolved");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) { setStatus("resolved"); setNotes(violation.notes ?? ""); }
  }, [open, violation]);

  const submit = () => {
    save.mutate({ ...violation, status, resolvedBy: "Anish Karki", resolvedOn: todayISO(), notes }, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Resolve violation — {violation.ruleName}</DialogTitle>
          <DialogDescription>{violation.userName} has conflicting roles: {violation.roleA} + {violation.roleB}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-1.5">
            <Label>Resolution</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DutyViolation["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">Resolved — conflict removed</SelectItem>
                <SelectItem value="acknowledged">Acknowledged — under review</SelectItem>
                <SelectItem value="waived">Waived — approved exception</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Input placeholder="Resolution details…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending}>
            <CheckCircle2 className="h-4 w-4" /> Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
