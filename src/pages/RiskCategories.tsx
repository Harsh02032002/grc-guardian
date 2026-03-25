import { riskCategories } from "@/data/mockData";
import { Edit, Trash2 } from "lucide-react";

export default function RiskCategories() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Categories</h1>
          <p className="page-subtitle">Manage risk classification categories</p>
        </div>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">+ Add Category</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskCategories.map((cat) => (
          <div key={cat.name} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{cat.name}</h3>
              <div className="flex gap-1">
                <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {cat.subcategories.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
