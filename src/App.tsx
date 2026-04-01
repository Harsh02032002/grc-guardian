import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import AssetRegister from "@/pages/AssetRegister";
import AddAsset from "@/pages/AddAsset";
import AssetCategories from "@/pages/AssetCategories";
import AssetClassification from "@/pages/AssetClassification";
import RiskRegister from "@/pages/RiskRegister";
import AddRisk from "@/pages/AddRisk";
import RiskCategories from "@/pages/RiskCategories";
import RiskSubcategories from "@/pages/RiskSubcategories";
import RiskLibrary from "@/pages/RiskLibrary";
import ControlsRegister from "@/pages/ControlsRegister";
import AddControl from "@/pages/AddControl";
import TreatmentRegister from "@/pages/TreatmentRegister";
import AddTreatment from "@/pages/AddTreatment";
import BusinessImpact from "@/pages/BusinessImpact";
import CIAMatrixConfig from "@/pages/CIAMatrixConfig";
import AuditVersionControl from "@/pages/AuditVersionControl";
import Reports from "@/pages/Reports";
import NotFound from "@/pages/NotFound";
import ConfigRetentionPeriod from "@/pages/ConfigRetentionPeriod";
import ConfigDepartment from "@/pages/ConfigDepartment";
import ConfigAssetIdFormat from "@/pages/ConfigAssetIdFormat";
import ConfigAssetType from "@/pages/ConfigAssetType";
import ConfigLocation from "@/pages/ConfigLocation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            {/* Configuration / Master Data */}
            <Route path="/config/asset-categories" element={<AssetCategories />} />
            <Route path="/config/asset-classification" element={<AssetClassification />} />
            <Route path="/config/retention-period" element={<ConfigRetentionPeriod />} />
            <Route path="/config/department" element={<ConfigDepartment />} />
            <Route path="/config/asset-id-format" element={<ConfigAssetIdFormat />} />
            <Route path="/config/asset-type" element={<ConfigAssetType />} />
            <Route path="/config/location" element={<ConfigLocation />} />
            <Route path="/config/impact" element={<BusinessImpact />} />
            <Route path="/config/cia-matrix" element={<CIAMatrixConfig />} />
            {/* Asset Management */}
            <Route path="/assets" element={<AssetRegister />} />
            <Route path="/assets/add" element={<AddAsset />} />
            <Route path="/assets/categories" element={<AssetCategories />} />
            <Route path="/assets/classification" element={<AssetClassification />} />
            {/* Risk Management */}
            <Route path="/risks" element={<RiskRegister />} />
            <Route path="/risks/add" element={<AddRisk />} />
            <Route path="/risks/categories" element={<RiskCategories />} />
            <Route path="/risks/subcategories" element={<RiskSubcategories />} />
            <Route path="/risks/library" element={<RiskLibrary />} />
            {/* Controls */}
            <Route path="/controls" element={<ControlsRegister />} />
            <Route path="/controls/add" element={<AddControl />} />
            {/* Treatments */}
            <Route path="/treatments" element={<TreatmentRegister />} />
            <Route path="/treatments/add" element={<AddTreatment />} />
            {/* Audit & Reports */}
            <Route path="/audit" element={<AuditVersionControl />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
