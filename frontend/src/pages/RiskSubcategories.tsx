import { useState } from "react";
import { useConfig, useCreateConfig, useDeleteConfig } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function RiskSubcategories() {
  const { data: subcategories = [], isLoading } = useConfig("risk_subcategory");
  const { data: categories = [] } = useConfig("risk_category");
  const createConfig = useCreateConfig();
  const deleteConfig = useDeleteConfig();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentCategory, setParentCategory] = useState("");

  const handleAdd = () => {
    if (!name.trim() || !parentCategory) { toast({ title: "Name and parent category are required", variant: "destructive" }); return; }
    createConfig.mutate({
      type: "risk_subcategory",
      name: name.trim(),
      description,
      metadata: { parent: parentCategory },
    }, {
      onSuccess: () => { setShowAdd(false); setName(""); setDescription(""); setParentCategory(""); },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteConfig.mutate(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Subcategories</h1>
          <p className="page-subtitle">Manage risk subcategories linked to parent categories</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Subcategory
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Subcategory</th><th>Parent Category</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {subcategories.map((s: any, i: number) => (
              <tr key={s._id}>
                <td>{i + 1}</td>
                <td className="font-medium">{s.name}</td>
                <td><span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s.metadata?.parent || "-"}</span></td>
                <td className="text-muted-foreground">{s.description || "-"}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {subcategories.length === 0 && (
              <tr><td colSpan={5} className="text-center text-muted-foreground py-8">No subcategories. Click "Add Subcategory" to create one.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Risk Subcategory</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Parent Category *</Label>
              <Select value={parentCategory} onValueChange={setParentCategory}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Select parent category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Subcategory Name *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Data Breach" className="text-xs" /></div>
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
