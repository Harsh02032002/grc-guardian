import { useState } from "react";
import { assets } from "@/data/mockData";
import { Eye, Edit, Trash2 } from "lucide-react";

export default function AssetRegister() {
  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Asset Register</h1>
          <p className="page-subtitle">Complete inventory of organizational assets</p>
        </div>
        <a href="/assets/add" className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          + Add Asset
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Asset Name</th>
              <th>Category</th>
              <th>Asset Group</th>
              <th>Criticality</th>
              <th>C</th>
              <th>I</th>
              <th>A</th>
              <th>Value</th>
              <th>Owner</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.id}>
                <td className="font-mono text-xs">{a.id}</td>
                <td className="font-medium">{a.name}</td>
                <td>{a.category}</td>
                <td>{a.group}</td>
                <td>
                  <span className={`status-badge ${a.criticality === "Critical" ? "status-inactive" : a.criticality === "High" ? "status-pending" : "status-active"}`}>
                    {a.criticality}
                  </span>
                </td>
                <td>{a.c}</td>
                <td>{a.i}</td>
                <td>{a.a}</td>
                <td className="font-semibold">{a.value}</td>
                <td>{a.owner}</td>
                <td>
                  <span className={`status-badge ${a.status === "Active" ? "status-active" : "status-inactive"}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded hover:bg-muted"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button className="p-1.5 rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
