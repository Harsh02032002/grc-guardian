import { riskCategories } from "@/data/mockData";
import { Edit, Trash2 } from "lucide-react";

export default function RiskSubcategories() {
  const allSubs = riskCategories.flatMap(c => c.subcategories.map(s => ({ category: c.name, subcategory: s })));

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Risk Subcategories</h1>
          <p className="page-subtitle">Detailed risk subcategory management</p>
        </div>
        <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">+ Add Subcategory</button>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>#</th><th>Subcategory</th><th>Parent Category</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {allSubs.map((s, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td className="font-medium">{s.subcategory}</td>
              <td><span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{s.category}</span></td>
              <td>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
