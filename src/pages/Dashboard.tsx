import { Shield, Box, AlertTriangle, FileCheck, BarChart3, TrendingUp, TrendingDown } from "lucide-react";
import { assets, risks, controls, treatments } from "@/data/mockData";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const riskByCategory = risks.reduce((acc, r) => {
  acc[r.category] = (acc[r.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const riskChartData = Object.entries(riskByCategory).map(([name, value]) => ({ name, value }));
const COLORS = ["hsl(217,91%,50%)", "hsl(142,76%,36%)", "hsl(38,92%,50%)", "hsl(0,84%,60%)", "hsl(262,83%,58%)"];

const riskStatusData = [
  { name: "Open", count: risks.filter(r => r.status === "Open").length },
  { name: "Mitigating", count: risks.filter(r => r.status === "Mitigating").length },
  { name: "Accepted", count: risks.filter(r => r.status === "Accepted").length },
];

const stats = [
  { label: "Total Assets", value: assets.length, icon: Box, trend: "+2", color: "text-primary" },
  { label: "Active Risks", value: risks.filter(r => r.status === "Open").length, icon: AlertTriangle, trend: "-1", color: "text-destructive" },
  { label: "Controls", value: controls.length, icon: Shield, trend: "+3", color: "text-success" },
  { label: "Treatment Plans", value: treatments.length, icon: FileCheck, trend: "+1", color: "text-warning" },
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">GRC overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{s.value}</span>
              <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${s.trend.startsWith("+") ? "text-success" : "text-destructive"}`}>
                {s.trend.startsWith("+") ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {s.trend} this month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Risk Distribution by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskChartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {riskChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Risk Status Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={riskStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(217,91%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stat-card">
        <h3 className="text-sm font-semibold mb-4">Critical Risks</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Risk ID</th>
              <th>Risk Name</th>
              <th>Category</th>
              <th>RIR Score</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {risks.filter(r => r.rir >= 12).map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-xs">{r.id}</td>
                <td className="font-medium">{r.name}</td>
                <td>{r.category}</td>
                <td>
                  <span className={`status-badge ${r.rir >= 16 ? "status-inactive" : "status-pending"}`}>
                    {r.rir}
                  </span>
                </td>
                <td>{r.owner}</td>
                <td>
                  <span className={`status-badge ${r.status === "Open" ? "status-inactive" : r.status === "Mitigating" ? "status-pending" : "status-active"}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
