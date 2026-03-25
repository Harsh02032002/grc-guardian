import { assets, risks } from "@/data/mockData";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, ZAxis } from "recharts";

const COLORS = ["hsl(217,91%,50%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)", "hsl(262,83%,58%)", "hsl(199,89%,48%)"];

const riskDistribution = risks.reduce((acc, r) => {
  acc[r.category] = (acc[r.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const riskDistData = Object.entries(riskDistribution).map(([name, value]) => ({ name, value }));

const criticalRisks = risks.filter(r => r.rir >= 12);

const heatmapData = risks.map(r => ({ x: r.likelihood, y: r.impact, z: r.rir, name: r.name }));

const assetByCat = assets.reduce((acc, a) => {
  acc[a.category] = (acc[a.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
const assetCatData = Object.entries(assetByCat).map(([name, value]) => ({ name, value }));

export default function Reports() {
  return (
    <div className="page-container">
      <div><h1 className="page-title">Reports & Analytics</h1><p className="page-subtitle">Visual risk and asset analytics</p></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Asset Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={assetCatData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {assetCatData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Risk Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={riskDistData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(217,91%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Risk Heatmap (Likelihood × Impact)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis type="number" dataKey="x" name="Likelihood" domain={[0, 5]} tick={{ fontSize: 11 }} label={{ value: "Likelihood", position: "bottom", fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Impact" domain={[0, 5]} tick={{ fontSize: 11 }} label={{ value: "Impact", angle: -90, position: "left", fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[100, 500]} />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(val: number, name: string) => [val, name]} />
              <Scatter data={heatmapData} fill="hsl(0,84%,60%)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Critical Risks Summary</h3>
          <div className="space-y-3">
            {criticalRisks.map(r => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.category} · {r.owner}</p>
                </div>
                <div className="text-right">
                  <span className={`status-badge ${r.rir >= 16 ? "status-inactive" : "status-pending"}`}>RIR: {r.rir}</span>
                  <p className="text-xs text-muted-foreground mt-1">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
