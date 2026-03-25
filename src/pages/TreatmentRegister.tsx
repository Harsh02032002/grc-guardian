import { treatments } from "@/data/mockData";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function TreatmentRegister() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Treatment Register</h1><p className="page-subtitle">Risk treatment plans and tracking</p></div>
        <a href="/treatments/add" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">+ Add Treatment</a>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead><tr><th>ID</th><th>Risk Name</th><th>Treatment Plan</th><th>Option</th><th>Target Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {treatments.map(t => (
              <tr key={t.id}>
                <td className="font-mono text-xs">{t.id}</td>
                <td className="font-medium">{t.riskName}</td>
                <td className="max-w-xs truncate text-sm">{t.plan}</td>
                <td><span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{t.option}</span></td>
                <td>{t.targetDate}</td>
                <td><span className={`status-badge ${t.status === "In Progress" ? "status-pending" : t.status === "Accepted" ? "status-active" : "status-inactive"}`}>{t.status}</span></td>
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
