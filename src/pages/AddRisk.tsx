import { useState } from "react";
import { assets, riskCategories } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddRisk() {
  const [category, setCategory] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [tValue, setTValue] = useState(1);
  const [vValue, setVValue] = useState(1);
  const [controlEffectiveness1, setControlEffectiveness1] = useState("Medium");
  const [controlEffectiveness2, setControlEffectiveness2] = useState("Medium");
  const [probability, setProbability] = useState(1);

  const subcategories = riskCategories.find(c => c.name === category)?.subcategories || [];
  const asset = assets.find(a => a.name === selectedAsset);

  const tvValue = tValue + vValue;
  const tvPair = tvValue <= 3 ? "Low" : tvValue <= 5 ? "Medium" : tvValue <= 7 ? "High" : "Critical";

  const getControlValue = (eff: string) => eff === "High" ? 4 : eff === "Medium" ? 3 : eff === "Low" ? 2 : 1;
  const cv1 = getControlValue(controlEffectiveness1);
  const cv2 = getControlValue(controlEffectiveness2);
  const cr1 = cv1 >= 4 ? "A" : cv1 >= 3 ? "B" : cv1 >= 2 ? "C" : "D";
  const cr2 = cv2 >= 4 ? "A" : cv2 >= 3 ? "B" : cv2 >= 2 ? "C" : "D";

  const av = asset?.value || 1;
  const totalCV = cv1 + cv2;
  const rir = totalCV > 0 ? Math.round((av * tvValue * probability) / totalCV) : 0;
  const riskPriority = rir >= 16 ? "Critical" : rir >= 9 ? "High" : rir >= 4 ? "Medium" : "Low";

  return (
    <div className="page-container max-w-5xl">
      <div>
        <h1 className="page-title">Add New Risk</h1>
        <p className="page-subtitle">Complete risk assessment form</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* SECTION 1 */}
        <div className="modal-section-title">Section 1: Basic Information & Asset</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Risk Name *</Label><Input placeholder="Enter risk name" /></div>
          <div className="space-y-1.5"><Label>Control Reference</Label><Input placeholder="e.g., ISO 27001 A.12.1" /></div>
          <div className="col-span-full space-y-1.5"><Label>Description</Label><Textarea placeholder="Describe the risk..." rows={2} /></div>
          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{riskCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subcategory *</Label>
            <Select disabled={!category}>
              <SelectTrigger><SelectValue placeholder={category ? "Select subcategory" : "Select category first"} /></SelectTrigger>
              <SelectContent>{subcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset *</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>{assets.map(a => <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        {asset && (
          <div className="grid grid-cols-4 gap-3 bg-muted/50 rounded-md p-4">
            <div className="text-center"><p className="text-xs text-muted-foreground">Asset Value</p><p className="text-lg font-bold text-primary">{asset.value}</p></div>
            <div className="text-center"><p className="text-xs text-muted-foreground">Confidentiality</p><p className="text-lg font-bold">{asset.c}</p></div>
            <div className="text-center"><p className="text-xs text-muted-foreground">Integrity</p><p className="text-lg font-bold">{asset.i}</p></div>
            <div className="text-center"><p className="text-xs text-muted-foreground">Availability</p><p className="text-lg font-bold">{asset.a}</p></div>
          </div>
        )}

        {/* SECTION 2 */}
        <div className="modal-section-title">Section 2: Threat & Vulnerability</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Threat</Label><Input placeholder="Describe the threat" /></div>
          <div className="space-y-1.5">
            <Label>T-Value (1–4)</Label>
            <Select value={String(tValue)} onValueChange={v => setTValue(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Vulnerability</Label><Input placeholder="Describe the vulnerability" /></div>
          <div className="space-y-1.5">
            <Label>V-Value (1–4)</Label>
            <Select value={String(vValue)} onValueChange={v => setVValue(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">TV Value (T+V)</p><p className="text-lg font-bold">{tvValue}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">TV Pair</p><p className={`text-lg font-bold ${tvPair === "Critical" ? "text-destructive" : tvPair === "High" ? "text-warning" : "text-foreground"}`}>{tvPair}</p></div>
        </div>

        {/* SECTION 3: Controls Block 1 */}
        <div className="modal-section-title">Section 3: Controls (Block 1)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Existing Controls</Label><Input placeholder="e.g., Firewall, MFA" /></div>
          <div className="space-y-1.5">
            <Label>Implementation Parameter</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Nature</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Manual", "Automated"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Preventive", "Detective", "Corrective"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Effectiveness</Label>
            <Select value={controlEffectiveness1} onValueChange={setControlEffectiveness1}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["None", "Low", "Medium", "High"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Value (CV)</p><p className="text-lg font-bold">{cv1}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Ranking (CR)</p><p className="text-lg font-bold text-primary">{cr1}</p></div>
        </div>

        {/* SECTION 4: Controls Block 2 */}
        <div className="modal-section-title">Section 4: Controls (Block 2)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Existing Controls</Label><Input placeholder="e.g., IDS, Encryption" /></div>
          <div className="space-y-1.5">
            <Label>Implementation Parameter</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Nature</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Manual", "Automated"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Type</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Preventive", "Detective", "Corrective"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Effectiveness</Label>
            <Select value={controlEffectiveness2} onValueChange={setControlEffectiveness2}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["None", "Low", "Medium", "High"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Value (CV)</p><p className="text-lg font-bold">{cv2}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Ranking (CR)</p><p className="text-lg font-bold text-primary">{cr2}</p></div>
        </div>

        {/* SECTION 5: Final Risk */}
        <div className="modal-section-title">Section 5: Final Risk Calculation</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Probability of Occurrence (1–4)</Label>
            <Select value={String(probability)} onValueChange={v => setProbability(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">RIR Score</p><p className={`text-2xl font-bold ${rir >= 16 ? "text-destructive" : rir >= 9 ? "text-warning" : "text-success"}`}>{rir}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">Risk Priority</p><p className={`text-lg font-bold ${riskPriority === "Critical" ? "text-destructive" : riskPriority === "High" ? "text-warning" : "text-success"}`}>{riskPriority}</p></div>
          <div className="text-center"><p className="text-[10px] text-muted-foreground">Formula: (AV × TV × Prob) / (CV1 + CV2)</p><p className="text-xs font-mono mt-1">({av} × {tvValue} × {probability}) / ({cv1} + {cv2})</p></div>
        </div>

        {/* SECTION 6: Ownership */}
        <div className="modal-section-title">Section 6: Ownership & Status</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Risk Owner *</Label><Input placeholder="Enter risk owner" /></div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Open", "Mitigating", "Accepted", "Closed"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* SECTION 7: Treatment */}
        <div className="modal-section-title">Section 7: Treatment</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Treatment Required</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Yes", "No"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Treatment Plan</Label><Input placeholder="Describe treatment plan" /></div>
          <div className="space-y-1.5">
            <Label>Treatment Option</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Mitigate", "Transfer", "Accept", "Avoid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Target Date</Label><Input type="date" /></div>
          <div className="space-y-1.5"><Label>Actual Date</Label><Input type="date" /></div>
          <div className="space-y-1.5"><Label>RTP Reference</Label><Input placeholder="e.g., RTP-001" /></div>
          <div className="col-span-full space-y-1.5"><Label>Notes</Label><Textarea placeholder="Additional notes..." rows={2} /></div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Risk</button>
          <button className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
