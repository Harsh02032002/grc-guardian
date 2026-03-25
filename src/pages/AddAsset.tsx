import { useState } from "react";
import { assetCategories } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddAsset() {
  const [c, setC] = useState(1);
  const [i, setI] = useState(1);
  const [a, setA] = useState(1);

  const assetValue = Math.max(c, i, a);
  const assetScore = c + i + a;
  const assetRanking = assetScore >= 10 ? "Critical" : assetScore >= 7 ? "High" : assetScore >= 4 ? "Medium" : "Low";

  return (
    <div className="page-container max-w-4xl">
      <div>
        <h1 className="page-title">Add New Asset</h1>
        <p className="page-subtitle">Register a new organizational asset</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="modal-section-title">Basic Information</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Asset Name *</Label>
            <Input placeholder="Enter asset name" />
          </div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {assetCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
            <Label>Department</Label>
            <Input placeholder="e.g., IT Department" />
          </div>
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input placeholder="e.g., Data Center A" />
          </div>
          <div className="space-y-1.5">
            <Label>Business Criticality</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Low", "Medium", "High", "Critical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="modal-section-title">CIA Classification</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Confidentiality (C)</Label>
            <Select value={String(c)} onValueChange={(v) => setC(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Low" : v === 2 ? "Medium" : v === 3 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Integrity (I)</Label>
            <Select value={String(i)} onValueChange={(v) => setI(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Low" : v === 2 ? "Medium" : v === 3 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Availability (A)</Label>
            <Select value={String(a)} onValueChange={(v) => setA(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v} - {v === 1 ? "Low" : v === 2 ? "Medium" : v === 3 ? "High" : "Critical"}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-md p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Asset Value (MAX)</p>
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

        <div className="modal-section-title">Ownership & Status</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Custodian</Label>
            <Input placeholder="Enter custodian name" />
          </div>
          <div className="space-y-1.5">
            <Label>Owner *</Label>
            <Input placeholder="Enter owner name" />
          </div>
          <div className="space-y-1.5">
            <Label>Retention Period</Label>
            <Input placeholder="e.g., 5 years" />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {["Active", "Inactive", "Decommissioned"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
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
