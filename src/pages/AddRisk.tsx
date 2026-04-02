import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets, riskCategories } from "@/data/mockData";
import { masterAssetTypes, masterRiskOwners } from "@/data/masterData";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useCreateRisk } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

export default function AddRisk() {
  const navigate = useNavigate();
  const createRisk = useCreateRisk();

  // System Generated
  const today = new Date().toISOString().split("T")[0];
  const generatedRiskId = `R-${String(Math.floor(Math.random() * 900) + 100)}`;
  const [status, setStatus] = useState("Open");
  const [selectedRiskOwner, setSelectedRiskOwner] = useState("");

  // Section 1: Basic
  const [riskName, setRiskName] = useState("");
  const [controlReference, setControlReference] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [showCategoryAdd, setShowCategoryAdd] = useState(false);
  const [showSubCategoryAdd, setShowSubCategoryAdd] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [customCategories, setCustomCategories] = useState<{ name: string; subcategories: string[] }[]>([]);

  // Section 2: Asset
  const [selectedAsset, setSelectedAsset] = useState("");
  const [assetType, setAssetType] = useState("");

  // Section 3: Probability
  const [probability, setProbability] = useState(1);

  // Section 4: Impact
  const [impact, setImpact] = useState(1);

  // Section 2 (Threat)
  const [threat, setThreat] = useState("");
  const [tValue, setTValue] = useState(1);
  const [vulnerability, setVulnerability] = useState("");
  const [vValue, setVValue] = useState(1);

  // Section 7: Primary Control
  const [pc_controls, setPcControls] = useState("");
  const [pc_param, setPcParam] = useState("");
  const [cn1, setCn1] = useState(2);
  const [ct1, setCt1] = useState(1);
  const [cce1, setCce1] = useState(1);

  // Section 8: Compensatory Control
  const [cc_controls, setCcControls] = useState("");
  const [cc_param, setCcParam] = useState("");
  const [cn2, setCn2] = useState(2);
  const [ct2, setCt2] = useState(1);
  const [cce2, setCce2] = useState(1);

  // Section 6: Treatment
  const [treatmentRequired, setTreatmentRequired] = useState("");
  const [treatmentOption, setTreatmentOption] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [treatmentEmail, setTreatmentEmail] = useState("");
  const [treatmentPhone, setTreatmentPhone] = useState("");
  const [rtpReference, setRtpReference] = useState("");
  const [actualDate, setActualDate] = useState("");
  const [riskNotes, setRiskNotes] = useState("");

  // ===== CALCULATIONS =====
  const allCategories = [...riskCategories, ...customCategories];
  const subcategories = allCategories.find(c => c.name === category)?.subcategories || [];
  const asset = assets.find(a => a.name === selectedAsset);
  const riskOwner = masterRiskOwners.find(o => o.name === selectedRiskOwner);

  // CIA from asset
  const assetC = asset?.c || 0;
  const assetI = asset?.i || 0;
  const assetA = asset?.a || 0;
  const assetScore = assetC + assetI + assetA;
  const assetRanking = assetScore >= 10 ? "Critical" : assetScore >= 7 ? "High" : assetScore >= 4 ? "Medium" : "Low";
  const av = asset?.value || 1;

  // TV
  const tvValue = tValue + vValue;
  const getTvPair = (tv: number) => tv < 3 ? 1 : tv < 5 ? 2 : tv < 7 ? 3 : 4;
  const tvPair = getTvPair(tvValue);
  const tvPairLabel = tvPair === 1 ? "Low" : tvPair === 2 ? "Medium" : tvPair === 3 ? "High" : "Critical";

  // Absolute RIR
  const absoluteRIR = av * tvPair * probability;
  const rirLabel = absoluteRIR >= 16 ? "Critical" : absoluteRIR >= 9 ? "High" : absoluteRIR >= 4 ? "Medium" : "Low";

  // Control Values
  const cv1 = cn1 * ct1 * cce1;
  const cv2 = cn2 * ct2 * cce2;
  const getCR = (cv: number) => cv < 7 ? 1 : cv < 13 ? 2 : cv < 19 ? 3 : 4;
  const cr1 = getCR(cv1);
  const cr2 = getCR(cv2);
  const crLabel = (cr: number) => cr <= 1 ? "D" : cr === 2 ? "C" : cr === 3 ? "B" : "A";

  // Revised RIR = P × I / (PCR + CCP)
  const pcr = cr1;
  const ccp = cr2;
  const revisedRIR = (pcr + ccp) > 0 ? Math.round((probability * impact) / (pcr + ccp) * 100) / 100 : probability * impact;
  const riskPriority = revisedRIR >= 16 ? "Critical" : revisedRIR >= 9 ? "High" : revisedRIR >= 4 ? "Medium" : "Low";

  // Handlers
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

  const handleSave = () => {
    if (!riskName || !category || !selectedAsset) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    createRisk.mutate({
      name: riskName,
      controlReference,
      description,
      category,
      subcategory,
      status,
      assetName: selectedAsset,
      assetType,
      c: assetC, i: assetI, a: assetA,
      assetScore, assetRanking, assetValue: av,
      threat, tValue, vulnerability, vValue,
      tvValue, tvPair,
      probability, impact,
      absoluteRIR, riskImpactRating: rirLabel,
      primaryControl: { existingControls: pc_controls, implementationParameter: pc_param, controlNature: cn1, controlType: ct1, cce: cce1, controlValue: cv1, controlRanking: crLabel(cr1), controlRankingValue: cr1 },
      compensatoryControl: { existingControls: cc_controls, implementationParameter: cc_param, controlNature: cn2, controlType: ct2, cce: cce2, controlValue: cv2, controlRanking: crLabel(cr2), controlRankingValue: cr2 },
      revisedRIR, riskPriority,
      treatmentRequired, treatmentOption, treatmentPlan,
      treatmentTargetDate: targetDate || undefined,
      treatmentCompletionDate: completionDate || undefined,
      treatmentResponsibleEmail: treatmentEmail || riskOwner?.email,
      treatmentResponsiblePhone: treatmentPhone || riskOwner?.phone,
      rtpReference, actualDate: actualDate || undefined,
      riskAcceptanceNotes: riskNotes,
      riskOwner: selectedRiskOwner,
    }, {
      onSuccess: () => navigate("/risks"),
    });
  };

  // Section header component
  const SectionHeader = ({ num, title }: { num: string; title: string }) => (
    <div className="flex items-center gap-2 pt-4 pb-2 border-b border-border">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">{num}</span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
  );

  const CalcBox = ({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) => (
    <div className="text-center p-3">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className={`text-xl font-bold ${color || "text-foreground"}`}>{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground font-mono">{sub}</p>}
    </div>
  );

  const rirColor = (v: number) => v >= 16 ? "text-destructive" : v >= 9 ? "text-orange-500" : v >= 4 ? "text-yellow-600" : "text-emerald-600";

  return (
    <div className="page-container max-w-5xl">
      <div>
        <h1 className="page-title">Add New Risk</h1>
        <p className="page-subtitle">Complete risk assessment form with auto-calculations</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-5">

        {/* ===== SYSTEM GENERATED ===== */}
        <div className="bg-muted/30 rounded-lg p-4 border border-dashed border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">System Generated</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input value={today} disabled className="bg-muted/50 text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Risk ID</Label><Input value={generatedRiskId} disabled className="bg-muted/50 font-mono text-xs" /></div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>{["Open", "Mitigating", "Accepted", "Closed"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Risk Owner *</Label>
              <Select value={selectedRiskOwner} onValueChange={setSelectedRiskOwner}>
                <SelectTrigger className="text-xs"><SelectValue placeholder="Select risk owner" /></SelectTrigger>
                <SelectContent>{masterRiskOwners.map(o => <SelectItem key={o.id} value={o.name}>{o.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ===== SECTION 1: BASIC INFO ===== */}
        <SectionHeader num="1" title="Basic Information & Asset" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">Risk Name *</Label><Input value={riskName} onChange={e => setRiskName(e.target.value)} placeholder="Enter risk name" className="text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Control Reference</Label><Input value={controlReference} onChange={e => setControlReference(e.target.value)} placeholder="e.g., A7.1, A5.30" className="text-xs" /></div>
          <div className="col-span-full space-y-1.5"><Label className="text-xs">Description *</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the risk..." rows={2} className="text-xs" /></div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Category *</Label>
              <button onClick={() => setShowCategoryAdd(!showCategoryAdd)} className="text-[10px] text-primary hover:underline font-medium">+ New Category</button>
            </div>
            <Select value={category} onValueChange={v => { setCategory(v); setSubcategory(""); }}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select category" /></SelectTrigger>
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
            <Label className="text-xs">Subcategory *</Label>
            <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
              <SelectTrigger className="text-xs"><SelectValue placeholder={category ? "Select subcategory" : "Select category first"} /></SelectTrigger>
              <SelectContent>{subcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
            {category && showSubCategoryAdd && (
              <div className="flex gap-2 mt-1">
                <Input value={newSubCategory} onChange={e => setNewSubCategory(e.target.value)} placeholder="New subcategory" className="h-8 text-xs" />
                <button onClick={handleAddSubCategory} className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs hover:opacity-90">Add</button>
              </div>
            )}
            {category && <button onClick={() => setShowSubCategoryAdd(!showSubCategoryAdd)} className="text-[10px] text-primary hover:underline font-medium mt-1">+ New Subcategory</button>}
          </div>
        </div>

        {/* ===== SECTION 2: ASSET INFO ===== */}
        <SectionHeader num="2" title="Asset Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Asset (from Asset Register) *</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select asset" /></SelectTrigger>
              <SelectContent>{assets.map(a => <SelectItem key={a.id} value={a.name}>{a.id} - {a.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Asset Type</Label>
            <Select value={assetType} onValueChange={setAssetType}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>{masterAssetTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground italic">(Asset register review date will be in AR and not in RR)</p>

        {asset && (
          <div className="bg-muted/40 rounded-md p-4 border">
            <p className="text-[10px] font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Auto-fetched from Asset: {asset.name}</p>
            <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
              <CalcBox label="C" value={assetC} />
              <CalcBox label="I" value={assetI} />
              <CalcBox label="A" value={assetA} />
              <CalcBox label="Score [C+I+A]" value={assetScore} />
              <CalcBox label="Ranking" value={assetRanking} color={assetRanking === "Critical" ? "text-destructive" : assetRanking === "High" ? "text-orange-500" : "text-emerald-600"} />
              <CalcBox label="Asset Value" value={av} color="text-primary" />
              <CalcBox label="Criticality" value={asset.criticality} />
            </div>
          </div>
        )}

        {/* ===== SECTION 3: PROBABILITY ===== */}
        <SectionHeader num="3" title="Probability of Occurrence" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Probability of Occurrence (P) (Scale of 1–5)</Label>
            <Select value={String(probability)} onValueChange={v => setProbability(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/40 rounded-md p-4 border">
          <CalcBox label="Absolute RIR (AV × TVP × PoA)" value={absoluteRIR} sub={`(${av} × ${tvPair} × ${probability})`} color={rirColor(absoluteRIR)} />
          <CalcBox label="Risk Impact Rating" value={rirLabel} color={rirColor(absoluteRIR)} />
        </div>

        {/* ===== SECTION 4: IMPACT ===== */}
        <SectionHeader num="4" title="Impact" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Impact of Occurrence (I) (Scale of 1–5)</Label>
            <Select value={String(impact)} onValueChange={v => setImpact(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4,5].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* ===== SECTION 5: FINAL RISK ===== */}
        <SectionHeader num="5" title="Final Risk Calculation" />
        <div className="grid grid-cols-2 gap-3 bg-muted/40 rounded-md p-4 border">
          <CalcBox label="Revised RIR: Probability (P) × Impact (I)" value={revisedRIR} sub={`(${probability} × ${impact}) / (${pcr} + ${ccp})`} color={rirColor(revisedRIR)} />
          <CalcBox label="Risk Priority" value={riskPriority} color={riskPriority === "Critical" ? "text-destructive" : riskPriority === "High" ? "text-orange-500" : riskPriority === "Medium" ? "text-yellow-600" : "text-emerald-600"} />
        </div>

        {/* ===== SECTION 2 (THREAT): THREAT & VULNERABILITY ===== */}
        <SectionHeader num="T" title="Threat & Vulnerability" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">Threat</Label><Input value={threat} onChange={e => setThreat(e.target.value)} placeholder="e.g., Physical sabotage or tampering" className="text-xs" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs">T-Value (1–4)</Label>
            <Select value={String(tValue)} onValueChange={v => setTValue(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label className="text-xs">Vulnerability</Label><Input value={vulnerability} onChange={e => setVulnerability(e.target.value)} placeholder="e.g., Unsecure entry points" className="text-xs" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs">V-Value (1–4)</Label>
            <Select value={String(vValue)} onValueChange={v => setVValue(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>{[1,2,3,4].map(v => <SelectItem key={v} value={String(v)}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/40 rounded-md p-4 border">
          <CalcBox label="TV Value [T+V]" value={tvValue} />
          <CalcBox label="TV Pair" value={`${tvPair} (${tvPairLabel})`} color={tvPairLabel === "Critical" ? "text-destructive" : tvPairLabel === "High" ? "text-orange-500" : "text-foreground"} />
        </div>

        {/* ===== SECTION 7: PRIMARY CONTROL ===== */}
        <SectionHeader num="7" title="Primary Control" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">Existing Controls</Label><Input value={pc_controls} onChange={e => setPcControls(e.target.value)} placeholder="e.g., SOP reviewed annually" className="text-xs" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs">Implementation Parameter</Label>
            <Select value={pc_param} onValueChange={setPcParam}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Control Nature (CN)</Label>
            <Select value={String(cn1)} onValueChange={v => setCn1(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Manual (2)</SelectItem>
                <SelectItem value="4">Automated (4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Control Type (CT)</Label>
            <Select value={String(ct1)} onValueChange={v => setCt1(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Detective (1)</SelectItem>
                <SelectItem value="2">Corrective (2)</SelectItem>
                <SelectItem value="3">Preventive (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Current Control Effectiveness (CCE) (0–2)</Label>
            <Select value={String(cce1)} onValueChange={v => setCce1(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - None</SelectItem>
                <SelectItem value="1">1 - Partial</SelectItem>
                <SelectItem value="2">2 - Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/40 rounded-md p-4 border">
          <CalcBox label="Control Value (CN×CT×CCE)" value={cv1} />
          <CalcBox label="Control Ranking (CR)" value={`${crLabel(cr1)} (${cr1})`} color="text-primary" />
        </div>

        {/* ===== SECTION 8: COMPENSATORY CONTROL ===== */}
        <SectionHeader num="8" title="Compensatory / Additional Control" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5"><Label className="text-xs">Existing Controls</Label><Input value={cc_controls} onChange={e => setCcControls(e.target.value)} placeholder="e.g., Digital records transition" className="text-xs" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs">Implementation Parameter</Label>
            <Select value={cc_param} onValueChange={setCcParam}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Technical", "Administrative", "Physical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Control Nature (CN)</Label>
            <Select value={String(cn2)} onValueChange={v => setCn2(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Manual (2)</SelectItem>
                <SelectItem value="4">Automated (4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Control Type (CT)</Label>
            <Select value={String(ct2)} onValueChange={v => setCt2(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Detective (1)</SelectItem>
                <SelectItem value="2">Corrective (2)</SelectItem>
                <SelectItem value="3">Preventive (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Current Control Effectiveness (CCE) (0–2)</Label>
            <Select value={String(cce2)} onValueChange={v => setCce2(Number(v))}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0 - None</SelectItem>
                <SelectItem value="1">1 - Partial</SelectItem>
                <SelectItem value="2">2 - Full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 bg-muted/40 rounded-md p-4 border">
          <CalcBox label="Control Value (CN×CT×CCE)" value={cv2} />
          <CalcBox label="Control Ranking (CR)" value={`${crLabel(cr2)} (${cr2})`} color="text-primary" />
        </div>

        {/* ===== SECTION 6: TREATMENT ===== */}
        <SectionHeader num="6" title="Risk Treatment" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Required</Label>
            <Select value={treatmentRequired} onValueChange={setTreatmentRequired}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Yes", "No"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Option</Label>
            <Select value={treatmentOption} onValueChange={setTreatmentOption}>
              <SelectTrigger className="text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{["Mitigate", "Transfer", "Accept", "Avoid"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="col-span-full space-y-1.5"><Label className="text-xs">Treatment / Remediation Plan Description</Label><Textarea value={treatmentPlan} onChange={e => setTreatmentPlan(e.target.value)} placeholder="Describe the treatment plan..." rows={2} className="text-xs" /></div>
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Plan Target Date</Label>
            <Input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="text-xs" />
            {targetDate && (
              <div className="flex items-center gap-1.5 mt-1 p-2 bg-accent rounded text-xs">
                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-accent-foreground">Alert will be sent to the risk owner on the target start date</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Completion Date</Label>
            <Input type="date" value={completionDate} onChange={e => setCompletionDate(e.target.value)} className="text-xs" />
            {completionDate && (
              <div className="flex items-center gap-1.5 mt-1 p-2 bg-accent rounded text-xs">
                <AlertCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-accent-foreground">Alert if not updated in time for completion</span>
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Responsible Person (Email)</Label>
            <Input value={treatmentEmail || riskOwner?.email || ""} onChange={e => setTreatmentEmail(e.target.value)} placeholder="Auto from owner or enter email" className={`text-xs ${riskOwner && !treatmentEmail ? "bg-muted/50" : ""}`} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Treatment Responsible Person (Phone)</Label>
            <Input value={treatmentPhone || riskOwner?.phone || ""} onChange={e => setTreatmentPhone(e.target.value)} placeholder="Auto from owner or enter phone" className={`text-xs ${riskOwner && !treatmentPhone ? "bg-muted/50" : ""}`} />
          </div>
          <div className="space-y-1.5"><Label className="text-xs">RTP Reference</Label><Input value={rtpReference} onChange={e => setRtpReference(e.target.value)} placeholder="e.g., RTP-001" className="text-xs" /></div>
          <div className="space-y-1.5"><Label className="text-xs">Actual Date</Label><Input type="date" value={actualDate} onChange={e => setActualDate(e.target.value)} className="text-xs" /></div>
          <div className="col-span-full space-y-1.5"><Label className="text-xs">Risk Acceptance / Other Notes</Label><Textarea value={riskNotes} onChange={e => setRiskNotes(e.target.value)} placeholder="Additional notes..." rows={2} className="text-xs" /></div>
        </div>

        {/* ===== ACTIONS ===== */}
        <div className="flex gap-3 pt-4 border-t">
          <button onClick={handleSave} disabled={createRisk.isPending} className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
            {createRisk.isPending ? "Saving..." : "Save Risk"}
          </button>
          <button onClick={() => navigate("/risks")} className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition">Cancel</button>
        </div>
      </div>
    </div>
  );
}
