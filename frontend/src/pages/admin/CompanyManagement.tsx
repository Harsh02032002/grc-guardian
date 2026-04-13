import { useState, useEffect } from "react";
import { useAuthStore, getAuthHeaders } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, XCircle, Search, Users, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CompanyManagement() {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "active" | "inactive">("all");

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies`, {
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  const approveCompany = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/approve`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast({ title: "Company approved successfully" });
        fetchCompanies();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve company", variant: "destructive" });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/companies/${id}/status`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        toast({ title: `Company ${currentStatus ? "deactivated" : "activated"}` });
        fetchCompanies();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "pending") return matchesSearch && !company.isApproved;
    if (activeTab === "active") return matchesSearch && company.isApproved && company.isActive;
    if (activeTab === "inactive") return matchesSearch && company.isApproved && !company.isActive;
    return matchesSearch;
  });

  const stats = {
    total: companies.length,
    pending: companies.filter(c => !c.isApproved).length,
    active: companies.filter(c => c.isApproved && c.isActive).length,
    inactive: companies.filter(c => c.isApproved && !c.isActive).length,
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Company Management
          </h1>
          <p className="page-subtitle">Approve, activate or deactivate companies</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Companies</p>
        </div>
        <div className="stat-card border-yellow-200 bg-yellow-50">
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-yellow-600">Pending Approval</p>
        </div>
        <div className="stat-card border-green-200 bg-green-50">
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          <p className="text-xs text-green-600">Active</p>
        </div>
        <div className="stat-card border-red-200 bg-red-50">
          <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
          <p className="text-xs text-red-600">Inactive</p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {["all", "pending", "active", "inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Users</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company._id} className="border-t">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="font-medium">{company.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{company.email}</td>
                <td className="px-4 py-3 text-sm">{company.phone || "—"}</td>
                <td className="px-4 py-3">
                  {!company.isApproved ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Pending
                    </span>
                  ) : company.isActive ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Users className="h-3 w-3" />
                    {company.userCount || 0}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {!company.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approveCompany(company._id)}
                        className="text-green-600 border-green-200"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    )}
                    {company.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(company._id, company.isActive)}
                        className={company.isActive ? "text-red-600 border-red-200" : "text-green-600 border-green-200"}
                      >
                        {company.isActive ? (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredCompanies.length === 0 && (
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
