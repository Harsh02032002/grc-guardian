import { useState, useEffect } from "react";
import { useAuthStore, getAuthHeaders } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit, Settings, Users, Shield, UserCheck, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MODULE_OPTIONS } from "@/lib/access";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const USER_ROLES = [
  { key: "subadmin", label: "Sub-Admin" },
  { key: "auditor", label: "Auditor" },
  { key: "auditee", label: "Auditee" },
  { key: "general", label: "General User" },
];

export default function CompanyUserManagement() {
  const { user } = useAuthStore();
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    assignedModules: [] as string[],
  });

  const fetchCompanyUsers = async () => {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    try {
      const res = await fetch(`${API_BASE_URL}/company/users`, { headers });
      if (res.ok) setCompanyUsers(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchCompanyUsers(); }, []);

  const createCompanyUser = async () => {
    if (!userForm.name || !userForm.email || !userForm.password || !userForm.role) {
      toast({ title: "Error", description: "All fields required", variant: "destructive" });
      return;
    }

    if (userForm.role === "subadmin" && userForm.assignedModules.length === 0) {
      toast({ title: "Error", description: "Sub-admin ko kam se kam 1 module assign karo", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/company/users`, {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast({ title: "User created successfully" });
      setShowCreateUser(false);
      setUserForm({ name: "", email: "", password: "", role: "", assignedModules: [] });
      fetchCompanyUsers();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const toggleModule = (mod: string) => {
    setUserForm((prev) => ({
      ...prev,
      assignedModules: prev.assignedModules.includes(mod)
        ? prev.assignedModules.filter((m) => m !== mod)
        : [...prev.assignedModules, mod],
    }));
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${API_BASE_URL}/company/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    toast({ title: "User deleted" });
    fetchCompanyUsers();
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage company users, sub-admins, auditors</p>
        </div>
        <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Company User</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Full name" />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="Email address" />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="Password" />
              </div>
              <div className="space-y-1">
                <Label>Role</Label>
                <Select value={userForm.role} onValueChange={(v) => setUserForm({ ...userForm, role: v, assignedModules: [] })}>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((r) => <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {userForm.role === "subadmin" && (
                <div className="space-y-2 border rounded-lg p-3">
                  <Label className="text-sm font-semibold">Assign Modules (Checkbox)</Label>
                  <p className="text-xs text-muted-foreground">Sub-admin ko konse modules access dena hai select karo:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {MODULE_OPTIONS.map((mod) => (
                      <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted border">
                        <Checkbox
                          checked={userForm.assignedModules.includes(mod.key)}
                          onCheckedChange={() => toggleModule(mod.key)}
                        />
                        {mod.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={createCompanyUser} className="w-full">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="stat-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Modules</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companyUsers.map((u) => (
              <tr key={u._id}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`status-badge ${u.role === "subadmin" ? "status-pending" : "status-active"}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {(u.assignedModules || []).map((m: string) => (
                      <span key={m} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{m}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${u.isApproved ? "status-active" : "status-pending"}`}>
                    {u.isApproved ? "Active" : "Pending"}
                  </span>
                </td>
                <td>
                  <Button size="sm" variant="ghost" onClick={() => deleteUser(u._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {companyUsers.length === 0 && (
              <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No users found. Create your first user.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
