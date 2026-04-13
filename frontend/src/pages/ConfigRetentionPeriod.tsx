import { useState } from "react";
import { masterRetentionPeriods } from "@/data/masterData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus } from "lucide-react";

export default function ConfigRetentionPeriod() {
  const [items, setItems] = useState(masterRetentionPeriods);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newRegulation, setNewRegulation] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    setItems([...items, { id: items.length + 1, name: newName, duration: newDuration, regulation: newRegulation, description: newDesc } as any]);
    setNewName(""); setNewDuration(""); setNewRegulation(""); setNewDesc(""); setShowAdd(false);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Retention Period</h1>
          <p className="page-subtitle">Configure document and asset retention periods</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add Period
        </button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-lg border shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Period Name *</Label><Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., 5 Years" /></div>
            <div className="space-y-1.5"><Label>Duration</Label><Input value={newDuration} onChange={e => setNewDuration(e.target.value)} placeholder="e.g., 5 years" /></div>
            <div className="space-y-1.5"><Label>Regulation / Law</Label><Input value={newRegulation} onChange={e => setNewRegulation(e.target.value)} placeholder="e.g., GDPR, SOX" /></div>
            <div className="space-y-1.5"><Label>Description</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead><tr><th>#</th><th>Period Name</th><th>Duration</th><th>Regulation/Law</th><th>Description</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td className="font-mono text-xs">{idx + 1}</td>
              <td className="font-medium">{item.name}</td>
              <td>{item.duration}</td>
              <td className="text-muted-foreground text-xs">{(item as any).regulation || "-"}</td>
              <td className="text-muted-foreground text-xs">{item.description}</td>
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
