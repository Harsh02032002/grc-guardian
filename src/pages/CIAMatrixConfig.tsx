import { ciaMatrix } from "@/data/mockData";

const gridColors = [
  ["bg-success/30", "bg-success/20", "bg-warning/20", "bg-warning/30"],
  ["bg-success/20", "bg-warning/20", "bg-warning/30", "bg-destructive/20"],
  ["bg-warning/20", "bg-warning/30", "bg-destructive/20", "bg-destructive/30"],
  ["bg-warning/30", "bg-destructive/20", "bg-destructive/30", "bg-destructive/40"],
];

export default function CIAMatrixConfig() {
  return (
    <div className="page-container">
      <div><h1 className="page-title">CIA Matrix Configuration</h1><p className="page-subtitle">Configure Confidentiality, Integrity, Availability scoring</p></div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Scoring Levels</h3>
        <table className="data-table">
          <thead><tr><th>Level</th><th>Label</th><th>Description</th><th>Financial</th><th>Operational</th></tr></thead>
          <tbody>
            {ciaMatrix.map(r => (
              <tr key={r.level}>
                <td><span className="font-bold text-primary">{r.level}</span></td>
                <td className="font-medium">{r.label}</td>
                <td>{r.description}</td>
                <td>{r.financial}</td>
                <td>{r.operational}</td>
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
                  <td className="px-4 py-3 font-semibold text-sm">{impact} - {ciaMatrix[i].label}</td>
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
