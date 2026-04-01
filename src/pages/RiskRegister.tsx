import { risks } from "@/data/mockData";
import { Eye, Edit, Trash2 } from "lucide-react";

const getRIRColor = (rir: number) => {
  if (rir >= 16) return "status-inactive";
  if (rir >= 9) return "status-pending";
  return "status-active";
};

export default function RiskRegister() {
  const today = new Date().toISOString().split("T")[0];

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
              <th>Date</th>
              <th>S.No.</th>
              <th>Control Ref</th>
              <th>Risk ID</th>
              <th>Risk Name</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Asset</th>
              <th>Asset Type</th>
              <th>C</th>
              <th>I</th>
              <th>A</th>
              <th>AV</th>
              <th>Threat</th>
              <th>T-Val</th>
              <th>Vuln</th>
              <th>V-Val</th>
              <th>TV</th>
              <th>TVP</th>
              <th>PoA</th>
              <th>Abs RIR</th>
              <th>PC CV</th>
              <th>PC CR</th>
              <th>CC CV</th>
              <th>CC CR</th>
              <th>RRIR</th>
              <th>Priority</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r, idx) => (
              <tr key={r.id}>
                <td className="text-xs whitespace-nowrap">{today}</td>
                <td className="font-mono text-xs">{idx + 1}</td>
                <td className="font-mono text-xs">A5.30</td>
                <td className="font-mono text-xs">{r.id}</td>
                <td className="font-medium text-xs">{r.name}</td>
                <td className="text-xs">{r.category}</td>
                <td className="text-xs">{r.subcategory}</td>
                <td className="text-xs">{r.asset}</td>
                <td className="text-xs">Tangible</td>
                <td className="text-xs">3</td>
                <td className="text-xs">3</td>
                <td className="text-xs">3</td>
                <td className="text-xs font-semibold">3</td>
                <td className="text-xs">{r.threat}</td>
                <td className="text-xs">{r.likelihood}</td>
                <td className="text-xs">{r.vulnerability}</td>
                <td className="text-xs">{r.impact}</td>
                <td className="text-xs">{r.likelihood + r.impact}</td>
                <td className="text-xs">2</td>
                <td className="text-xs">2</td>
                <td className="text-xs"><span className={`status-badge ${getRIRColor(r.rir)}`}>{r.rir}</span></td>
                <td className="text-xs">4</td>
                <td className="text-xs">B</td>
                <td className="text-xs">2</td>
                <td className="text-xs">D</td>
                <td><span className={`status-badge ${getRIRColor(Math.round(r.rir / 2))}`}>{Math.round(r.rir / 2)}</span></td>
                <td>
                  <span className={`status-badge ${r.rir >= 16 ? "status-inactive" : r.rir >= 9 ? "status-pending" : "status-active"}`}>
                    {r.rir >= 16 ? "Critical" : r.rir >= 9 ? "High" : r.rir >= 4 ? "Medium" : "Low"}
                  </span>
                </td>
                <td className="text-xs">{r.owner}</td>
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
