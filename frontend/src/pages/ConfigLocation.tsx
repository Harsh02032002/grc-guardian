import { useState } from "react";
import { masterLocations } from "@/data/masterData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, MapPin } from "lucide-react";

export default function ConfigLocation() {
  const [items, setItems] = useState(masterLocations);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newItem = { id: items.length + 1, name: newName, address: newAddress, isPrimary } as any;
    if (isPrimary) {
      setItems([newItem, ...items.map((i: any) => ({ ...i, isPrimary: false }))]);
    } else {
      setItems([...items, newItem]);
    }
    setNewName(""); setNewAddress(""); setIsPrimary(false); setShowAdd(false);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Locations</h1>
          <p className="page-subtitle">Manage physical and cloud locations for assets</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add Location
        </button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-lg border shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Location Name *</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Cloud (GCP)" /></div>
            <div className="space-y-1.5"><Label>Address / Details</Label><Input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="e.g., Building 5, Floor 2" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" checked={isPrimary} onChange={e => setIsPrimary(e.target.checked)} className="rounded" /><Label className="text-xs">Set as Primary Location</Label></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead><tr><th>#</th><th>Location Name</th><th>Address / Details</th><th>Primary</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td className="font-mono text-xs">{idx + 1}</td>
              <td className="font-medium"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{item.name} {(item as any).isPrimary && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Primary</span>}</span></td>
              <td className="text-muted-foreground text-xs">{item.address}</td>
              <td className="text-center">{(item as any).isPrimary ? "★" : ""}</td>
              <td>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
