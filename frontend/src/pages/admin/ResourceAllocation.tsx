import { useState, useEffect } from "react";
import { useAuthStore, getAuthHeaders } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Users, HardDrive, Building2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface ResourceLimit {
  companyId: string;
  companyName: string;
  maxUsers: number;
  storageGB: number;
  currentUsers: number;
  usedStorage: number;
}

export default function ResourceAllocation() {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<ResourceLimit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/resources`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Failed to fetch companies");
    }
  };

  const updateResource = async (companyId: string, field: string, value: number) => {
    setCompanies((prev) =>
      prev.map((c) => (c.companyId === companyId ? { ...c, [field]: value } : c))
    );
  };

  const saveResources = async (companyId: string) => {
    const company = companies.find((c) => c.companyId === companyId);
    if (!company) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/${companyId}/resources`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          maxUsers: company.maxUsers,
          storageGB: company.storageGB,
        }),
      });
      if (res.ok) {
        toast({ title: "Resources updated successfully" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update resources", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Database className="h-6 w-6" />
            Resource Allocation
          </h1>
          <p className="page-subtitle">Set user limits and storage for companies</p>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Companies</span>
          </div>
          <p className="text-2xl font-bold">{companies.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Users</span>
          </div>
          <p className="text-2xl font-bold">
            {companies.reduce((sum, c) => sum + (c.currentUsers || 0), 0)}
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Storage</span>
          </div>
          <p className="text-2xl font-bold">
            {companies.reduce((sum, c) => sum + (c.usedStorage || 0), 0)} GB
          </p>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Current Users</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Max Users Limit</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Storage Used</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Storage Limit (GB)</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.companyId} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{company.companyName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span>{company.currentUsers || 0}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    value={company.maxUsers}
                    onChange={(e) =>
                      updateResource(company.companyId, "maxUsers", parseInt(e.target.value) || 0)
                    }
                    className="w-24 h-8"
                    min={1}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    <span>{company.usedStorage || 0} GB</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Input
                    type="number"
                    value={company.storageGB}
                    onChange={(e) =>
                      updateResource(company.companyId, "storageGB", parseInt(e.target.value) || 0)
                    }
                    className="w-24 h-8"
                    min={1}
                  />
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    onClick={() => saveResources(company.companyId)}
                    disabled={loading}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </td>
              </tr>
            ))}
            {companies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
