import { useMemo, useState } from "react";
import { MessageSquare, Search, Plus } from "lucide-react";
import { PageHeader, LoadingBlock } from "@/components/page-header";
import { DiscussionFormDialog } from "@/pages/discussion-form-dialog";
import { DiscussionPostFormDialog } from "@/pages/discussion-post-form-dialog";
import { useDiscussions, useDiscussionPosts, useDeleteDiscussion, useDeleteDiscussionPost } from "@/hooks/use-erp";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CanCreate } from "@/components/permission-gate";
import { RowActionMenu } from "@/components/row-action-menu";
import { fmtDate } from "@/lib/utils";
import type { Discussion, DiscussionPost } from "@/lib/types";

const discussionStatusVariant: Record<string, "success" | "warning" | "info"> = {
  open: "success", closed: "warning", pinned: "info",
};

export default function DiscussionsCollaborationPage() {
  const discussions = useDiscussions();
  const posts = useDiscussionPosts();
  const deleteDiscussion = useDeleteDiscussion();
  const deletePost = useDeleteDiscussionPost();
  const [q, setQ] = useState("");
  const [discOpen, setDiscOpen] = useState(false);
  const [editingDisc, setEditingDisc] = useState<Discussion | undefined>();
  const [postOpen, setPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<DiscussionPost | undefined>();

  const filteredDiscussions = useMemo(() => {
    const list = discussions.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((d: Discussion) => d.title.toLowerCase().includes(s) || d.authorName.toLowerCase().includes(s));
  }, [discussions.data, q]);

  const filteredPosts = useMemo(() => {
    const list = posts.data ?? [];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((p: DiscussionPost) => p.authorName.toLowerCase().includes(s) || p.content.toLowerCase().includes(s));
  }, [posts.data, q]);

  const openCount = (discussions.data ?? []).filter((d) => d.status === "open").length;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={MessageSquare}
        title="Discussion & Collaboration"
        titleNe="छलफल"
        microModule="M10.05"
        description="Course discussion threads and collaborative posts."
        actions={<div className="flex gap-2"><CanCreate resource="discussions"><Button variant="outline" onClick={() => { setEditingDisc(undefined); setDiscOpen(true); }}><Plus className="h-4 w-4" /> New Discussion</Button></CanCreate><CanCreate resource="discussions"><Button onClick={() => { setEditingPost(undefined); setPostOpen(true); }}><Plus className="h-4 w-4" /> New Post</Button></CanCreate></div>}
      />
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-blue-100 p-2 text-blue-600"><MessageSquare className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Discussions</p><p className="text-lg font-bold">{discussions.data?.length ?? 0}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-emerald-100 p-2 text-emerald-600"><MessageSquare className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Open</p><p className="text-lg font-bold">{openCount}</p></div></CardContent></Card>
        <Card className="animate-fade-up"><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-violet-100 p-2 text-violet-600"><MessageSquare className="h-4 w-4" /></div><div><p className="text-xs text-muted-foreground">Total Posts</p><p className="text-lg font-bold">{posts.data?.length ?? 0}</p></div></CardContent></Card>
      </div>
      <div className="flex items-center gap-3"><div className="relative w-full sm:max-w-xs"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search discussions or posts…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>

      <Tabs defaultValue="discussions">
        <TabsList><TabsTrigger value="discussions">Discussions</TabsTrigger><TabsTrigger value="posts">Posts</TabsTrigger></TabsList>

        <TabsContent value="discussions" className="mt-4">
          {discussions.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Title</TableHead><TableHead>Author</TableHead><TableHead>Posts</TableHead><TableHead>Last Post</TableHead><TableHead>Status</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredDiscussions.map((d) => (
              <TableRow key={d.id} className="group">
                <TableCell className="pl-5 font-medium">{d.title}</TableCell>
                <TableCell className="text-sm">{d.authorName}</TableCell>
                <TableCell><span className="text-sm font-mono">{d.postCount}</span></TableCell>
                <TableCell className="text-sm">{fmtDate(d.lastPostOn)}</TableCell>
                <TableCell><Badge variant={discussionStatusVariant[d.status] ?? "secondary"} className="capitalize">{d.status}</Badge></TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="discussions" onEdit={() => { setEditingDisc(d); setDiscOpen(true); }} onDelete={() => deleteDiscussion.mutate(d)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="posts" className="mt-4">
          {posts.isLoading ? <LoadingBlock /> : (
            <Card className="animate-fade-up"><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead className="pl-5">Author</TableHead><TableHead>Content</TableHead><TableHead>Discussion</TableHead><TableHead>Created</TableHead><TableHead className="pr-5" /></TableRow></TableHeader><TableBody>{filteredPosts.map((p) => (
              <TableRow key={p.id} className="group">
                <TableCell className="pl-5 font-medium">{p.authorName}</TableCell>
                <TableCell className="text-sm max-w-[300px] truncate">{p.content}</TableCell>
                <TableCell><Badge variant="secondary">{p.discussionRef}</Badge></TableCell>
                <TableCell className="text-sm">{fmtDate(p.createdOn)}</TableCell>
                <TableCell className="pr-5 text-right"><RowActionMenu resource="discussions" onEdit={() => { setEditingPost(p); setPostOpen(true); }} onDelete={() => deletePost.mutate(p)} /></TableCell>
              </TableRow>
            ))}</TableBody></Table></CardContent></Card>
          )}
        </TabsContent>
      </Tabs>

      <DiscussionFormDialog open={discOpen} onOpenChange={setDiscOpen} editing={editingDisc} />
      <DiscussionPostFormDialog open={postOpen} onOpenChange={setPostOpen} editing={editingPost} />
    </div>
  );
}
