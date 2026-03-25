import { controls } from "@/data/mockData";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function ControlsRegister() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Controls Register</h1>
          <p className="page-subtitle">Organizational control inventory</p>
        </div>
        <a href="/controls/add" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">+ Add Control</a>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Control Name</th><th>Type</th><th>Nature</th><th>Parameter</th><th>Effectiveness</th><th>Value</th><th>Ranking</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {controls.map(c => (
              <tr key={c.id}>
                <td className="font-mono text-xs">{c.id}</td>
                <td className="font-medium">{c.name}</td>
                <td><span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{c.type}</span></td>
                <td>{c.nature}</td>
                <td>{c.parameter}</td>
                <td><span className={`status-badge ${c.effectiveness === "High" ? "status-active" : "status-pending"}`}>{c.effectiveness}</span></td>
                <td className="font-semibold">{c.value}</td>
                <td><span className="font-mono font-bold text-primary">{c.ranking}</span></td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
