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
            <Route path="/assets" element={<AssetRegister />} />
            <Route path="/assets/add" element={<AddAsset />} />
            <Route path="/assets/categories" element={<AssetCategories />} />
            <Route path="/assets/classification" element={<AssetClassification />} />
            <Route path="/risks" element={<RiskRegister />} />
            <Route path="/risks/add" element={<AddRisk />} />
            <Route path="/risks/categories" element={<RiskCategories />} />
            <Route path="/risks/subcategories" element={<RiskSubcategories />} />
            <Route path="/risks/library" element={<RiskLibrary />} />
            <Route path="/controls" element={<ControlsRegister />} />
            <Route path="/controls/add" element={<AddControl />} />
            <Route path="/treatments" element={<TreatmentRegister />} />
            <Route path="/treatments/add" element={<AddTreatment />} />
            <Route path="/config/impact" element={<BusinessImpact />} />
            <Route path="/config/cia-matrix" element={<CIAMatrixConfig />} />
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
