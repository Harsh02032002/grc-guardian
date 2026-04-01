import { useState } from "react";
import { masterAssetIdFormats } from "@/data/masterData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Plus, CheckCircle } from "lucide-react";

export default function ConfigAssetIdFormat() {
  const [items, setItems] = useState(masterAssetIdFormats);
  const [activeFormat, setActiveFormat] = useState(2);
  const [showAdd, setShowAdd] = useState(false);
  const [newPrefix, setNewPrefix] = useState("");
  const [newFormat, setNewFormat] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (!newPrefix.trim()) return;
    setItems([...items, { id: items.length + 1, prefix: newPrefix, format: newFormat, example: newExample, description: newDesc }]);
    setNewPrefix(""); setNewFormat(""); setNewExample(""); setNewDesc(""); setShowAdd(false);
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Asset ID Format</h1>
          <p className="page-subtitle">Configure the auto-generated Asset ID format</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="inline-flex items-center gap-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus className="h-4 w-4" /> Add Format
        </button>
      </div>

      {showAdd && (
        <div className="bg-card rounded-lg border shadow-sm p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label>Prefix *</Label><Input value={newPrefix} onChange={e => setNewPrefix(e.target.value)} placeholder="e.g., AST" /></div>
            <div className="space-y-1.5"><Label>Format</Label><Input value={newFormat} onChange={e => setNewFormat(e.target.value)} placeholder="e.g., AST-XXXX" /></div>
            <div className="space-y-1.5"><Label>Example</Label><Input value={newExample} onChange={e => setNewExample(e.target.value)} placeholder="e.g., AST-0001" /></div>
            <div className="space-y-1.5"><Label>Description</Label><Input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-md border text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <table className="data-table">
        <thead><tr><th>#</th><th>Prefix</th><th>Format</th><th>Example</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td className="font-mono text-xs">{idx + 1}</td>
              <td className="font-mono font-medium">{item.prefix}</td>
              <td className="font-mono">{item.format}</td>
              <td className="font-mono text-primary">{item.example}</td>
              <td className="text-muted-foreground text-xs">{item.description}</td>
              <td>
                {activeFormat === item.id ? (
                  <span className="status-badge status-active"><CheckCircle className="h-3 w-3 mr-1" /> Active</span>
                ) : (
                  <button onClick={() => setActiveFormat(item.id)} className="text-xs text-primary hover:underline">Set Active</button>
                )}
              </td>
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

      <div className="bg-card rounded-lg border shadow-sm p-4">
        <h3 className="text-sm font-semibold mb-2">Risk ID Format</h3>
        <p className="text-xs text-muted-foreground mb-3">Auto-generated Risk IDs follow the format:</p>
        <div className="flex gap-4">
          <div className="bg-muted/50 rounded-md px-4 py-2 text-center">
            <p className="text-xs text-muted-foreground">Format</p>
            <p className="font-mono font-bold">R-XXX</p>
          </div>
          <div className="bg-muted/50 rounded-md px-4 py-2 text-center">
            <p className="text-xs text-muted-foreground">Example</p>
            <p className="font-mono font-bold text-primary">R-001</p>
          </div>
        </div>
      </div>
    </div>
  );
}
