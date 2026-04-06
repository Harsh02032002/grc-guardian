import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/stores/authStore";
import { Building2, Users, Box, AlertTriangle, Shield, FileCheck } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/stats`, {
          headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        });
        if (res.ok) setStats(await res.json());
      } catch {}
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Companies", value: stats.totalCompanies || 0, icon: Building2, color: "text-blue-500" },
    { label: "Total Users", value: stats.totalUsers || 0, icon: Users, color: "text-green-500" },
    { label: "Pending Companies", value: stats.pendingCompanies || 0, icon: Shield, color: "text-orange-500" },
    { label: "Pending Users", value: stats.pendingUsers || 0, icon: Users, color: "text-yellow-500" },
    { label: "Total Assets", value: stats.totalAssets || 0, icon: Box, color: "text-purple-500" },
    { label: "Total Risks", value: stats.totalRisks || 0, icon: AlertTriangle, color: "text-red-500" },
    { label: "Total Controls", value: stats.totalControls || 0, icon: Shield, color: "text-cyan-500" },
    { label: "Total Treatments", value: stats.totalTreatments || 0, icon: FileCheck, color: "text-emerald-500" },
  ];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of all companies and GRC data</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <span className="text-2xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
