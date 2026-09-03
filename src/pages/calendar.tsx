import { useState, useEffect } from "react";
import {
  CalendarRange, Plus, Trash2, Hash, Globe2, CalendarClock, Sun, Moon, Snowflake,
} from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import {
  useCalendarYears, useHolidays, useLocale, useSequences,
  useSaveHoliday, useDeleteHoliday, useSaveLocale, useSaveSequence,
} from "@/hooks/use-erp";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fmtDate, todayISO, uid } from "@/lib/utils";
import { CanCreate } from "@/components/permission-gate";
import type { Holiday, LocaleSettings } from "@/lib/types";

const FESTIVAL_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  festival: Sun, school: Snowflake, public: Moon,
};

function HolidayDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const save = useSaveHoliday();
  const [form, setForm] = useState<Partial<Holiday>>({});

  const reset = () =>
    setForm({
      name: "", nameNe: "", date: todayISO(), dateBs: "—", type: "festival",
    });

  const submit = () => {
    if (!form.name) return;
    save.mutate(
      { id: uid(), name: form.name!, nameNe: form.nameNe || "", date: form.date!, dateBs: form.dateBs || "—", type: form.type as Holiday["type"] },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add calendar day</DialogTitle>
          <DialogDescription>Closed days are never silently rewritten (M01.05).</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Holiday name (EN)</Label>
            <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Dashain Holiday" />
          </div>
          <div className="space-y-1.5 font-nepali">
            <Label>Nepali name</Label>
            <Input value={form.nameNe ?? ""} onChange={(e) => setForm((f) => ({ ...f, nameNe: e.target.value }))} placeholder="दशैं बिदा" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={form.type ?? "festival"} onValueChange={(v) => setForm((f) => ({ ...f, type: v as Holiday["type"] }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="festival">Festival / cultural</SelectItem>
                <SelectItem value="public">Public holiday</SelectItem>
                <SelectItem value="school">School break</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Date (AD)</Label>
            <Input type="date" value={form.date ?? ""} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={save.isPending || !form.name}>
            <Plus className="h-4 w-4" /> Add day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default function CalendarPage() {
  const years = useCalendarYears();
  const holidays = useHolidays();
  const locale = useLocale();
  const sequences = useSequences();
  const delHoliday = useDeleteHoliday();
  const saveLocale = useSaveLocale();
  const saveSeq = useSaveSequence();

  const [holidayDialog, setHolidayDialog] = useState(false);
  const [localeForm, setLocaleForm] = useState<LocaleSettings | null>(null);

  useEffect(() => {
    if (!localeForm && locale.data) setLocaleForm(locale.data);
  }, [locale.data, localeForm]);

  const saveLoc = () => {
    if (localeForm) saveLocale.mutate(localeForm);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={CalendarRange}
        title="Calendar, Locale & Numbering"
        titleNe="पात्रो र प्रणाली"
        microModule="M01.05"
        description="Academic & fiscal calendars, Gregorian + Bikram Sambat display, locale settings, and collision-safe document sequences."
      />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar"><CalendarClock className="h-4 w-4" /> Academic calendar</TabsTrigger>
          <TabsTrigger value="locale"><Globe2 className="h-4 w-4" /> Locale & formats</TabsTrigger>
          <TabsTrigger value="sequences"><Hash className="h-4 w-4" /> Document sequences</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          {years.isLoading || holidays.isLoading ? (
            <LoadingBlock />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {(years.data ?? []).map((y) => (
                  <Card key={y.id} className={`animate-fade-up ${y.status === "current" ? "ring-2 ring-primary/30" : ""}`}>
                    <CardHeader className="space-y-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{y.academicYear}</CardTitle>
                        {y.status === "current" && <Badge variant="success">Current</Badge>}
                        {y.status === "upcoming" && <Badge variant="info">Upcoming</Badge>}
                        {y.status === "completed" && <Badge variant="secondary">Completed</Badge>}
                      </div>
                      <CardDescription>{y.adRange} · {y.bsRange}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{y.workingDays} working days</span>
                      <span className="font-semibold">{y.totalDays} days</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div className="space-y-1">
                    <CardTitle className="text-base">Holidays & closed days — 2083 BS</CardTitle>
                    <CardDescription>Nepali (BS) dates shown alongside AD for display</CardDescription>
                  </div>
                  <CanCreate resource="calendars">
                    <Button size="sm" onClick={() => setHolidayDialog(true)}>
                      <Plus className="h-4 w-4" /> Add day
                    </Button>
                  </CanCreate>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="pl-5">Holiday</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>AD date</TableHead>
                        <TableHead>BS date</TableHead>
                        <TableHead className="pr-5" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(holidays.data ?? []).map((h) => {
                        const Icon = FESTIVAL_ICON[h.type] ?? Sun;
                        return (
                          <TableRow key={h.id} className="group">
                            <TableCell className="pl-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{h.name}</p>
                                  <p className="font-nepali text-xs text-muted-foreground">{h.nameNe}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><Badge variant="secondary" className="capitalize">{h.type}</Badge></TableCell>
                            <TableCell className="text-sm">{fmtDate(h.date)}</TableCell>
                            <TableCell className="font-nepali text-sm">{h.dateBs}</TableCell>
                            <TableCell className="pr-5 text-right">
                              <Button
                                variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                                onClick={() => delHoliday.mutate(h)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
<TabsContent value="locale">
          <Card className="max-w-2xl animate-fade-up">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Locale & display settings</CardTitle>
              <CardDescription>Pluggable regionalization — Nepal school defaults</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {localeForm && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Time zone</Label>
                      <Select value={localeForm.timezone} onValueChange={(v) => setLocaleForm({ ...localeForm, timezone: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kathmandu (UTC+05:45)">Asia/Kathmandu (UTC+05:45)</SelectItem>
                          <SelectItem value="Asia/Kolkata (UTC+05:30)">Asia/Kolkata (UTC+05:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Week starts on</Label>
                      <Select value={localeForm.weekStart} onValueChange={(v) => setLocaleForm({ ...localeForm, weekStart: v as LocaleSettings["weekStart"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Language</Label>
                      <Select value={localeForm.language} onValueChange={(v) => setLocaleForm({ ...localeForm, language: v as LocaleSettings["language"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en" className="capitalize">English</SelectItem>
                          <SelectItem value="ne" className="capitalize">Nepali</SelectItem>
                          <SelectItem value="both" className="capitalize">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Calendar system</Label>
                      <Select value={localeForm.calendarSystem} onValueChange={(v) => setLocaleForm({ ...localeForm, calendarSystem: v as LocaleSettings["calendarSystem"] })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BS" className="capitalize">Bikram Sambat</SelectItem>
                          <SelectItem value="AD" className="capitalize">AD</SelectItem>
                          <SelectItem value="both" className="capitalize">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Date format</Label>
                      <Select value={localeForm.dateFormat} onValueChange={(v) => setLocaleForm({ ...localeForm, dateFormat: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Number format</Label>
                      <Select value={localeForm.numberFormat} onValueChange={(v) => setLocaleForm({ ...localeForm, numberFormat: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-IN (1,23,456.78)">en-IN (1,23,456.78)</SelectItem>
                          <SelectItem value="en-US (123,456.78)">en-US (123,456.78)</SelectItem>
                          <SelectItem value="Nepali digits (१,२३,४५६)">Nepali digits (१,२३,४५६)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-dashed p-3 text-sm">
                    <span className="text-muted-foreground">Fiscal year starts</span>
                    <span className="font-medium">{localeForm.fiscalYearStart}</span>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveLoc} disabled={saveLocale.isPending}>
                      Save locale settings
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
<TabsContent value="sequences">
          <Card className="animate-fade-up">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">Document sequences</CardTitle>
              <CardDescription>Collision-safe numbering locked by fiscal/academic period</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">Document type</TableHead>
                    <TableHead>Prefix</TableHead>
                    <TableHead>Next number</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="pr-5">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(sequences.data ?? []).map((s) => (
                    <TableRow key={s.id} className="group">
                      <TableCell className="pl-5">
                        <p className="text-sm font-medium">{s.docType}</p>
                        <p className="text-xs text-muted-foreground">{s.description}</p>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{s.prefix}{String(s.currentNumber).padStart(s.padLength, "0")}</TableCell>
                      <TableCell className="text-sm">{s.prefix}{String(s.currentNumber + 1).padStart(s.padLength, "0")}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{s.period}</TableCell>
                      <TableCell className="pr-5">
                        <div className="flex items-center gap-2">
                          <Badge variant={s.locked ? "warning" : "success"}>{s.locked ? "Locked" : "Live"}</Badge>
                          <Button
                            variant="ghost" size="sm" className="h-7 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => saveSeq.mutate({ ...s, locked: !s.locked })}
                          >
                            {s.locked ? "Unlock" : "Lock"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <HolidayDialog open={holidayDialog} onOpenChange={setHolidayDialog} />
    </div>
  );
}