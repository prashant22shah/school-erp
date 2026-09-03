import { useMemo, useState } from "react";
import { ClipboardCheck, Search, Plus, Pencil, Trash2, Calendar, Award, Gift, CheckCircle2 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { SelectionEventFormDialog } from "@/pages/selection-event-form-dialog";
import { OfferFormDialog } from "@/pages/offer-form-dialog";
import { useSelectionEvents, useSelectionScores, useOffers, useOfferAcceptances, useDeleteSelectionEvent, useDeleteSelectionScore, useDeleteOffer, useDeleteOfferAcceptance } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { SelectionEvent, SelectionScore, Offer, OfferAcceptance } from "@/lib/types";

const eventStatusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  scheduled: "info", completed: "success", cancelled: "secondary", rescheduled: "warning",
};

const offerStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  pending: "info", offered: "warning", accepted: "success", declined: "destructive",
  waitlisted: "secondary", expired: "secondary", withdrawn: "secondary",
};

export default function SelectionOffer() {
  const events = useSelectionEvents();
  const scores = useSelectionScores();
  const offers = useOffers();
  const acceptances = useOfferAcceptances();
  const deleteEvent = useDeleteSelectionEvent();
  const deleteScore = useDeleteSelectionScore();
  const deleteOffer = useDeleteOffer();
  const deleteAcceptance = useDeleteOfferAcceptance();
  const [q, setQ] = useState("");
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SelectionEvent | undefined>();
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | undefined>();

  const filteredEvents = useMemo(() => {
    let list = events.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.applicationName.toLowerCase().includes(s) || e.type.toLowerCase().includes(s)); }
    return list;
  }, [events.data, q]);

  const filteredScores = useMemo(() => {
    let list = scores.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((sc) => sc.criterion.toLowerCase().includes(s) || sc.evaluatedBy.toLowerCase().includes(s)); }
    return list;
  }, [scores.data, q]);

  const filteredOffers = useMemo(() => {
    let list = offers.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((o) => o.applicationName.toLowerCase().includes(s) || o.offeredGradeName.toLowerCase().includes(s)); }
    return list;
  }, [offers.data, q]);

  const filteredAcceptances = useMemo(() => {
    let list = acceptances.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.offerName.toLowerCase().includes(s)); }
    return list;
  }, [acceptances.data, q]);

  const completedEvents = (events.data ?? []).filter((e) => e.status === "completed").length;
  const acceptedOffers = (offers.data ?? []).filter((o) => o.status === "accepted").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardCheck}
        title="Selections & Offers"
        titleNe="छनोट तथा अफर"
        microModule="M04.05 + M04.06"
        description="Manage entrance tests, interviews, selection scores, admission offers and acceptances."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { setEditingEvent(undefined); setEventDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New event
            </Button>
            <Button onClick={() => { setEditingOffer(undefined); setOfferDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New offer
            </Button>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Calendar className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total events</p><p className="text-lg font-bold">{events.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Completed events</p><p className="text-lg font-bold">{completedEvents}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Gift className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total offers</p><p className="text-lg font-bold">{offers.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Award className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Accepted offers</p><p className="text-lg font-bold">{acceptedOffers}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events, offers…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="events">
        <TabsList>
          <TabsTrigger value="events">Selection Events</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="acceptances">Acceptances</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-4">
          {events.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Application</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead>Panel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{e.applicationName}</p></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{e.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{fmtDate(e.scheduledDate)}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{e.scheduledTime ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{e.venue ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{e.panelMembers ?? "—"}</span></TableCell>
                        <TableCell><Badge variant={eventStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingEvent(e); setEventDialogOpen(true); }}><Pencil /> Edit event</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteEvent.mutate(e)}><Trash2 /> Delete event</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scores" className="mt-4">
          {scores.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Criterion</TableHead>
                      <TableHead>Max score</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Evaluated by</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScores.map((s) => (
                      <TableRow key={s.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{s.criterion}</p></TableCell>
                        <TableCell><span className="text-sm font-mono">{s.maxScore}</span></TableCell>
                        <TableCell>
                          <span className="text-sm font-mono font-bold">{s.score}</span>
                          <span className="text-xs text-muted-foreground"> / {s.maxScore}</span>
                        </TableCell>
                        <TableCell><span className="text-sm">{s.evaluatedBy}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{s.remarks ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteScore.mutate(s)}><Trash2 /> Delete score</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-4">
          {offers.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Application</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Stream</TableHead>
                      <TableHead>Valid until</TableHead>
                      <TableHead>Issued on</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.map((o) => (
                      <TableRow key={o.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{o.applicationName}</p></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{o.offerType}</Badge></TableCell>
                        <TableCell><span className="text-sm">{o.offeredGradeName}</span></TableCell>
                        <TableCell><span className="text-sm">{o.offeredStreamName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(o.validUntil)}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(o.issuedOn)}</span></TableCell>
                        <TableCell><Badge variant={offerStatusVariant[o.status] ?? "secondary"} className="capitalize">{o.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setEditingOffer(o); setOfferDialogOpen(true); }}><Pencil /> Edit offer</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteOffer.mutate(o)}><Trash2 /> Delete offer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="acceptances" className="mt-4">
          {acceptances.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Offer</TableHead>
                      <TableHead>Accepted on</TableHead>
                      <TableHead>Accepted by</TableHead>
                      <TableHead>Deposit paid</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAcceptances.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{a.offerName}</p></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(a.acceptedOn)}</span></TableCell>
                        <TableCell><span className="text-sm">{a.acceptedBy}</span></TableCell>
                        <TableCell>{a.depositPaid ? <Badge variant="success">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
                        <TableCell><span className="text-sm font-mono">{a.depositAmount?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[150px] truncate inline-block">{a.remarks ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteAcceptance.mutate(a)}><Trash2 /> Delete acceptance</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <SelectionEventFormDialog open={eventDialogOpen} onOpenChange={setEventDialogOpen} event={editingEvent} />
      <OfferFormDialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen} offer={editingOffer} />
    </div>
  );
}
