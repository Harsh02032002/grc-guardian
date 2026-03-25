import { assets } from "@/data/mockData";

const getBgColor = (val: number) => {
  if (val === 4) return "bg-destructive/20 text-destructive";
  if (val === 3) return "bg-warning/20 text-warning";
  if (val === 2) return "bg-info/20 text-info";
  return "bg-success/20 text-success";
};

export default function AssetClassification() {
  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Asset Classification (CIA View)</h1>
        <p className="page-subtitle">Confidentiality, Integrity, and Availability assessment</p>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Asset Name</th>
              <th>Category</th>
              <th className="text-center">Confidentiality</th>
              <th className="text-center">Integrity</th>
              <th className="text-center">Availability</th>
              <th className="text-center">Asset Value</th>
              <th className="text-center">Asset Score</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id}>
                <td className="font-medium">{a.name}</td>
                <td>{a.category}</td>
                <td className="text-center"><span className={`status-badge ${getBgColor(a.c)}`}>{a.c}</span></td>
                <td className="text-center"><span className={`status-badge ${getBgColor(a.i)}`}>{a.i}</span></td>
                <td className="text-center"><span className={`status-badge ${getBgColor(a.a)}`}>{a.a}</span></td>
                <td className="text-center font-bold">{a.value}</td>
                <td className="text-center font-bold">{a.c + a.i + a.a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">CIA Legend</h3>
        <div className="flex gap-6">
          {[
            { val: 1, label: "Low", color: "bg-success/20 text-success" },
            { val: 2, label: "Medium", color: "bg-info/20 text-info" },
            { val: 3, label: "High", color: "bg-warning/20 text-warning" },
            { val: 4, label: "Critical", color: "bg-destructive/20 text-destructive" },
          ].map(l => (
            <div key={l.val} className="flex items-center gap-2">
              <span className={`status-badge ${l.color}`}>{l.val}</span>
              <span className="text-sm text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
