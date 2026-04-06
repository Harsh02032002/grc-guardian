import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAsset, useConfig } from "@/hooks/useApi";
import { masterAssetCategories, masterAssetTypes, masterDepartments, masterLocations, masterRetentionPeriods, masterAssetClassifications } from "@/data/masterData";

// Required field indicator component
const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="flex items-center gap-1">
    {children}
    <span className="text-red-500">*</span>
  </Label>
);

// Error message component
const FieldError = ({ message }: { message: string }) => (
  <p className="text-xs text-red-500 mt-1">{message}</p>
);

export default function AddAsset() {
  const navigate = useNavigate();
  const createAsset = useCreateAsset();
  const { data: apiLocations = [] } = useConfig("location");

  // State for form fields
  const [formData, setFormData] = useState({
    assetName: "",
    category: "",
    assetType: "",
    assetClassification: "",
    assetGroup: "",
    assetGroupNo: "",
    description: "",
    department: "",
    location: "",
    businessCriticality: "",
    owner: "",
    custodian: "",
    retentionPeriod: "",
    reviewDueDate: "",
    entryBy: "",
    reviewer: "",
    reviewDate: "",
    status: "Active",
  });

  const [c, setC] = useState(1);
  const [i, setI] = useState(1);
  const [a, setA] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const assetValue = Math.max(c, i, a);
  const assetScore = c + i + a;
  const assetRanking = assetScore >= 13 ? "Critical" : assetScore >= 10 ? "High" : assetScore >= 7 ? "Medium" : "Low";

  const today = new Date().toISOString().split("T")[0];
  const generatedAssetId = `AST-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`;

  // Merge master data with API locations
  const locations = apiLocations.length > 0 ? apiLocations : masterLocations;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof typeof formData]);
  };

  const validateField = (field: string, value: string) => {
    const requiredFields = ["assetName", "category", "assetType", "owner"];
    if (requiredFields.includes(field) && !value.trim()) {
      setErrors(prev => ({ ...prev, [field]: `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} req hai` }));
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const requiredFields = ["assetName", "category", "assetType", "owner"];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    requiredFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (!value.trim()) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} req hai`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      assetName: true,
      category: true,
      assetType: true,
      owner: true,
    });

    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const assetData = {
      assetId: generatedAssetId,
      name: formData.assetName,
      category: formData.category,
      assetType: formData.assetType,
      classification: formData.assetClassification,
      group: formData.assetGroup,
      description: formData.description,
      department: formData.department,
      location: formData.location,
      businessCriticality: formData.businessCriticality,
      c,
      i,
      a,
      assetValue,
      assetScore,
      assetRanking,
      owner: formData.owner,
      custodian: formData.custodian,
      retentionPeriod: formData.retentionPeriod,
      reviewDueDate: formData.reviewDueDate,
      entryBy: formData.entryBy,
      reviewer: formData.reviewer,
      reviewDate: formData.reviewDate,
      status: formData.status,
    };

    try {
      await createAsset.mutateAsync(assetData);
      navigate("/assets");
    } catch (error) {
      console.error("Failed to create asset:", error);
    }
  };

  const handleCancel = () => {
    navigate("/assets");
  };

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
            <RequiredLabel>Status</RequiredLabel>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleInputChange("status", value)}
            >
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
            <RequiredLabel>Asset Name</RequiredLabel>
            <Input 
              placeholder="Enter asset name or select from master" 
              value={formData.assetName}
              onChange={(e) => handleInputChange("assetName", e.target.value)}
              onBlur={() => handleBlur("assetName")}
              className={errors.assetName && touched.assetName ? "border-red-500" : ""}
            />
            {errors.assetName && touched.assetName && <FieldError message={errors.assetName} />}
          </div>
          <div className="space-y-1.5">
            <RequiredLabel>Category </RequiredLabel>
            <Select 
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
              onOpenChange={() => handleBlur("category")}
            >
              <SelectTrigger className={errors.category && touched.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {masterAssetCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.category && touched.category && <FieldError message={errors.category} />}
          </div>
          <div className="space-y-1.5">
            <RequiredLabel>Asset Type </RequiredLabel>
            <Select 
              value={formData.assetType}
              onValueChange={(value) => handleInputChange("assetType", value)}
              onOpenChange={() => handleBlur("assetType")}
            >
              <SelectTrigger className={errors.assetType && touched.assetType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {masterAssetTypes.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            {errors.assetType && touched.assetType && <FieldError message={errors.assetType} />}
          </div>
          <div className="space-y-1.5">
            <Label>Asset Classification</Label>
            <Select 
              value={formData.assetClassification}
              onValueChange={(value) => handleInputChange("assetClassification", value)}
            >
              <SelectTrigger><SelectValue placeholder="Select classification" /></SelectTrigger>
              <SelectContent>
                {masterAssetClassifications.map(c => <SelectItem key={c.id} value={c.name}>{c.name} (Level {c.level})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Asset Group</Label>
            <Input 
              placeholder="e.g., Business Applications" 
              value={formData.assetGroup}
              onChange={(e) => handleInputChange("assetGroup", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Asset Group No.</Label>
            <Input 
              placeholder="e.g., AG-001" 
              value={formData.assetGroupNo}
              onChange={(e) => handleInputChange("assetGroupNo", e.target.value)}
            />
          </div>
          <div className="col-span-full space-y-1.5">
            <Label>Description</Label>
            <Textarea 
              placeholder="Describe the asset..." 
              rows={3} 
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Department </Label>
            <Select 
              value={formData.department}
              onValueChange={(value) => handleInputChange("department", value)}
            >
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {masterDepartments.map(d => <SelectItem key={d.id} value={d.name}>{d.name} ({d.code})</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Location </Label>
            <Select 
              value={formData.location}
              onValueChange={(value) => handleInputChange("location", value)}
            >
              <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
              <SelectContent>
                {locations.map((l: any) => <SelectItem key={l.id || l._id} value={l.name}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Business Criticality</Label>
            <Select 
              value={formData.businessCriticality}
              onValueChange={(value) => handleInputChange("businessCriticality", value)}
            >
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
            <RequiredLabel>Owner</RequiredLabel>
            <Input 
              placeholder="Enter owner name" 
              value={formData.owner}
              onChange={(e) => handleInputChange("owner", e.target.value)}
              onBlur={() => handleBlur("owner")}
              className={errors.owner && touched.owner ? "border-red-500" : ""}
            />
            {errors.owner && touched.owner && <FieldError message={errors.owner} />}
          </div>
          <div className="space-y-1.5">
            <Label>Custodian</Label>
            <Input 
              placeholder="Enter custodian name" 
              value={formData.custodian}
              onChange={(e) => handleInputChange("custodian", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Retention Period </Label>
            <Select 
              value={formData.retentionPeriod}
              onValueChange={(value) => handleInputChange("retentionPeriod", value)}
            >
              <SelectTrigger><SelectValue placeholder="Select retention period" /></SelectTrigger>
              <SelectContent>
                {masterRetentionPeriods.map(r => <SelectItem key={r.id} value={r.name}>{r.name} — {r.description}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Register Review Due On</Label>
            <Input 
              type="date" 
              value={formData.reviewDueDate}
              onChange={(e) => handleInputChange("reviewDueDate", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Name of Person Making Entry</Label>
            <Input 
              placeholder="Enter name" 
              value={formData.entryBy}
              onChange={(e) => handleInputChange("entryBy", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Name of Reviewer</Label>
            <Input 
              placeholder="Enter reviewer name" 
              value={formData.reviewer}
              onChange={(e) => handleInputChange("reviewer", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Date of Review</Label>
            <Input 
              type="date" 
              value={formData.reviewDate}
              onChange={(e) => handleInputChange("reviewDate", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button 
            onClick={handleSave}
            disabled={createAsset.isPending}
            className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {createAsset.isPending ? "Saving..." : "Save Asset"}
          </button>
          <button 
            onClick={handleCancel}
            className="px-6 py-2.5 rounded-md border text-sm font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
