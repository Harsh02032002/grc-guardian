import { useState } from "react";
import { useConfig, useCreateConfig, useDeleteConfig } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function AssetCategories() {
  const { data: categories = [], isLoading } = useConfig("asset_category");
  const createConfig = useCreateConfig();
  const deleteConfig = useDeleteConfig();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    createConfig.mutate({ type: "asset_category", name: name.trim(), description }, {
      onSuccess: () => { setShowAdd(false); setName(""); setDescription(""); },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteConfig.mutate(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Asset Categories</h1>
          <p className="page-subtitle">Manage asset classification categories</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat: any, idx: number) => (
            <div key={cat._id} className="stat-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.description || "No description"}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-8">No categories. Click "Add Category" to create one.</div>
          )}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Asset Category</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Category Name *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Hardware" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description" className="text-xs" /></div>
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
