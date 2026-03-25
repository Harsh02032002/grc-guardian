import { assetCategories } from "@/data/mockData";
import { Edit, Trash2 } from "lucide-react";

export default function AssetCategories() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Asset Categories</h1>
          <p className="page-subtitle">Manage asset classification categories</p>
        </div>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assetCategories.map((cat, idx) => (
          <div key={cat} className="stat-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {idx + 1}
              </div>
              <div>
                <p className="font-medium text-sm">{cat}</p>
                <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 10) + 1} assets</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
              <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
