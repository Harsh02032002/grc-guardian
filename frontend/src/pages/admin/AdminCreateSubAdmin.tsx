import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Settings, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MODULE_OPTIONS } from "@/lib/access";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminCreateSubAdmin() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [assignedModules, setAssignedModules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied] = useState(false);

  // Edit modules dialog
  const [editUser, setEditUser] = useState<any>(null);
  const [editModules, setEditModules] = useState<string[]>([]);

  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };

  const fetchData = async () => {
    const [compRes, userRes] = await Promise.all([
      fetch(`${API_BASE_URL}/admin/companies`, { headers }),
      fetch(`${API_BASE_URL}/admin/users`, { headers }),
    ]);
    if (compRes.ok) setCompanies(await compRes.json());
    if (userRes.ok) {
      const users = await userRes.json();
      setSubAdmins(users.filter((u: any) => u.role === "subadmin"));
    }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleModule = (mod: string) => {
    setAssignedModules(prev => prev.includes(mod) ? prev.filter(m => m !== mod) : [...prev, mod]);
  };

  const createSubAdmin = async () => {
    if (!email || !companyId) {
      toast({ title: "Email aur company select karo", variant: "destructive" });
      return;
    }
    if (assignedModules.length === 0) {
      toast({ title: "Kam se kam ek module assign karo", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/create-subadmin`, {
        method: "POST", headers,
        body: JSON.stringify({ email, companyId, assignedModules }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const link = `${window.location.origin}${data.setPasswordLink}`;
      setInviteLink(link);
      toast({ title: "Sub-Admin created!", description: "Invite link generated. Share it with the sub-admin." });
      setEmail("");
      setCompanyId("");
      setAssignedModules([]);
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!" });
  };

  const saveModules = async () => {
    if (!editUser) return;
    await fetch(`${API_BASE_URL}/admin/users/${editUser._id}/modules`, {
      method: "PUT", headers, body: JSON.stringify({ assignedModules: editModules }),
    });
    toast({ title: "Modules updated" });
    setEditUser(null);
    fetchData();
  };

  const approvedCompanies = companies.filter(c => c.isApproved);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="page-title">Create Sub-Admin</h1>
        <p className="page-subtitle">Invite a sub-admin by email. They'll receive a link to set their password.</p>
      </div>

      {/* Create Form */}
      <div className="stat-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Email Address</Label>
            <Input type="email" placeholder="subadmin@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Assign to Company</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger><SelectValue placeholder="Select company" /></SelectTrigger>
              <SelectContent>
                {approvedCompanies.map(c => (
                  <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label>Assign Modules (Sidebar Access)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {MODULE_OPTIONS.map(mod => (
              <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted border">
                <Checkbox checked={assignedModules.includes(mod.key)} onCheckedChange={() => toggleModule(mod.key)} />
                {mod.label}
              </label>
            ))}
          </div>
        </div>

        <Button onClick={createSubAdmin} disabled={isLoading} className="mt-4">
          {isLoading ? "Creating..." : "Create & Generate Invite Link"}
        </Button>
      </div>

      {/* Invite Link */}
      {inviteLink && (
        <div className="stat-card mb-6 bg-green-50 border-green-200">
          <h3 className="text-sm font-semibold mb-2 text-green-800">✅ Invite Link Generated</h3>
          <p className="text-xs text-muted-foreground mb-2">Share this link with the sub-admin. They can set their name and password using this link.</p>
          <div className="flex items-center gap-2">
            <Input value={inviteLink} readOnly className="text-xs" />
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* Existing Sub-Admins */}
      <div className="stat-card">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          Existing Sub-Admins <Badge variant="secondary">{subAdmins.length}</Badge>
        </h2>
        {subAdmins.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No sub-admins created yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Company</th><th>Modules</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {subAdmins.map(u => (
                <tr key={u._id}>
                  <td className="font-medium">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.companyId?.name || "—"}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {(u.assignedModules || []).map((m: string) => (
                        <span key={m} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">{m}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <Button size="sm" variant="ghost" onClick={() => { setEditUser(u); setEditModules(u.assignedModules || []); }}>
                      <Settings className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modules Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Modules for {editUser?.name}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-2 py-4">
            {MODULE_OPTIONS.map(mod => (
              <label key={mod.key} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted">
                <Checkbox
                  checked={editModules.includes(mod.key)}
                  onCheckedChange={() => setEditModules(prev => prev.includes(mod.key) ? prev.filter(m => m !== mod.key) : [...prev, mod.key])}
                />
                {mod.label}
              </label>
            ))}
          </div>
          <Button onClick={saveModules} className="w-full">Save Modules</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
