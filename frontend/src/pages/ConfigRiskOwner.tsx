import { useState } from "react";
import { useConfig, useCreateConfig, useDeleteConfig } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function ConfigRiskOwner() {
  const { data: owners = [], isLoading } = useConfig("risk_owner");
  const createConfig = useCreateConfig();
  const deleteConfig = useDeleteConfig();

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name.trim()) { toast({ title: "Name is required", variant: "destructive" }); return; }
    createConfig.mutate({
      type: "risk_owner",
      name: name.trim(),
      description,
      metadata: { email, phone, department },
    }, {
      onSuccess: () => {
        setShowAdd(false);
        setName(""); setDescription(""); setDepartment(""); setEmail(""); setPhone("");
      },
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) deleteConfig.mutate(id);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Owners</h1>
          <p className="page-subtitle">Manage risk owner master list</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Risk Owner
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Role / Description</th><th>Department</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {owners.map((o: any, i: number) => (
              <tr key={o._id}>
                <td>{i + 1}</td>
                <td className="font-medium">{o.name}</td>
                <td className="text-muted-foreground">{o.description}</td>
                <td className="text-xs">{o.metadata?.department || "-"}</td>
                <td className="text-xs">{o.metadata?.email || "-"}</td>
                <td className="text-xs">{o.metadata?.phone || "-"}</td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button onClick={() => handleDelete(o._id)} className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {owners.length === 0 && (
              <tr><td colSpan={7} className="text-center text-muted-foreground py-8">No risk owners configured. Click "Add Risk Owner" to get started.</td></tr>
            )}
          </tbody>
        </table>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Risk Owner</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5"><Label className="text-xs">Name *</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Role / Description</Label><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., IT Manager" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Department</Label><Input value={department} onChange={e => setDepartment(e.target.value)} placeholder="e.g., IT Department" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@company.com" className="text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91-XXXXXXXXXX" className="text-xs" /></div>
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
