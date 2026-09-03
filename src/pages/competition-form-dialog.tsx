import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveCompetition, useSaveCompetitionEntry, useSaveCompetitionResult, useCompetitions, useCompetitionEntries } from "@/hooks/use-erp";
import { uid } from "@/lib/utils";
import type { Competition, CompetitionEntry, CompetitionResult } from "@/lib/types";

const COMP_LEVELS: Competition["level"][] = ["intra_school", "district", "zone", "national"];
const COMP_STATUSES: Competition["status"][] = ["planned", "open", "ongoing", "completed"];
const ENTRY_STATUSES: CompetitionEntry["status"][] = ["entered", "confirmed", "withdrew"];
const RESULT_STATUSES: CompetitionResult["status"][] = ["pending", "approved", "protested"];

export function CompetitionFormDialog({ open, onOpenChange, competition, entry, result }: { open: boolean; onOpenChange: (o: boolean) => void; competition?: Competition; entry?: CompetitionEntry; result?: CompetitionResult }) {
  const saveComp = useSaveCompetition();
  const saveEntry = useSaveCompetitionEntry();
  const saveResult = useSaveCompetitionResult();
  const comps = useCompetitions();
  const entries = useCompetitionEntries();
  const [compForm, setCompForm] = useState<Partial<Competition>>({});
  const [entryForm, setEntryForm] = useState<Partial<CompetitionEntry>>({});
  const [resultForm, setResultForm] = useState<Partial<CompetitionResult>>({});
  const mode: "competition" | "entry" | "result" = competition ? "competition" : entry ? "entry" : result ? "result" : "competition";

  useEffect(() => {
    if (open) {
      if (competition) setCompForm(competition);
      else setCompForm({ name: "", sport: "", level: "intra_school", startDate: "", endDate: "", venue: "", status: "planned" });
      if (entry) setEntryForm(entry);
      else setEntryForm({ teamName: "", competitionRef: "", category: "", entryDate: "", status: "entered" });
      if (result) setResultForm(result);
      else setResultForm({ competitionRef: "", entryRef: "", rank: 1, score: "", award: "", approvedBy: "", status: "pending" });
    }
  }, [open, competition, entry, result]);

  const setComp = (patch: Partial<Competition>) => setCompForm((f) => ({ ...f, ...patch }));
  const setEntry = (patch: Partial<CompetitionEntry>) => setEntryForm((f) => ({ ...f, ...patch }));
  const setResult = (patch: Partial<CompetitionResult>) => setResultForm((f) => ({ ...f, ...patch }));

  const submit = () => {
    const now = new Date().toISOString();
    if (mode === "competition") {
      if (!compForm.name || !compForm.sport || !compForm.startDate) return;
      saveComp.mutate({ ...(competition ?? { id: uid(), createdOn: now }), ...compForm } as Competition, { onSuccess: () => onOpenChange(false) });
    } else if (mode === "entry") {
      if (!entryForm.teamName || !entryForm.competitionRef) return;
      saveEntry.mutate({ ...(entry ?? { id: uid(), createdOn: now }), ...entryForm } as CompetitionEntry, { onSuccess: () => onOpenChange(false) });
    } else {
      if (!resultForm.competitionRef || !resultForm.award) return;
      saveResult.mutate({ ...(result ?? { id: uid(), createdOn: now }), ...resultForm } as CompetitionResult, { onSuccess: () => onOpenChange(false) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "competition" ? (competition ? `Edit competition — ${competition.name}` : "Create competition") : mode === "entry" ? (entry ? `Edit entry — ${entry.teamName}` : "Create entry") : (result ? `Edit result — #${result.rank}` : "Create result")}</DialogTitle>
          <DialogDescription>M20.03 Sports & Competition</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === "competition" && (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Name</Label><Input placeholder="e.g. Inter-school Football" value={compForm.name ?? ""} onChange={(e) => setComp({ name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Sport</Label><Input placeholder="e.g. Football" value={compForm.sport ?? ""} onChange={(e) => setComp({ sport: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Level</Label><Select value={compForm.level} onValueChange={(v) => setComp({ level: v as Competition["level"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COMP_LEVELS.map((l) => <SelectItem key={l} value={l} className="capitalize">{l.replace("_", " ")}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Venue</Label><Input placeholder="e.g. Stadium" value={compForm.venue ?? ""} onChange={(e) => setComp({ venue: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={compForm.status} onValueChange={(v) => setComp({ status: v as Competition["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{COMP_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Start Date</Label><Input type="date" value={compForm.startDate ?? ""} onChange={(e) => setComp({ startDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>End Date</Label><Input type="date" value={compForm.endDate ?? ""} onChange={(e) => setComp({ endDate: e.target.value })} /></div>
            </>
          )}
          {mode === "entry" && (
            <>
              <div className="space-y-1.5 sm:col-span-2"><Label>Team Name</Label><Input placeholder="e.g. Lions" value={entryForm.teamName ?? ""} onChange={(e) => setEntry({ teamName: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Competition</Label><Select value={entryForm.competitionRef} onValueChange={(v) => setEntry({ competitionRef: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{(comps.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Category</Label><Input placeholder="e.g. Under-14" value={entryForm.category ?? ""} onChange={(e) => setEntry({ category: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Entry Date</Label><Input type="date" value={entryForm.entryDate ?? ""} onChange={(e) => setEntry({ entryDate: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={entryForm.status} onValueChange={(v) => setEntry({ status: v as CompetitionEntry["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{ENTRY_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
            </>
          )}
          {mode === "result" && (
            <>
              <div className="space-y-1.5"><Label>Competition</Label><Select value={resultForm.competitionRef} onValueChange={(v) => setResult({ competitionRef: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{(comps.data ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Entry</Label><Select value={resultForm.entryRef} onValueChange={(v) => setResult({ entryRef: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{(entries.data ?? []).map((e) => <SelectItem key={e.id} value={e.id}>{e.teamName}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Rank</Label><Input type="number" value={resultForm.rank ?? 1} onChange={(e) => setResult({ rank: Number(e.target.value) })} /></div>
              <div className="space-y-1.5"><Label>Score</Label><Input placeholder="e.g. 95/100" value={resultForm.score ?? ""} onChange={(e) => setResult({ score: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Award</Label><Input placeholder="e.g. Gold Medal" value={resultForm.award ?? ""} onChange={(e) => setResult({ award: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Status</Label><Select value={resultForm.status} onValueChange={(v) => setResult({ status: v as CompetitionResult["status"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{RESULT_STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select></div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={(mode === "competition" ? saveComp : mode === "entry" ? saveEntry : saveResult).isPending}>
            <Plus className="h-4 w-4" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
