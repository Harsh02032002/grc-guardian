import { impactGuidelines } from "@/data/mockData";

export default function BusinessImpact() {
  return (
    <div className="page-container">
      <div><h1 className="page-title">Business Impact Guidelines</h1><p className="page-subtitle">Impact classification matrix for risk assessment</p></div>
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
