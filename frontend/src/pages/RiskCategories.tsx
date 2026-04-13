import { useState } from "react";
import { useConfig, useCreateConfig, useDeleteConfig } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function RiskCategories() {
  const { data: categories = [], isLoading } = useConfig("risk_category");
  const createConfig = useCreateConfig();
  const deleteConfig = useDeleteConfig();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [sourceComment, setSourceComment] = useState("");

  const handleAdd = () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    createConfig.mutate({ type: "risk_category", name: name.trim(), description, metadata: { submittedBy, sourceComment } }, {
      onSuccess: () => { setShowAdd(false); setName(""); setDescription(""); setSubmittedBy(""); setSourceComment(""); },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteConfig.mutate(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Categories</h1>
          <p className="page-subtitle">Manage risk classification categories</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Category Name</th><th>Description</th><th>Submitted By</th><th>Source Comment</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map((c: any, i: number) => (
              <tr key={c._id}>
                <td>{i + 1}</td>
                <td className="font-medium">{c.name}</td>
                <td className="text-muted-foreground">{c.description || "-"}</td>
                <td className="text-xs">{c.metadata?.submittedBy || "-"}</td>
                <td className="text-xs">{c.metadata?.sourceComment || "-"}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No categories. Click "Add Category" to create one.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Risk Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Category Name *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Operational" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Submitted By</Label><Input value={submittedBy} onChange={e => setSubmittedBy(e.target.value)} placeholder="Name of person who submitted" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Source Comment</Label><Input value={sourceComment} onChange={e => setSourceComment(e.target.value)} placeholder="Information about source of risk category" className="text-xs" /></div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition">Cancel</button>
            <button onClick={handleAdd} disabled={createConfig.isPending} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
              {createConfig.isPending ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
