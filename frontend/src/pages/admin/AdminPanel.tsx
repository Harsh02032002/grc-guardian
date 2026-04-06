import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { getAuthHeaders } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Users, Shield, CheckCircle, XCircle, Plus, Trash2, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MODULE_OPTIONS } from "@/lib/access";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminPanel() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<"companies" | "users">("companies");
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [showCreateSubAdmin, setShowCreateSubAdmin] = useState(false);
  const [subAdminForm, setSubAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    companyId: "",
    assignedModules: [] as string[],
  });

  const fetchData = async () => {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    try {
      const [compRes, userRes, statRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/companies`, { headers }),
        fetch(`${API_BASE_URL}/admin/users`, { headers }),
        fetch(`${API_BASE_URL}/admin/stats`, { headers }),
      ]);
      if (compRes.ok) setCompanies(await compRes.json());
      if (userRes.ok) setUsers(await userRes.json());
      if (statRes.ok) setStats(await statRes.json());
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchData(); }, []);

  const approveCompany = async (id: string, isApproved: boolean) => {
    await fetch(`${API_BASE_URL}/admin/companies/${id}/approve`, {
      method: "PATCH",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved }),
    });
    toast({ title: `Company ${isApproved ? "approved" : "rejected"}` });
    fetchData();
  };

  const deleteCompany = async (id: string) => {
    if (!confirm("Delete this company and all its users?")) return;
    await fetch(`${API_BASE_URL}/admin/companies/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast({ title: "Company deleted" });
    fetchData();
  };

  const createSubAdmin = async () => {
    if (!subAdminForm.companyId) {
      toast({ title: "Select company", description: "Sub-admin ko company assign karna zaroori hai.", variant: "destructive" });
      return;
    }

    if (subAdminForm.assignedModules.length === 0) {
      toast({ title: "Select modules", description: "Kam se kam ek module assign karo.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/create-subadmin`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(subAdminForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast({ title: "Sub-Admin created" });
      setShowCreateSubAdmin(false);
      setSubAdminForm({ name: "", email: "", password: "", companyId: "", assignedModules: [] });
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleModule = (mod: string) => {
    setSubAdminForm((prev) => ({
      ...prev,
      assignedModules: prev.assignedModules.includes(mod)
        ? prev.assignedModules.filter((m) => m !== mod)
        : [...prev.assignedModules, mod],
    }));
  };

  const updateUserModules = async (userId: string, modules: string[]) => {
    await fetch(`${API_BASE_URL}/admin/users/${userId}/modules`, {
      method: "PUT",
      headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ assignedModules: modules }),
    });
    toast({ title: "Modules updated" });
    fetchData();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast({ title: "User deleted" });
    fetchData();
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Manage companies, users & permissions</p>
        </div>
        <Dialog open={showCreateSubAdmin} onOpenChange={setShowCreateSubAdmin}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Create Sub-Admin</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Sub-Admin</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={subAdminForm.name} onChange={(e) => setSubAdminForm({ ...subAdminForm, name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={subAdminForm.email} onChange={(e) => setSubAdminForm({ ...subAdminForm, email: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" value={subAdminForm.password} onChange={(e) => setSubAdminForm({ ...subAdminForm, password: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Assign Company</Label>
                <Select value={subAdminForm.companyId} onValueChange={(v) => setSubAdminForm({ ...subAdminForm, companyId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
                  <SelectContent>
                    {companies.filter((c) => c.isApproved).map((c) => (
                      <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Assign Modules</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MODULE_OPTIONS.map((mod) => (
                    <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted">
                      <Checkbox
                        checked={subAdminForm.assignedModules.includes(mod.key)}
                        onCheckedChange={() => toggleModule(mod.key)}
                      />
                      {mod.label}
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={createSubAdmin} className="w-full">Create Sub-Admin</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Companies", value: stats.totalCompanies || 0, icon: Building2 },
          { label: "Users", value: stats.totalUsers || 0, icon: Users },
          { label: "Pending Approvals", value: stats.pendingCompanies || 0, icon: Shield },
          { label: "Total Risks", value: stats.totalRisks || 0, icon: Shield },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-2xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button onClick={() => setTab("companies")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "companies" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
          <Building2 className="h-4 w-4 inline mr-2" />Companies
        </button>
        <button onClick={() => setTab("users")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "users" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
          <Users className="h-4 w-4 inline mr-2" />Users
        </button>
      </div>

      {/* Companies Tab */}
      {tab === "companies" && (
        <div className="stat-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td className="font-medium">{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || "—"}</td>
                  <td>
                    <span className={`status-badge ${c.isApproved ? "status-active" : "status-pending"}`}>
                      {c.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-1">
                      {!c.isApproved && (
                        <Button size="sm" variant="ghost" onClick={() => approveCompany(c._id, true)}>
                          <CheckCircle className="h-4 w-4 text-success" />
                        </Button>
                      )}
                      {c.isApproved && (
                        <Button size="sm" variant="ghost" onClick={() => approveCompany(c._id, false)}>
                          <XCircle className="h-4 w-4 text-warning" />
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => deleteCompany(c._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No companies registered yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="stat-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Company</th>
                <th>Modules</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`status-badge ${u.role === "superadmin" ? "status-inactive" : u.role === "subadmin" ? "status-pending" : "status-active"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.companyId?.name || "—"}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(u.assignedModules || []).map((m: string) => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{m}</span>
                      ))}
                      {u.role !== "superadmin" && (
                        <EditModulesDialog user={u} companies={companies} onSave={updateUserModules} />
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${u.isApproved ? "status-active" : "status-pending"}`}>
                      {u.isApproved ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td>
                    {u.role !== "superadmin" && (
                      <Button size="sm" variant="ghost" onClick={() => deleteUser(u._id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EditModulesDialog({ user, companies, onSave }: { user: any; companies: any[]; onSave: (id: string, mods: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [modules, setModules] = useState<string[]>(user.assignedModules || []);

  const toggle = (mod: string) => {
    setModules((prev) => prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded cursor-pointer hover:bg-primary/20">
          <Settings className="h-3 w-3 inline" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Modules for {user.name}</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {MODULE_OPTIONS.map((mod) => (
            <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted">
              <Checkbox checked={modules.includes(mod.key)} onCheckedChange={() => toggle(mod.key)} />
              {mod.label}
            </label>
          ))}
        </div>
        <Button onClick={() => { onSave(user._id, modules); setOpen(false); }} className="w-full">
          Save Modules
        </Button>
      </DialogContent>
    </Dialog>
  );
}