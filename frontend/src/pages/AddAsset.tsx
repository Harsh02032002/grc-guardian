import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { masterAssetCategories, masterAssetTypes, masterDepartments, masterLocations, masterRetentionPeriods, masterAssetClassifications } from "@/data/masterData";

export default function AddAsset() {
  const [c, setC] = useState(1);
  const [i, setI] = useState(1);
  const [a, setA] = useState(1);

  const assetValue = Math.max(c, i, a);
  const assetScore = c + i + a;
  const assetRanking = assetScore >= 13 ? "Critical" : assetScore >= 10 ? "High" : assetScore >= 7 ? "Medium" : "Low";

  const today = new Date().toISOString().split("T")[0];
  const generatedAssetId = `AST-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;

  return (
    <div className="page-container max-w-4xl">
      <div>
        <h1 className="page-title">Add New Asset</h1>
        <p className="page-subtitle">Register a new organizational asset</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* System Generated Fields */}
        <div className="modal-section-title">System Generated</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Date</Label>
            <Input value={today} disabled className="bg-muted/50" />
          </div>
          <div className="space-y-1.5">
            <Label>Asset ID</Label>
            <Input value={generatedAssetId} disabled className="bg-muted/50 font-mono" />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue="Active">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Active", "Inactive", "Decommissioned"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Basic Information */}
        <div className="modal-section-title">Basic Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Asset Name *</Label>
            <Input placeholder="Enter asset name or select from master" />
          </div>
          <div className="space-y-1.5">
            <Label>Category (Master) *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {masterAssetCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset Type (Master) *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select asset type" /></SelectTrigger>
              <SelectContent>
                {masterAssetTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset Classification</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select classification" /></SelectTrigger>
              <SelectContent>
                {masterAssetClassifications.map(c => <SelectItem key={c.id} value={c.name}>{c.name} (Level {c.level})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset Group</Label>
            <Input placeholder="e.g., Business Applications" />
          </div>
          <div className="space-y-1.5">
            <Label>Asset Group No.</Label>
            <Input placeholder="e.g., AG-001" />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="Describe the asset..." rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Department (Master)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {masterDepartments.map(d => <SelectItem key={d.id} value={d.name}>{d.name} ({d.code})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location (Master)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {masterLocations.map(l => <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Business Criticality</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select (or auto from BIA)" /></SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High", "Critical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground">Can be auto-populated from BIA or entered directly</p>
          </div>
        </div>

        {/* CIA Classification - Scale 1 to 5 */}
        <div className="modal-section-title">CIA Classification (Scale 1–5)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Confidentiality (C)</Label>
            <Select value={String(c)} onValueChange={(v) => setC(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Very Low" : v === 2 ? "Low" : v === 3 ? "Medium" : v === 4 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Integrity (I)</Label>
            <Select value={String(i)} onValueChange={(v) => setI(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Very Low" : v === 2 ? "Low" : v === 3 ? "Medium" : v === 4 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Availability (A)</Label>
            <Select value={String(a)} onValueChange={(v) => setA(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Very Low" : v === 2 ? "Low" : v === 3 ? "Medium" : v === 4 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto-calculated values */}
        <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-md p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Asset Value (MAX of C,I,A)</p>
            <p className="text-2xl font-bold text-primary">{assetValue}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Asset Score (C+I+A)</p>
            <p className="text-2xl font-bold">{assetScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Asset Ranking</p>
            <p className={`text-lg font-bold ${assetRanking === "Critical" ? "text-destructive" : assetRanking === "High" ? "text-warning" : "text-success"}`}>{assetRanking}</p>
          </div>
        </div>

        {/* Ownership & Status */}
        <div className="modal-section-title">Ownership & Review</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Owner *</Label>
            <Input placeholder="Enter owner name" />
          </div>
          <div className="space-y-1.5">
            <Label>Custodian</Label>
            <Input placeholder="Enter custodian name" />
          </div>
          <div className="space-y-1.5">
            <Label>Retention Period (Master)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select retention period" /></SelectTrigger>
              <SelectContent>
                {masterRetentionPeriods.map(r => <SelectItem key={r.id} value={r.name}>{r.name} — {r.description}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Register Review Due On</Label>
            <Input type="date" />
          </div>
          <div className="space-y-1.5">
            <Label>Name of Person Making Entry</Label>
            <Input placeholder="Enter name" />
          </div>
          <div className="space-y-1.5">
            <Label>Name of Reviewer</Label>
            <Input placeholder="Enter reviewer name" />
          </div>
          <div className="space-y-1.5">
            <Label>Date of Review</Label>
            <Input type="date" />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            Save Asset
          </button>
          <button className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
