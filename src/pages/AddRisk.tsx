import { useState } from "react";
import { assets, riskCategories } from "@/data/mockData";
import { masterAssetTypes, masterRiskOwners } from "@/data/masterData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";

export default function AddRisk() {
  const [category, setCategory] = useState("");
  const [selectedAsset, setSelectedAsset] = useState("");
  const [tValue, setTValue] = useState(1);
  const [vValue, setVValue] = useState(1);
  const [probability, setProbability] = useState(1);
  const [treatmentRequired, setTreatmentRequired] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [showCategoryAdd, setShowCategoryAdd] = useState(false);
  const [showSubCategoryAdd, setShowSubCategoryAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<{ name: string; subcategories: string[] }[]>([]);
  const [selectedRiskOwner, setSelectedRiskOwner] = useState("");

  // Control Block 1 (Primary Control)
  const [cn1, setCn1] = useState(2); // 2=Manual, 4=Auto
  const [ct1, setCt1] = useState(1); // 1=Detective, 2=Corrective, 3=Preventive
  const [cce1, setCce1] = useState(1); // 0-2
  // Control Block 2 (Compensatory Control)
  const [cn2, setCn2] = useState(2);
  const [ct2, setCt2] = useState(1);
  const [cce2, setCce2] = useState(1);

  const allCategories = [...riskCategories, ...customCategories];
  const subcategories = allCategories.find(c => c.name === category)?.subcategories || [];
  const asset = assets.find(a => a.name === selectedAsset);

  const today = new Date().toISOString().split("T")[0];
  const generatedRiskId = `R-${String(Math.floor(Math.random() * 900) + 100)}`;

  // CIA values from asset
  const assetC = asset?.c || 0;
  const assetI = asset?.i || 0;
  const assetA = asset?.a || 0;
  const assetScore = assetC + assetI + assetA;
  const assetRanking = assetScore >= 10 ? "Critical" : assetScore >= 7 ? "High" : assetScore >= 4 ? "Medium" : "Low";
  const av = asset?.value || 1;

  // TV Calculation
  const tvValue = tValue + vValue;
  const getTvPair = (tv: number) => {
    if (tv < 3) return 1;
    if (tv >= 3 && tv < 5) return 2;
    if (tv >= 5 && tv < 7) return 3;
    return 4;
  };
  const tvPair = getTvPair(tvValue);
  const tvPairLabel = tvPair === 1 ? "Low" : tvPair === 2 ? "Medium" : tvPair === 3 ? "High" : "Critical";

  // Absolute Risk (Zero Controls)
  const absoluteRIR = av * tvPair * probability;

  // Control Value = CN * CT * CCE
  const cv1 = cn1 * ct1 * cce1;
  const cv2 = cn2 * ct2 * cce2;
  // Control Ranking
  const getCR = (cv: number) => {
    if (cv < 3) return 1;
    if (cv >= 3 && cv < 7) return 1;
    if (cv >= 7 && cv < 13) return 2;
    if (cv >= 13 && cv < 19) return 3;
    return 4;
  };
  const cr1 = getCR(cv1);
  const cr2 = getCR(cv2);
  const cr1Label = cr1 <= 1 ? "D" : cr1 === 2 ? "C" : cr1 === 3 ? "B" : "A";
  const cr2Label = cr2 <= 1 ? "D" : cr2 === 2 ? "C" : cr2 === 3 ? "B" : "A";

  // Revised RIR = (AV * TV Pair * PoA) / (PCR + CCP)
  const pcr = cr1;
  const ccp = cr2;
  const revisedRIR = (pcr + ccp) > 0 ? Math.round((av * tvPair * probability) / (pcr + ccp) * 100) / 100 : absoluteRIR;
  const riskPriority = revisedRIR >= 16 ? "Critical" : revisedRIR >= 9 ? "High" : revisedRIR >= 4 ? "Medium" : "Low";

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    setCustomCategories([...customCategories, { name: newCategory, subcategories: [] }]);
    setCategory(newCategory);
    setNewCategory("");
    setShowCategoryAdd(false);
  };

  const handleAddSubCategory = () => {
    if (!newSubCategory.trim() || !category) return;
    setCustomCategories(prev => prev.map(c => c.name === category ? { ...c, subcategories: [...c.subcategories, newSubCategory] } : c));
    setNewSubCategory("");
    setShowSubCategoryAdd(false);
  };

  const riskOwner = masterRiskOwners.find(o => o.name === selectedRiskOwner);

  return (
    <div className="page-container max-w-5xl">
      <div>
        <h1 className="page-title">Add New Risk</h1>
        <p className="page-subtitle">Complete risk assessment form with auto-calculations</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        {/* System Generated */}
        <div className="modal-section-title">System Generated</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5"><Label>Date</Label><Input value={today} disabled className="bg-muted/50" /></div>
          <div className="space-y-1.5"><Label>Risk ID</Label><Input value={generatedRiskId} disabled className="bg-muted/50 font-mono" /></div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select defaultValue="Open">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{["Open", "Mitigating", "Accepted", "Closed"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* SECTION 1: Basic + Asset */}
        <div className="modal-section-title">Section 1: Basic Information & Asset</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Risk Name *</Label><Input placeholder="Enter risk name" /></div>
          <div className="space-y-1.5"><Label>Control Reference</Label><Input placeholder="e.g., A7.1, A5.30" /></div>
          <div className="col-span-full space-y-1.5"><Label>Description *</Label><Textarea placeholder="Describe the risk..." rows={2} /></div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Category (Master) *</Label>
              <button onClick={() => setShowCategoryAdd(!showCategoryAdd)} className="text-[10px] text-primary hover:underline">+ New Category</button>
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{allCategories.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
            {showCategoryAdd && (
              <div className="flex gap-2 mt-1">
                <Input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category name" className="h-8 text-xs" />
                <button onClick={handleAddCategory} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs hover:opacity-90">Add</button>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Subcategory (Master) *</Label>
              {category && <button onClick={() => setShowSubCategoryAdd(!showSubCategoryAdd)} className="text-[10px] text-primary hover:underline">+ New Subcategory</button>}
            </div>
            <Select disabled={!category}>
              <SelectTrigger><SelectValue placeholder={category ? "Select subcategory" : "Select category first"} /></SelectTrigger>
              <SelectContent>{subcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            {showSubCategoryAdd && (
              <div className="flex gap-2 mt-1">
                <Input value={newSubCategory} onChange={e => setNewSubCategory(e.target.value)} placeholder="New subcategory" className="h-8 text-xs" />
                <button onClick={handleAddSubCategory} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs hover:opacity-90">Add</button>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Asset (from Asset Register) *</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>{assets.map(a => <SelectItem key={a.id} value={a.name}>{a.id} - {a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset Type (Master)</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{masterAssetTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Asset Register Review Due Date</Label><Input type="date" /></div>
          <div className="space-y-1.5">
            <Label>Risk Owner (Master) *</Label>
            <Select value={selectedRiskOwner} onValueChange={setSelectedRiskOwner}>
              <SelectTrigger><SelectValue placeholder="Select risk owner" /></SelectTrigger>
              <SelectContent>{masterRiskOwners.map(o => <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Auto-fetched from Asset */}
        {asset && (
          <div className="bg-muted/50 rounded-md p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">AUTO-FETCHED FROM ASSET: {asset.name}</p>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
              <div className="text-center"><p className="text-[10px] text-muted-foreground">C</p><p className="text-lg font-bold">{assetC}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">I</p><p className="text-lg font-bold">{assetI}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">A</p><p className="text-lg font-bold">{assetA}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">Score (C+I+A)</p><p className="text-lg font-bold">{assetScore}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">Ranking</p><p className={`text-sm font-bold ${assetRanking === "Critical" ? "text-destructive" : assetRanking === "High" ? "text-warning" : "text-success"}`}>{assetRanking}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">Asset Value</p><p className="text-lg font-bold text-primary">{av}</p></div>
              <div className="text-center"><p className="text-[10px] text-muted-foreground">Criticality</p><p className="text-sm font-bold">{asset.criticality}</p></div>
            </div>
          </div>
        )}

        {/* SECTION 2: Threat & Vulnerability */}
        <div className="modal-section-title">Section 2: Threat & Vulnerability</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Threat</Label><Input placeholder="e.g., Physical sabotage or tampering" /></div>
          <div className="space-y-1.5">
            <Label>T-Value (1–4)</Label>
            <Select value={String(tValue)} onValueChange={v => setTValue(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Vulnerability</Label><Input placeholder="e.g., Unsecure entry points" /></div>
          <div className="space-y-1.5">
            <Label>V-Value (1–4)</Label>
            <Select value={String(vValue)} onValueChange={v => setVValue(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">TV Value [T+V]</p><p className="text-lg font-bold">{tvValue}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">TV Pair</p><p className={`text-lg font-bold ${tvPairLabel === "Critical" ? "text-destructive" : tvPairLabel === "High" ? "text-warning" : "text-foreground"}`}>{tvPair} ({tvPairLabel})</p></div>
        </div>

        {/* Probability & Absolute Risk */}
        <div className="modal-section-title">Probability & Absolute Risk (Zero Controls)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Probability of Occurrence (PoA) (1–4)</Label>
            <Select value={String(probability)} onValueChange={v => setProbability(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Absolute RIR (AV × TVP × PoA)</p>
            <p className={`text-2xl font-bold ${absoluteRIR >= 16 ? "text-destructive" : absoluteRIR >= 9 ? "text-warning" : "text-success"}`}>{absoluteRIR}</p>
            <p className="text-[10px] text-muted-foreground font-mono">({av} × {tvPair} × {probability})</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Risk Impact Rating</p>
            <p className="text-lg font-bold">{absoluteRIR >= 16 ? "Critical" : absoluteRIR >= 9 ? "High" : absoluteRIR >= 4 ? "Medium" : "Low"}</p>
          </div>
        </div>

        {/* SECTION 3: Primary Control */}
        <div className="modal-section-title">Section 3: Primary Control</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Existing Controls</Label><Input placeholder="e.g., SOP reviewed annually" /></div>
          <div className="space-y-1.5">
            <Label>Implementation Parameter</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Nature (CN)</Label>
            <Select value={String(cn1)} onValueChange={v => setCn1(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Manual (2)</SelectItem>
                <SelectItem value="4">Automated (4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Type (CT)</Label>
            <Select value={String(ct1)} onValueChange={v => setCt1(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Detective (1)</SelectItem>
                <SelectItem value="2">Corrective (2)</SelectItem>
                <SelectItem value="3">Preventive (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Current Control Effectiveness (CCE) (0–2)</Label>
            <Select value={String(cce1)} onValueChange={v => setCce1(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - None</SelectItem>
                <SelectItem value="1">1 - Partial</SelectItem>
                <SelectItem value="2">2 - Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Value (CN×CT×CCE)</p><p className="text-lg font-bold">{cv1}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Ranking (CR)</p><p className="text-lg font-bold text-primary">{cr1Label} ({cr1})</p></div>
        </div>

        {/* SECTION 4: Compensatory / Additional Control */}
        <div className="modal-section-title">Section 4: Compensatory / Additional Control</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label>Existing Controls</Label><Input placeholder="e.g., Digital records transition" /></div>
          <div className="space-y-1.5">
            <Label>Implementation Parameter</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Nature (CN)</Label>
            <Select value={String(cn2)} onValueChange={v => setCn2(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Manual (2)</SelectItem>
                <SelectItem value="4">Automated (4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Control Type (CT)</Label>
            <Select value={String(ct2)} onValueChange={v => setCt2(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Detective (1)</SelectItem>
                <SelectItem value="2">Corrective (2)</SelectItem>
                <SelectItem value="3">Preventive (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Current Control Effectiveness (CCE) (0–2)</Label>
            <Select value={String(cce2)} onValueChange={v => setCce2(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - None</SelectItem>
                <SelectItem value="1">1 - Partial</SelectItem>
                <SelectItem value="2">2 - Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Value (CN×CT×CCE)</p><p className="text-lg font-bold">{cv2}</p></div>
          <div className="text-center"><p className="text-xs text-muted-foreground">Control Ranking (CR)</p><p className="text-lg font-bold text-primary">{cr2Label} ({cr2})</p></div>
        </div>

        {/* SECTION 5: Revised Risk */}
        <div className="modal-section-title">Section 5: Final Risk Calculation</div>
        <div className="grid grid-cols-4 gap-3 bg-muted/50 rounded-md p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Revised RIR</p>
            <p className={`text-2xl font-bold ${revisedRIR >= 16 ? "text-destructive" : revisedRIR >= 9 ? "text-warning" : "text-success"}`}>{revisedRIR}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Risk Priority</p>
            <p className={`text-lg font-bold ${riskPriority === "Critical" ? "text-destructive" : riskPriority === "High" ? "text-warning" : "text-success"}`}>{riskPriority}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">PCR + CCP</p>
            <p className="text-lg font-bold">{pcr} + {ccp} = {pcr + ccp}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground">RRIR = (AV×TVP×PoA) / (PCR+CCP)</p>
            <p className="text-xs font-mono mt-1">({av}×{tvPair}×{probability}) / ({pcr}+{ccp})</p>
          </div>
        </div>

        {/* SECTION 6: Treatment */}
        <div className="modal-section-title">Section 6: Risk Treatment</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Treatment Required</Label>
            <Select value={treatmentRequired} onValueChange={setTreatmentRequired}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Yes", "No"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Treatment Option</Label>
            <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Mitigate", "Transfer", "Accept", "Avoid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-full space-y-1.5"><Label>Treatment / Remediation Plan Description</Label><Textarea placeholder="Describe the treatment plan..." rows={2} /></div>
          <div className="space-y-1.5">
            <Label>Treatment Plan Target Date</Label>
            <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} />
            {targetDate && (
              <div className="flex items-center gap-1 mt-1 p-2 bg-accent rounded text-xs">
                <AlertCircle className="h-3 w-3 text-primary" />
                <span className="text-accent-foreground">Alert will be sent to the risk owner on the target start date</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Treatment Completion Date</Label>
            <Input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} />
            {completionDate && (
              <div className="flex items-center gap-1 mt-1 p-2 bg-accent rounded text-xs">
                <AlertCircle className="h-3 w-3 text-primary" />
                <span className="text-accent-foreground">Alert if not updated in time for completion</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Treatment Responsible Person (Email)</Label>
            <Input value={riskOwner?.email || ""} placeholder="Auto from owner or enter email" readOnly={!!riskOwner} className={riskOwner ? "bg-muted/50" : ""} />
          </div>
          <div className="space-y-1.5">
            <Label>Treatment Responsible Person (Phone)</Label>
            <Input value={riskOwner?.phone || ""} placeholder="Auto from owner or enter phone" readOnly={!!riskOwner} className={riskOwner ? "bg-muted/50" : ""} />
          </div>
          <div className="space-y-1.5"><Label>RTP Reference</Label><Input placeholder="e.g., RTP-001" /></div>
          <div className="space-y-1.5"><Label>Actual Date</Label><Input type="date" /></div>
          <div className="col-span-full space-y-1.5"><Label>Risk Acceptance / Other Notes</Label><Textarea placeholder="Additional notes..." rows={2} /></div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">Save Risk</button>
          <button className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
