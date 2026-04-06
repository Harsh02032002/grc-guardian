import { useState, useEffect } from "react";

import { getAuthHeaders } from "@/stores/authStore";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import { Search, Eye, Edit, Trash2 } from "lucide-react";

import { toast } from "@/hooks/use-toast";



const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";



export default function AdminAssets() {

  const [companies, setCompanies] = useState<any[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const [assets, setAssets] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [viewAsset, setViewAsset] = useState<any>(null);

  const [editAsset, setEditAsset] = useState<any>(null);



  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };



  useEffect(() => {

    fetch(`${API_BASE_URL}/admin/companies`, { headers }).then(r => r.json()).then(setCompanies).catch(() => {});

  }, []);



  useEffect(() => {

    setIsLoading(true);

    const url = selectedCompany === "all"

      ? `${API_BASE_URL}/admin/assets`

      : `${API_BASE_URL}/admin/assets?companyId=${selectedCompany}`;

    fetch(url, { headers }).then(r => r.json()).then(d => { setAssets(d); setIsLoading(false); }).catch(() => setIsLoading(false));

  }, [selectedCompany]);



  const filteredAssets = assets.filter((a: any) =>

    !searchQuery || a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||

    a.assetId?.toLowerCase().includes(searchQuery.toLowerCase())

  );



  const deleteAsset = async (id: string) => {

    if (!confirm("Delete this asset?")) return;

    await fetch(`${API_BASE_URL}/admin/assets/${id}`, { method: "DELETE", headers });

    setAssets(prev => prev.filter(a => a._id !== id));

    toast({ title: "Asset deleted" });

  };



  const saveEdit = async () => {

    if (!editAsset) return;

    try {

      const res = await fetch(`${API_BASE_URL}/admin/assets/${editAsset._id}`, {

        method: "PUT", headers, body: JSON.stringify(editAsset),

      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();

      setAssets(prev => prev.map(a => a._id === updated._id ? updated : a));

      setEditAsset(null);

      toast({ title: "Asset updated" });

    } catch (err: any) {

      toast({ title: "Error", description: err.message, variant: "destructive" });

    }

  };



  const approvedCompanies = companies.filter(c => c.isApproved);



  return (

    <div className="page-container">

      <div className="mb-6">

        <h1 className="page-title">Assets (All Companies)</h1>

        <p className="page-subtitle">View and manage assets across all registered companies</p>

      </div>



      {/* Company Tabs */}

      <div className="flex gap-2 mb-4 flex-wrap">

        <button

          onClick={() => setSelectedCompany("all")}

          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${

            selectedCompany === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"

          }`}

        >

          All Companies

        </button>

        {approvedCompanies.map((c) => (

          <button

            key={c._id}

            onClick={() => setSelectedCompany(c._id)}

            className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${

              selectedCompany === c._id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:bg-muted"

            }`}

          >

            {c.name}

          </button>

        ))}

      </div>



      {/* Search */}

      <div className="relative mb-4">

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input placeholder="Search assets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />

      </div>



      {/* Table */}

      <div className="stat-card">

        <div className="flex items-center justify-between mb-3">

          <span className="text-sm font-medium">Assets</span>

          <Badge variant="secondary">{filteredAssets.length} total</Badge>

        </div>

        {isLoading ? (

          <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>

        ) : filteredAssets.length === 0 ? (

          <p className="text-sm text-muted-foreground py-8 text-center">No assets found</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="data-table">

              <thead>

                <tr>

                  <th>Asset ID</th>

                  <th>Name</th>

                  <th>Category</th>

                  <th>Type</th>

                  <th>Department</th>

                  <th>Criticality</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredAssets.map((a: any) => (

                  <tr key={a._id}>

                    <td className="font-mono text-xs">{a.assetId}</td>

                    <td className="font-medium">{a.name}</td>

                    <td>{a.category}</td>

                    <td>{a.assetType}</td>

                    <td>{a.department}</td>

                    <td><Badge variant="outline">{a.businessCriticality || "—"}</Badge></td>

                    <td><Badge variant={a.status === "Active" ? "default" : "secondary"}>{a.status || "—"}</Badge></td>

                    <td>

                      <div className="flex gap-1">

                        <Button size="sm" variant="ghost" onClick={() => setViewAsset(a)}><Eye className="h-4 w-4" /></Button>

                        <Button size="sm" variant="ghost" onClick={() => setEditAsset({ ...a })}><Edit className="h-4 w-4" /></Button>

                        <Button size="sm" variant="ghost" onClick={() => deleteAsset(a._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>



      {/* View Dialog */}

      <Dialog open={!!viewAsset} onOpenChange={() => setViewAsset(null)}>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">

          <DialogHeader><DialogTitle>Asset Details</DialogTitle></DialogHeader>

          {viewAsset && (

            <div className="space-y-3 text-sm">

              {Object.entries(viewAsset).filter(([k]) => !["_id", "__v", "companyId"].includes(k)).map(([k, v]) => (

                <div key={k} className="flex justify-between border-b pb-1">

                  <span className="text-muted-foreground capitalize">{k.replace(/([A-Z])/g, " $1")}</span>

                  <span className="font-medium text-right max-w-[60%] truncate">{String(v ?? "—")}</span>

                </div>

              ))}

            </div>

          )}

        </DialogContent>

      </Dialog>



      {/* Edit Dialog */}

      <Dialog open={!!editAsset} onOpenChange={() => setEditAsset(null)}>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">

          <DialogHeader><DialogTitle>Edit Asset</DialogTitle></DialogHeader>

          {editAsset && (

            <div className="space-y-3">

              {["name", "category", "assetType", "department", "location", "owner", "custodian", "status"].map(field => (

                <div key={field} className="space-y-1">

                  <Label className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>

                  <Input value={editAsset[field] || ""} onChange={e => setEditAsset({ ...editAsset, [field]: e.target.value })} />

                </div>

              ))}

              <Button onClick={saveEdit} className="w-full">Save Changes</Button>

            </div>

          )}

        </DialogContent>

      </Dialog>

    </div>

  );

}

