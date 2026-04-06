import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminApproveUsers() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };

  const fetchData = async () => {
    try {
      const [compRes, userRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/companies`, { headers }),
        fetch(`${API_BASE_URL}/admin/users`, { headers }),
      ]);
      if (compRes.ok) setCompanies(await compRes.json());
      if (userRes.ok) setUsers(await userRes.json());
    } catch {}
  };

  useEffect(() => { fetchData(); }, []);

  const approveCompany = async (id: string, isApproved: boolean) => {
    await fetch(`${API_BASE_URL}/admin/companies/${id}/approve`, {
      method: "PATCH", headers, body: JSON.stringify({ isApproved }),
    });
    toast({ title: `Company ${isApproved ? "approved" : "rejected"}` });
    fetchData();
  };

  const approveUser = async (id: string, isApproved: boolean) => {
    await fetch(`${API_BASE_URL}/admin/users/${id}/approve`, {
      method: "PATCH", headers, body: JSON.stringify({ isApproved }),
    });
    toast({ title: `User ${isApproved ? "approved" : "rejected"}` });
    fetchData();
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("Delete this company and all its users?")) return;
    await fetch(`${API_BASE_URL}/admin/companies/${id}`, { method: "DELETE", headers });
    toast({ title: "Company deleted" });
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API_BASE_URL}/admin/users/${id}`, { method: "DELETE", headers });
    toast({ title: "User deleted" });
    fetchData();
  };

  const pendingCompanies = companies.filter(c => !c.isApproved);
  const approvedCompaniesList = companies.filter(c => c.isApproved);
  const pendingUsers = users.filter(u => !u.isApproved && u.role !== "superadmin");

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">User & Company Management</h1>
        <p className="page-subtitle">Approve or reject company registrations and users</p>
      </div>

      {/* Pending Companies */}
      <div className="stat-card mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          Pending Companies <Badge variant="destructive">{pendingCompanies.length}</Badge>
        </h2>
        {pendingCompanies.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No pending companies</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Company</th><th>Email</th><th>Phone</th><th>Registered</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {pendingCompanies.map(c => (
                <tr key={c._id}>
                  <td className="font-medium">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => approveCompany(c._id, true)}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => approveCompany(c._id, false)}><XCircle className="h-4 w-4 text-orange-500" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteCompany(c._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Approved Companies */}
      <div className="stat-card mb-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          Approved Companies <Badge variant="secondary">{approvedCompaniesList.length}</Badge>
        </h2>
        {approvedCompaniesList.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No approved companies yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Company</th><th>Email</th><th>Phone</th><th>Approved</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {approvedCompaniesList.map(c => (
                <tr key={c._id}>
                  <td className="font-medium">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td><Badge className="bg-green-100 text-green-800">Approved</Badge></td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => approveCompany(c._id, false)}><XCircle className="h-4 w-4 text-orange-500" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteCompany(c._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Users */}
      <div className="stat-card">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          All Users <Badge variant="secondary">{users.length}</Badge>
        </h2>
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Company</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.filter(u => u.role !== "superadmin").map(u => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td><Badge variant="outline" className="capitalize">{u.role}</Badge></td>
                <td>{u.companyId?.name || "—"}</td>
                <td>
                  <Badge className={u.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                    {u.isApproved ? "Active" : "Pending"}
                  </Badge>
                </td>
                <td>
                  <div className="flex gap-1">
                    {!u.isApproved && (
                      <Button size="sm" variant="ghost" onClick={() => approveUser(u._id, true)}><CheckCircle className="h-4 w-4 text-green-600" /></Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteUser(u._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
