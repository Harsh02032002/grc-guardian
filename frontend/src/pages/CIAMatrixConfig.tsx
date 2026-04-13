import { useState } from "react";
import { ciaMatrix } from "@/data/mockData";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const gridColors = [
  ["bg-success/30", "bg-success/20", "bg-warning/20", "bg-warning/30"],
  ["bg-success/20", "bg-warning/20", "bg-warning/30", "bg-destructive/20"],
  ["bg-warning/20", "bg-warning/30", "bg-destructive/20", "bg-destructive/30"],
  ["bg-warning/30", "bg-destructive/20", "bg-destructive/30", "bg-destructive/40"],
];

export default function CIAMatrixConfig() {
  const [matrix, setMatrix] = useState(ciaMatrix);

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">CIA Matrix Configuration</h1><p className="page-subtitle">Configure Confidentiality, Integrity, Availability scoring</p></div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-1" /> Add Level</Button>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Scoring Levels</h3>
        <table className="data-table">
          <thead><tr><th>Level</th><th>Label</th><th>Description</th><th>Financial</th><th>Operational</th><th>Actions</th></tr></thead>
          <tbody>
            {matrix.map((r: any) => (
              <tr key={r.level}>
                <td><span className="font-bold text-primary">{r.level}</span></td>
                <td className="font-medium">{r.label}</td>
                <td>{r.description}</td>
                <td>{r.financial}</td>
                <td>{r.operational}</td>
                <td>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Risk Score Matrix (Impact × Likelihood)</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Impact ↓ / Likelihood →</th>
                {[1,2,3,4].map(l => <th key={l} className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4].map((impact, i) => (
                <tr key={impact}>
                  <td className="px-4 py-3 font-semibold text-sm">{impact} - {matrix[i].label}</td>
                  {[1,2,3,4].map((likelihood, j) => (
                    <td key={likelihood} className="px-4 py-3 text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-sm ${gridColors[i][j]}`}>
                        {impact * likelihood}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
