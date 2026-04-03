import { useRisks, useDeleteRisk } from "@/hooks/useApi";
import { Eye, Edit, Trash2 } from "lucide-react";

const getRIRColor = (rir: number) => {
  if (rir >= 16) return "status-inactive";
  if (rir >= 9) return "status-pending";
  return "status-active";
};

export default function RiskRegister() {
  const { data: risks = [], isLoading } = useRisks();
  const deleteRisk = useDeleteRisk();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this risk?")) deleteRisk.mutate(id);
  };

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

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading risks...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>S.No.</th><th>Control Ref</th><th>Risk ID</th><th>Risk Name</th>
                <th>Category</th><th>Subcategory</th><th>Asset</th><th>Asset Type</th>
                <th>C</th><th>I</th><th>A</th><th>AV</th>
                <th>Threat</th><th>T-Val</th><th>Vuln</th><th>V-Val</th><th>TV</th><th>TVP</th><th>PoA</th>
                <th>Abs RIR</th><th>PC CV</th><th>PC CR</th><th>CC CV</th><th>CC CR</th>
                <th>RRIR</th><th>Priority</th><th>Owner</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {risks.length === 0 ? (
                <tr><td colSpan={30} className="text-center text-muted-foreground py-8">No risks found. Click "+ Add Risk" to create one.</td></tr>
              ) : risks.map((r: any, idx: number) => (
                <tr key={r._id || idx}>
                  <td className="text-xs whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "-"}</td>
                  <td className="font-mono text-xs">{idx + 1}</td>
                  <td className="font-mono text-xs">{r.controlReference || "-"}</td>
                  <td className="font-mono text-xs">{r.riskId || r._id?.slice(-4) || "-"}</td>
                  <td className="font-medium text-xs">{r.name}</td>
                  <td className="text-xs">{r.category || "-"}</td>
                  <td className="text-xs">{r.subcategory || "-"}</td>
                  <td className="text-xs">{r.assetName || "-"}</td>
                  <td className="text-xs">{r.assetType || "-"}</td>
                  <td className="text-xs">{r.c ?? "-"}</td>
                  <td className="text-xs">{r.i ?? "-"}</td>
                  <td className="text-xs">{r.a ?? "-"}</td>
                  <td className="text-xs font-semibold">{r.assetValue ?? "-"}</td>
                  <td className="text-xs">{r.threat || "-"}</td>
                  <td className="text-xs">{r.tValue ?? "-"}</td>
                  <td className="text-xs">{r.vulnerability || "-"}</td>
                  <td className="text-xs">{r.vValue ?? "-"}</td>
                  <td className="text-xs">{r.tvValue ?? "-"}</td>
                  <td className="text-xs">{r.tvPair ?? "-"}</td>
                  <td className="text-xs">{r.probability ?? "-"}</td>
                  <td className="text-xs"><span className={`status-badge ${getRIRColor(r.absoluteRIR || 0)}`}>{r.absoluteRIR ?? "-"}</span></td>
                  <td className="text-xs">{r.primaryControl?.controlValue ?? "-"}</td>
                  <td className="text-xs">{r.primaryControl?.controlRanking ?? "-"}</td>
                  <td className="text-xs">{r.compensatoryControl?.controlValue ?? "-"}</td>
                  <td className="text-xs">{r.compensatoryControl?.controlRanking ?? "-"}</td>
                  <td><span className={`status-badge ${getRIRColor(r.revisedRIR || 0)}`}>{r.revisedRIR ?? "-"}</span></td>
                  <td>
                    <span className={`status-badge ${(r.riskPriority === "Critical" || r.revisedRIR >= 16) ? "status-inactive" : (r.riskPriority === "High" || r.revisedRIR >= 9) ? "status-pending" : "status-active"}`}>
                      {r.riskPriority || "-"}
                    </span>
                  </td>
                  <td className="text-xs">{r.riskOwner || "-"}</td>
                  <td>
                    <span className={`status-badge ${r.status === "Open" ? "status-inactive" : r.status === "Mitigating" ? "status-pending" : "status-active"}`}>
                      {r.status || "-"}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded hover:bg-muted"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                      <button onClick={() => handleDelete(r._id)} className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
