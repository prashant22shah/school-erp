import { useMemo, useState } from "react";
import { Building2, Search, Plus, BedDouble, BarChart3 } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ResidenceBlockFormDialog } from "@/pages/residence-block-form-dialog";
import { RoomTypeFormDialog } from "@/pages/room-type-form-dialog";
import { useResidenceBlocks, useRoomTypes, useDeleteResidenceBlock, useDeleteRoomType } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { ResidenceBlock, RoomType } from "@/lib/types";

const blockStatusVariant: Record<string, "success" | "warning" | "secondary"> = {
  active: "success", under_maintenance: "warning", closed: "secondary",
};
const roomStatusVariant: Record<string, "success" | "secondary"> = {
  active: "success", inactive: "secondary",
};

export default function ResidenceInventory() {
  const blocks = useResidenceBlocks();
  const roomTypes = useRoomTypes();
  const deleteBlock = useDeleteResidenceBlock();
  const deleteRoomType = useDeleteRoomType();
  const [q, setQ] = useState("");
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ResidenceBlock | undefined>();
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomType | undefined>();

  const filteredBlocks = useMemo(() => {
    let list = blocks.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((b) => b.name.toLowerCase().includes(s) || b.code.toLowerCase().includes(s) || b.warden.toLowerCase().includes(s)); }
    return list;
  }, [blocks.data, q]);

  const filteredRoomTypes = useMemo(() => {
    let list = roomTypes.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((r) => r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s) || r.amenities.toLowerCase().includes(s)); }
    return list;
  }, [roomTypes.data, q]);

  const totalBlocks = blocks.data?.length ?? 0;
  const totalBeds = (blocks.data ?? []).reduce((sum, b) => sum + b.totalBeds, 0);
  const occupiedBeds = (blocks.data ?? []).reduce((sum, b) => sum + b.occupiedBeds, 0);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Building2}
        title="Residence Inventory"
        titleNe="निवास"
        microModule="M18.01"
        description="Manage residence blocks, room types, bed capacity, and warden assignments."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="residenceBlocks">
              <Button variant="outline" onClick={() => { setEditingBlock(undefined); setBlockDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New block
              </Button>
            </CanCreate>
            <CanCreate resource="residenceBlocks">
              <Button onClick={() => { setEditingRoom(undefined); setRoomDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New room type
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Building2 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total blocks</p><p className="text-lg font-bold">{totalBlocks}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><BedDouble className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total beds</p><p className="text-lg font-bold">{totalBeds}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><BarChart3 className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Occupancy rate</p><p className="text-lg font-bold">{occupancyRate}%</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search blocks, room types…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="blocks">
        <TabsList>
          <TabsTrigger value="blocks">Residence Blocks</TabsTrigger>
          <TabsTrigger value="roomtypes">Room Types</TabsTrigger>
        </TabsList>

        <TabsContent value="blocks" className="mt-4">
          {blocks.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Block</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Floors</TableHead>
                      <TableHead>Rooms</TableHead>
                      <TableHead>Beds</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Warden</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlocks.map((b) => (
                      <TableRow key={b.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{b.name}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{b.code}</code></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{b.type}</Badge></TableCell>
                        <TableCell><span className="text-sm">{b.floors}</span></TableCell>
                        <TableCell><span className="text-sm">{b.totalRooms}</span></TableCell>
                        <TableCell><span className="text-sm">{b.totalBeds}</span></TableCell>
                        <TableCell><span className="text-sm">{b.occupiedBeds}</span></TableCell>
                        <TableCell><span className="text-sm">{b.warden || "—"}</span></TableCell>
                        <TableCell><Badge variant={blockStatusVariant[b.status] ?? "secondary"} className="capitalize">{b.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingBlock(b); setBlockDialogOpen(true); }} onDelete={() => deleteBlock.mutate(b)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="roomtypes" className="mt-4">
          {roomTypes.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Room Type</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Beds</TableHead>
                      <TableHead>Amenities</TableHead>
                      <TableHead>Fee/Month</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoomTypes.map((r) => (
                      <TableRow key={r.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{r.name}</p>
                          {r.description && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{r.description}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{r.code}</code></TableCell>
                        <TableCell><span className="text-sm">{r.bedCount}</span></TableCell>
                        <TableCell><span className="text-sm truncate max-w-[200px] inline-block">{r.amenities}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{r.feePerMonth?.toLocaleString()}</span></TableCell>
                        <TableCell><Badge variant={roomStatusVariant[r.status] ?? "secondary"} className="capitalize">{r.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="residenceBlocks" onEdit={() => { setEditingRoom(r); setRoomDialogOpen(true); }} onDelete={() => deleteRoomType.mutate(r)} />
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

      <ResidenceBlockFormDialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen} editing={editingBlock} />
      <RoomTypeFormDialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen} editing={editingRoom} />
    </div>
  );
}
