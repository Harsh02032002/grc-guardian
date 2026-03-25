import { risks } from "@/data/mockData";
import { Eye, Edit, Trash2 } from "lucide-react";

const getRIRColor = (rir: number) => {
  if (rir >= 16) return "status-inactive";
  if (rir >= 9) return "status-pending";
  return "status-active";
};

export default function RiskRegister() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Register</h1>
          <p className="page-subtitle">Comprehensive risk inventory and assessment</p>
        </div>
        <a href="/risks/add" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          + Add Risk
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Risk Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Asset</th>
              <th>Threat</th>
              <th>Vulnerability</th>
              <th>Likelihood</th>
              <th>Impact</th>
              <th>RIR</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs">{r.id}</td>
                <td className="font-medium">{r.name}</td>
                <td>{r.category}</td>
                <td>{r.subcategory}</td>
                <td>{r.asset}</td>
                <td className="text-xs">{r.threat}</td>
                <td className="text-xs">{r.vulnerability}</td>
                <td className="text-center">{r.likelihood}</td>
                <td className="text-center">{r.impact}</td>
                <td><span className={`status-badge ${getRIRColor(r.rir)}`}>{r.rir}</span></td>
                <td>{r.owner}</td>
                <td>
                  <span className={`status-badge ${r.status === "Open" ? "status-inactive" : r.status === "Mitigating" ? "status-pending" : "status-active"}`}>
                    {r.status}
                  </span>
                </td>
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
