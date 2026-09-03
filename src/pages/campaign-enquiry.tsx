import { useMemo, useState } from "react";
import { Megaphone, Search, Plus, Pencil, Trash2, BarChart3, Zap, MessageSquare, ArrowUpRight } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { CampaignFormDialog } from "@/pages/campaign-form-dialog";
import { EnquiryFormDialog } from "@/pages/enquiry-form-dialog";
import { useCampaigns, useEnquiries, useEnquiryInteractions, useDeleteCampaign, useDeleteEnquiry, useDeleteEnquiryInteraction } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/utils";
import type { Campaign, Enquiry, EnquiryInteraction } from "@/lib/types";

const campaignStatusVariant: Record<string, "success" | "info" | "warning" | "secondary"> = {
  active: "success", draft: "info", paused: "warning", completed: "secondary", archived: "secondary",
};

const enquiryStatusVariant: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  new: "info", contacted: "info", interested: "warning", visit_scheduled: "warning",
  applied: "secondary", converted: "success", lost: "destructive",
};

export default function CampaignEnquiry() {
  const campaigns = useCampaigns();
  const enquiries = useEnquiries();
  const interactions = useEnquiryInteractions();
  const deleteCampaign = useDeleteCampaign();
  const deleteEnquiry = useDeleteEnquiry();
  const deleteInteraction = useDeleteEnquiryInteraction();
  const [q, setQ] = useState("");
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>();
  const [enquiryDialogOpen, setEnquiryDialogOpen] = useState(false);
  const [editingEnquiry, setEditingEnquiry] = useState<Enquiry | undefined>();

  const filteredCampaigns = useMemo(() => {
    let list = campaigns.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)); }
    return list;
  }, [campaigns.data, q]);

  const filteredEnquiries = useMemo(() => {
    let list = enquiries.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((e) => e.studentName.toLowerCase().includes(s) || e.guardianName.toLowerCase().includes(s) || e.guardianPhone.includes(s)); }
    return list;
  }, [enquiries.data, q]);

  const filteredInteractions = useMemo(() => {
    let list = interactions.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.enquiryName.toLowerCase().includes(s) || i.notes.toLowerCase().includes(s)); }
    return list;
  }, [interactions.data, q]);

  const activeCampaigns = (campaigns.data ?? []).filter((c) => c.status === "active").length;
  const convertedEnquiries = (enquiries.data ?? []).filter((e) => e.status === "converted").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Megaphone}
        title="Campaigns & Enquiries"
        titleNe="अभियान तथा सोधबुझ"
        microModule="M04.01 + M04.02"
        description="Manage marketing campaigns, capture student enquiries, and track counselling follow-ups."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="campaigns">
              <Button variant="outline" onClick={() => { setEditingCampaign(undefined); setCampaignDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New campaign
              </Button>
            </CanCreate>
            <CanCreate resource="campaigns">
              <Button onClick={() => { setEditingEnquiry(undefined); setEnquiryDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New enquiry
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Megaphone className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total campaigns</p><p className="text-lg font-bold">{campaigns.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><Zap className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active campaigns</p><p className="text-lg font-bold">{activeCampaigns}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><MessageSquare className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total enquiries</p><p className="text-lg font-bold">{enquiries.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><ArrowUpRight className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Converted</p><p className="text-lg font-bold">{convertedEnquiries}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search campaigns, enquiries…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="mt-4">
          {campaigns.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Campaign</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Enquiries</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.name}</p>
                          {c.nameNe && <p className="text-xs text-muted-foreground">{c.nameNe}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{c.channel.replace("_", " ")}</Badge></TableCell>
                        <TableCell>
                          <p className="text-xs">{fmtDate(c.startDate)}</p>
                          <p className="text-xs text-muted-foreground">→ {fmtDate(c.endDate)}</p>
                        </TableCell>
                        <TableCell><span className="text-sm font-mono">{c.budget?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell>
                          <span className="text-sm">{c.actualEnquiries}</span>
                          <span className="text-xs text-muted-foreground"> / {c.targetEnquiries}</span>
                        </TableCell>
                        <TableCell><Badge variant={campaignStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="campaigns" onEdit={() => { setEditingCampaign(c); setCampaignDialogOpen(true); }} onDelete={() => deleteCampaign.mutate(c)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="enquiries" className="mt-4">
          {enquiries.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Guardian</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned to</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnquiries.map((e) => (
                      <TableRow key={e.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{e.studentName}</p>
                          {e.studentNameNe && <p className="text-xs text-muted-foreground">{e.studentNameNe}</p>}
                        </TableCell>
                        <TableCell><span className="text-sm">{e.guardianName}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{e.guardianPhone}</span></TableCell>
                        <TableCell><Badge variant="secondary">{e.interestedGradeName}</Badge></TableCell>
                        <TableCell><span className="text-sm capitalize">{e.source.replace("_", " ")}</span></TableCell>
                        <TableCell><Badge variant={enquiryStatusVariant[e.status] ?? "secondary"} className="capitalize">{e.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{e.assignedToName ?? "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(e.createdOn)}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="campaigns" onEdit={() => { setEditingEnquiry(e); setEnquiryDialogOpen(true); }} onDelete={() => deleteEnquiry.mutate(e)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="followups" className="mt-4">
          {interactions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Enquiry</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Performed by</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Next action</TableHead>
                      <TableHead>Outcome</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInteractions.map((i) => (
                      <TableRow key={i.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{i.enquiryName}</p></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{i.type.replace("_", " ")}</Badge></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(i.occurredAt)}</span></TableCell>
                        <TableCell><span className="text-sm">{i.performedByName}</span></TableCell>
                        <TableCell><span className="text-sm max-w-[200px] truncate inline-block">{i.notes}</span></TableCell>
                        <TableCell><span className="text-sm">{i.nextAction ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{i.outcome ?? "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:opacity-100">⋯</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteInteraction.mutate(i)}><Trash2 /> Delete interaction</DropdownMenuItem>
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

      <CampaignFormDialog open={campaignDialogOpen} onOpenChange={setCampaignDialogOpen} campaign={editingCampaign} />
      <EnquiryFormDialog open={enquiryDialogOpen} onOpenChange={setEnquiryDialogOpen} enquiry={editingEnquiry} />
    </div>
  );
}
