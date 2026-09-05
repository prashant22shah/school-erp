import { useMemo, useState } from "react";
import { BadgeCheck, Search, Plus, CheckCircle2, XCircle } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { IdentityCardFormDialog } from "@/pages/identity-card-form-dialog";
import { useIdentityCards, useDeleteIdentityCard } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { IdentityCard } from "@/lib/types";

const cardStatusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  active: "success", lost: "warning", expired: "destructive", replaced: "secondary",
};

export default function IdCardCampusIdentity() {
  const identityCards = useIdentityCards();
  const deleteIdentityCard = useDeleteIdentityCard();
  const [q, setQ] = useState("");
  const [cardDialogOpen, setCardDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<IdentityCard | undefined>();

  const filteredCards = useMemo(() => {
    let list = identityCards.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.studentName.toLowerCase().includes(s) || c.serial.toLowerCase().includes(s) || c.cardType.toLowerCase().includes(s)); }
    return list;
  }, [identityCards.data, q]);

  const totalCards = identityCards.data?.length ?? 0;
  const activeCards = (identityCards.data ?? []).filter((c) => c.status === "active").length;
  const expiredCards = (identityCards.data ?? []).filter((c) => c.status === "expired").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={BadgeCheck}
        title="ID Card & Campus Identity"
        titleNe="परिचयपत्र"
        microModule="M05.08"
        description="Issue and manage campus identity cards for students."
        actions={
          <CanCreate resource="identityCards">
            <Button onClick={() => { setEditingCard(undefined); setCardDialogOpen(true); }}>
              <Plus className="h-4 w-4" /> New card
            </Button>
          </CanCreate>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><BadgeCheck className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total cards</p><p className="text-lg font-bold">{totalCards}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><CheckCircle2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeCards}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-destructive/10 p-2 text-destructive"><XCircle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Expired</p><p className="text-lg font-bold">{expiredCards}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cards…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="cards">
        <TabsList>
          <TabsTrigger value="cards">Identity Cards</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-4">
          {identityCards.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Student</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Serial</TableHead>
                      <TableHead>Issued on</TableHead>
                      <TableHead>Valid until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{c.studentName}</p>
                        </TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{c.cardType.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.serial}</code></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.issuedOn)}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(c.validUntil)}</span></TableCell>
                        <TableCell><Badge variant={cardStatusVariant[c.status] ?? "secondary"} className="capitalize">{c.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="identityCards" onEdit={() => { setEditingCard(c); setCardDialogOpen(true); }} onDelete={() => deleteIdentityCard.mutate(c)} />
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

      <IdentityCardFormDialog open={cardDialogOpen} onOpenChange={setCardDialogOpen} card={editingCard} />
    </div>
  );
}
