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



export default function AdminRisks() {

  const [companies, setCompanies] = useState<any[]>([]);

  const [selectedCompany, setSelectedCompany] = useState<string>("all");

  const [risks, setRisks] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const [viewRisk, setViewRisk] = useState<any>(null);

  const [editRisk, setEditRisk] = useState<any>(null);



  const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };



  useEffect(() => {

    fetch(`${API_BASE_URL}/admin/companies`, { headers }).then(r => r.json()).then(setCompanies).catch(() => {});

  }, []);



  useEffect(() => {

    setIsLoading(true);

    const url = selectedCompany === "all"

      ? `${API_BASE_URL}/admin/risks`

      : `${API_BASE_URL}/admin/risks?companyId=${selectedCompany}`;

    fetch(url, { headers }).then(r => r.json()).then(d => { setRisks(d); setIsLoading(false); }).catch(() => setIsLoading(false));

  }, [selectedCompany]);



  const filteredRisks = risks.filter((r: any) =>

    !searchQuery || r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||

    r.riskId?.toLowerCase().includes(searchQuery.toLowerCase())

  );



  const deleteRisk = async (id: string) => {

    if (!confirm("Delete this risk?")) return;

    await fetch(`${API_BASE_URL}/admin/risks/${id}`, { method: "DELETE", headers });

    setRisks(prev => prev.filter(r => r._id !== id));

    toast({ title: "Risk deleted" });

  };



  const saveEdit = async () => {

    if (!editRisk) return;

    try {

      const res = await fetch(`${API_BASE_URL}/admin/risks/${editRisk._id}`, {

        method: "PUT", headers, body: JSON.stringify(editRisk),

      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();

      setRisks(prev => prev.map(r => r._id === updated._id ? updated : r));

      setEditRisk(null);

      toast({ title: "Risk updated" });

    } catch (err: any) {

      toast({ title: "Error", description: err.message, variant: "destructive" });

    }

  };



  const approvedCompanies = companies.filter(c => c.isApproved);



  return (

    <div className="page-container">

      <div className="mb-6">

        <h1 className="page-title">Risks (All Companies)</h1>

        <p className="page-subtitle">View and manage risks across all registered companies</p>

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

        <Input placeholder="Search risks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />

      </div>



      {/* Table */}

      <div className="stat-card">

        <div className="flex items-center justify-between mb-3">

          <span className="text-sm font-medium">Risks</span>

          <Badge variant="secondary">{filteredRisks.length} total</Badge>

        </div>

        {isLoading ? (

          <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>

        ) : filteredRisks.length === 0 ? (

          <p className="text-sm text-muted-foreground py-8 text-center">No risks found</p>

        ) : (

          <div className="overflow-x-auto">

            <table className="data-table">

              <thead>

                <tr>

                  <th>Risk ID</th>

                  <th>Name</th>

                  <th>Category</th>

                  <th>Risk Owner</th>

                  <th>Probability</th>

                  <th>Impact</th>

                  <th>Priority</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredRisks.map((r: any) => (

                  <tr key={r._id}>

                    <td className="font-mono text-xs">{r.riskId}</td>

                    <td className="font-medium">{r.name}</td>

                    <td>{r.category}</td>

                    <td>{r.riskOwner}</td>

                    <td>{r.probability}</td>

                    <td>{r.impact}</td>

                    <td><Badge variant="outline">{r.riskPriority || "—"}</Badge></td>

                    <td><Badge variant={r.status === "Open" ? "destructive" : "default"}>{r.status || "—"}</Badge></td>

                    <td>

                      <div className="flex gap-1">

                        <Button size="sm" variant="ghost" onClick={() => setViewRisk(r)}><Eye className="h-4 w-4" /></Button>

                        <Button size="sm" variant="ghost" onClick={() => setEditRisk({ ...r })}><Edit className="h-4 w-4" /></Button>

                        <Button size="sm" variant="ghost" onClick={() => deleteRisk(r._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>

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

      <Dialog open={!!viewRisk} onOpenChange={() => setViewRisk(null)}>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">

          <DialogHeader><DialogTitle>Risk Details</DialogTitle></DialogHeader>

          {viewRisk && (

            <div className="space-y-3 text-sm">

              {Object.entries(viewRisk).filter(([k]) => !["_id", "__v", "companyId"].includes(k)).map(([k, v]) => (

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

      <Dialog open={!!editRisk} onOpenChange={() => setEditRisk(null)}>

        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">

          <DialogHeader><DialogTitle>Edit Risk</DialogTitle></DialogHeader>

          {editRisk && (

            <div className="space-y-3">

              {["name", "category", "subcategory", "riskOwner", "status", "treatmentOption"].map(field => (

                <div key={field} className="space-y-1">

                  <Label className="capitalize">{field.replace(/([A-Z])/g, " $1")}</Label>

                  <Input value={editRisk[field] || ""} onChange={e => setEditRisk({ ...editRisk, [field]: e.target.value })} />

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

