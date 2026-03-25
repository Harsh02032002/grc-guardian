const riskLibrary = [
  { id: "RL001", name: "Ransomware Attack", category: "Cybersecurity", description: "Malicious software encrypts data and demands payment", likelihood: "High", impact: "Critical" },
  { id: "RL002", name: "Supply Chain Disruption", category: "Operational", description: "Disruption in supply chain affecting operations", likelihood: "Medium", impact: "High" },
  { id: "RL003", name: "Insider Threat", category: "Cybersecurity", description: "Malicious or negligent actions by internal actors", likelihood: "Medium", impact: "High" },
  { id: "RL004", name: "Natural Disaster", category: "Operational", description: "Floods, earthquakes, or other natural events", likelihood: "Low", impact: "Critical" },
  { id: "RL005", name: "Data Privacy Violation", category: "Compliance", description: "Failure to comply with data protection regulations", likelihood: "Medium", impact: "High" },
  { id: "RL006", name: "Vendor Lock-in", category: "Strategic", description: "Over-dependence on a single vendor", likelihood: "Medium", impact: "Medium" },
  { id: "RL007", name: "DDoS Attack", category: "Cybersecurity", description: "Distributed denial-of-service disrupting availability", likelihood: "High", impact: "High" },
  { id: "RL008", name: "Key Person Risk", category: "Operational", description: "Dependency on key individuals for critical processes", likelihood: "Medium", impact: "High" },
];

export default function RiskLibrary() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Library</h1>
          <p className="page-subtitle">Pre-defined risk templates for quick risk assessment</p>
        </div>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">+ Add to Library</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskLibrary.map(r => (
          <div key={r.id} className="stat-card">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{r.id}</p>
                <h3 className="font-semibold">{r.name}</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{r.category}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
            <div className="flex gap-4 text-xs">
              <span>Likelihood: <strong className={r.likelihood === "High" ? "text-destructive" : "text-foreground"}>{r.likelihood}</strong></span>
              <span>Impact: <strong className={r.impact === "Critical" ? "text-destructive" : "text-warning"}>{r.impact}</strong></span>
            </div>
            <button className="mt-3 text-xs text-primary font-medium hover:underline">Use as Template →</button>
          </div>
        ))}
      </div>
    </div>
  );
}
