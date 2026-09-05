import { useMemo, useState } from "react";
import { Package, Search, Plus, Store as StoreIcon, BarChart3, AlertTriangle, TrendingDown } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { ItemFormDialog } from "@/pages/item-form-dialog";
import { StoreFormDialog } from "@/pages/store-form-dialog";
import { useItems, useStores, useDeleteItem, useDeleteStore } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { Item, Store } from "@/lib/types";

const itemStatusVariant: Record<string, "success" | "secondary" | "destructive"> = {
  active: "success", inactive: "secondary", discontinued: "destructive",
};
const storeStatusVariant: Record<string, "success" | "secondary"> = {
  active: "success", inactive: "secondary",
};

export default function ItemStoreMaster() {
  const items = useItems();
  const stores = useStores();
  const deleteItem = useDeleteItem();
  const deleteStore = useDeleteStore();
  const [q, setQ] = useState("");
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [storeDialogOpen, setStoreDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | undefined>();

  const filteredItems = useMemo(() => {
    let list = items.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((i) => i.name.toLowerCase().includes(s) || i.code.toLowerCase().includes(s) || i.category.toLowerCase().includes(s)); }
    return list;
  }, [items.data, q]);

  const filteredStores = useMemo(() => {
    let list = stores.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((st) => st.name.toLowerCase().includes(s) || st.code.toLowerCase().includes(s) || st.location.toLowerCase().includes(s)); }
    return list;
  }, [stores.data, q]);

  const activeItems = (items.data ?? []).filter((i) => i.status === "active").length;
  const activeStores = (stores.data ?? []).filter((s) => s.status === "active").length;
  const lowStockItems = (items.data ?? []).filter((i) => i.reorderLevel > 0).length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Package}
        title="Item & Store Master"
        titleNe="वस्तु र भण्डार"
        microModule="M15.01"
        description="Manage inventory items with stock thresholds and store locations."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="items">
              <Button variant="outline" onClick={() => { setEditingItem(undefined); setItemDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New item
              </Button>
            </CanCreate>
            <CanCreate resource="storesM15">
              <Button onClick={() => { setEditingStore(undefined); setStoreDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New store
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Package className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total items</p><p className="text-lg font-bold">{items.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingDown className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active items</p><p className="text-lg font-bold">{activeItems}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><StoreIcon className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total stores</p><p className="text-lg font-bold">{stores.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><AlertTriangle className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">With reorder level</p><p className="text-lg font-bold">{lowStockItems}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search items, stores…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          {items.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Item</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Unit Cost</TableHead>
                      <TableHead>Reorder Lvl</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((i) => (
                      <TableRow key={i.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{i.name}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{i.code}</code></TableCell>
                        <TableCell><span className="text-sm">{i.category || "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{i.unit || "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{i.unitCost?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{i.reorderLevel}</span></TableCell>
                        <TableCell><Badge variant={itemStatusVariant[i.status] ?? "secondary"} className="capitalize">{i.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="items" onEdit={() => { setEditingItem(i); setItemDialogOpen(true); }} onDelete={() => deleteItem.mutate(i)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stores" className="mt-4">
          {stores.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Store</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStores.map((s) => (
                      <TableRow key={s.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{s.name}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{s.code}</code></TableCell>
                        <TableCell><span className="text-sm">{s.location || "—"}</span></TableCell>
                        <TableCell><Badge variant="secondary" className="capitalize">{s.type}</Badge></TableCell>
                        <TableCell><span className="text-sm">{s.manager || "—"}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{s.capacity}</span></TableCell>
                        <TableCell><Badge variant={storeStatusVariant[s.status] ?? "secondary"} className="capitalize">{s.status}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="storesM15" onEdit={() => { setEditingStore(s); setStoreDialogOpen(true); }} onDelete={() => deleteStore.mutate(s)} />
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

      <ItemFormDialog open={itemDialogOpen} onOpenChange={setItemDialogOpen} editing={editingItem} />
      <StoreFormDialog open={storeDialogOpen} onOpenChange={setStoreDialogOpen} editing={editingStore} />
    </div>
  );
}
