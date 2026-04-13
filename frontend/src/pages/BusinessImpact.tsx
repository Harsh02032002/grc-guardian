import { useState } from "react";
import { impactGuidelines } from "@/data/mockData";
import { Plus } from "lucide-react";

export default function BusinessImpact() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Business Impact Guidelines</h1><p className="page-subtitle">Impact classification matrix for risk assessment</p></div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition flex items-center gap-1.5">
          <Plus className="h-4 w-4" /> Add Impact Type
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Impact Type</th>
              <th className="text-center">Level 1 (Low)</th>
              <th className="text-center">Level 2 (Medium)</th>
              <th className="text-center">Level 3 (High)</th>
              <th className="text-center">Level 4 (Critical)</th>
            </tr>
          </thead>
          <tbody>
            {impactGuidelines.map(ig => (
              <tr key={ig.type}>
                <td className="font-semibold">{ig.type}</td>
                {ig.levels.map((l, i) => (
                  <td key={i} className="text-center text-sm">
                    <span className={`status-badge ${i === 3 ? "status-inactive" : i === 2 ? "status-pending" : "status-active"}`}>{l}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
