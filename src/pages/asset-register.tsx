import { useMemo, useState } from "react";
import { Landmark, Search, Plus, Tags, TrendingDown, DollarSign, MapPin } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { FixedAssetFormDialog } from "@/pages/fixed-asset-form-dialog";
import { AssetCategoryFormDialog } from "@/pages/asset-category-form-dialog";
import { useFixedAssets, useAssetCategories, useDeleteFixedAsset, useDeleteAssetCategory } from "@/hooks/use-erp";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/utils";
import type { FixedAsset, AssetCategory } from "@/lib/types";

const assetStatusVariant: Record<string, "success" | "destructive" | "info" | "warning"> = {
  active: "success", disposed: "destructive", transferred: "info", under_maintenance: "warning",
};
const depMethodVariant: Record<string, "info" | "warning" | "secondary"> = {
  straight_line: "info", declining_balance: "warning", units_of_production: "secondary",
};

export default function AssetRegister() {
  const assets = useFixedAssets();
  const categories = useAssetCategories();
  const deleteAsset = useDeleteFixedAsset();
  const deleteCategory = useDeleteAssetCategory();
  const [q, setQ] = useState("");
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<FixedAsset | undefined>();
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<AssetCategory | undefined>();

  const filteredAssets = useMemo(() => {
    let list = assets.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((a) => a.name.toLowerCase().includes(s) || a.assetCode.toLowerCase().includes(s) || a.category.toLowerCase().includes(s) || a.location.toLowerCase().includes(s)); }
    return list;
  }, [assets.data, q]);

  const filteredCategories = useMemo(() => {
    let list = categories.data ?? [];
    if (q) { const s = q.toLowerCase(); list = list.filter((c) => c.name.toLowerCase().includes(s) || c.code.toLowerCase().includes(s)); }
    return list;
  }, [categories.data, q]);

  const activeAssets = (assets.data ?? []).filter((a) => a.status === "active").length;
  const totalValue = (assets.data ?? []).reduce((sum, a) => sum + (a.purchaseCost ?? 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Landmark}
        title="Asset Register"
        titleNe="सम्पत्ति"
        microModule="M15.04"
        description="Register and track fixed assets, categories and depreciation parameters."
        actions={
          <div className="flex gap-2">
            <CanCreate resource="fixedAssets">
              <Button variant="outline" onClick={() => { setEditingAsset(undefined); setAssetDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New asset
              </Button>
            </CanCreate>
            <CanCreate resource="assetCategories">
              <Button onClick={() => { setEditingCat(undefined); setCatDialogOpen(true); }}>
                <Plus className="h-4 w-4" /> New category
              </Button>
            </CanCreate>
          </div>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><Landmark className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total assets</p><p className="text-lg font-bold">{assets.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><TrendingDown className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Active</p><p className="text-lg font-bold">{activeAssets}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-violet-100 p-2 text-violet-600"><Tags className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Categories</p><p className="text-lg font-bold">{categories.data?.length ?? 0}</p></div>
        </CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><DollarSign className="h-4 w-4" /></div>
          <div><p className="text-xs text-muted-foreground">Total value</p><p className="text-lg font-bold">NPR {totalValue.toLocaleString()}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search assets, categories…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <Tabs defaultValue="assets">
        <TabsList>
          <TabsTrigger value="assets">Fixed Assets</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="mt-4">
          {assets.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Asset</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead>Cost (NPR)</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Custodian</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssets.map((a) => (
                      <TableRow key={a.id} className="group">
                        <TableCell className="pl-5">
                          <p className="font-medium">{a.name}</p>
                          {a.serialNo && <p className="text-xs text-muted-foreground">S/N: {a.serialNo}</p>}
                        </TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{a.assetCode}</code></TableCell>
                        <TableCell><span className="text-sm">{a.category || "—"}</span></TableCell>
                        <TableCell><span className="text-xs">{fmtDate(a.purchaseDate)}</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{a.purchaseCost?.toLocaleString() ?? "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{a.location || "—"}</span></TableCell>
                        <TableCell><span className="text-sm">{a.custodian || "—"}</span></TableCell>
                        <TableCell><Badge variant={assetStatusVariant[a.status] ?? "secondary"} className="capitalize">{a.status.replace("_", " ")}</Badge></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="fixedAssets" onEdit={() => { setEditingAsset(a); setAssetDialogOpen(true); }} onDelete={() => deleteAsset.mutate(a)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          {categories.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5">Category</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Depreciation Method</TableHead>
                      <TableHead>Default Life</TableHead>
                      <TableHead>GL Account</TableHead>
                      <TableHead className="pr-5" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((c) => (
                      <TableRow key={c.id} className="group">
                        <TableCell className="pl-5"><p className="font-medium">{c.name}</p></TableCell>
                        <TableCell><code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code></TableCell>
                        <TableCell><Badge variant={depMethodVariant[c.depreciationMethod] ?? "secondary"} className="capitalize">{c.depreciationMethod.replace(/_/g, " ")}</Badge></TableCell>
                        <TableCell><span className="text-sm">{c.defaultLife} years</span></TableCell>
                        <TableCell><span className="text-sm font-mono">{c.glAccount || "—"}</span></TableCell>
                        <TableCell className="pr-5 text-right">
                          <RowActionMenu resource="assetCategories" onEdit={() => { setEditingCat(c); setCatDialogOpen(true); }} onDelete={() => deleteCategory.mutate(c)} />
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

      <FixedAssetFormDialog open={assetDialogOpen} onOpenChange={setAssetDialogOpen} editing={editingAsset} />
      <AssetCategoryFormDialog open={catDialogOpen} onOpenChange={setCatDialogOpen} editing={editingCat} />
    </div>
  );
}
