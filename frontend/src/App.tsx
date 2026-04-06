import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import AdminPanel from "@/pages/admin/AdminPanel";
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
import ConfigRiskOwner from "@/pages/ConfigRiskOwner";

const queryClient = new QueryClient();

function AppContent() {
  const { token, user, hasHydrated, fetchMe } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && token && !user) {
      void fetchMe();
    }
  }, [fetchMe, hasHydrated, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<ProtectedRoute requiredModule="dashboard"><Dashboard /></ProtectedRoute>} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={["superadmin", "subadmin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="/config/asset-categories" element={<ProtectedRoute requiredModule="configuration"><AssetCategories /></ProtectedRoute>} />
          <Route path="/config/asset-classification" element={<ProtectedRoute requiredModule="configuration"><AssetClassification /></ProtectedRoute>} />
          <Route path="/config/retention-period" element={<ProtectedRoute requiredModule="configuration"><ConfigRetentionPeriod /></ProtectedRoute>} />
          <Route path="/config/department" element={<ProtectedRoute requiredModule="configuration"><ConfigDepartment /></ProtectedRoute>} />
          <Route path="/config/asset-id-format" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetIdFormat /></ProtectedRoute>} />
          <Route path="/config/asset-type" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetType /></ProtectedRoute>} />
          <Route path="/config/location" element={<ProtectedRoute requiredModule="configuration"><ConfigLocation /></ProtectedRoute>} />
          <Route path="/config/impact" element={<ProtectedRoute requiredModule="configuration"><BusinessImpact /></ProtectedRoute>} />
          <Route path="/config/cia-matrix" element={<ProtectedRoute requiredModule="configuration"><CIAMatrixConfig /></ProtectedRoute>} />

          <Route path="/assets" element={<ProtectedRoute requiredModule="assets"><AssetRegister /></ProtectedRoute>} />
          <Route path="/assets/add" element={<ProtectedRoute requiredModule="assets"><AddAsset /></ProtectedRoute>} />
          <Route path="/assets/categories" element={<ProtectedRoute requiredModule="configuration"><AssetCategories /></ProtectedRoute>} />
          <Route path="/assets/classification" element={<ProtectedRoute requiredModule="configuration"><AssetClassification /></ProtectedRoute>} />

          <Route path="/risks" element={<ProtectedRoute requiredModule="risks"><RiskRegister /></ProtectedRoute>} />
          <Route path="/risks/add" element={<ProtectedRoute requiredModule="risks"><AddRisk /></ProtectedRoute>} />
          <Route path="/risks/categories" element={<ProtectedRoute requiredModule="configuration"><RiskCategories /></ProtectedRoute>} />
          <Route path="/risks/subcategories" element={<ProtectedRoute requiredModule="configuration"><RiskSubcategories /></ProtectedRoute>} />
          <Route path="/risks/library" element={<ProtectedRoute requiredModule="risks"><RiskLibrary /></ProtectedRoute>} />
          <Route path="/risk-owners" element={<ProtectedRoute requiredModule="configuration"><ConfigRiskOwner /></ProtectedRoute>} />

          <Route path="/controls" element={<ProtectedRoute requiredModule="controls"><ControlsRegister /></ProtectedRoute>} />
          <Route path="/controls/add" element={<ProtectedRoute requiredModule="controls"><AddControl /></ProtectedRoute>} />

          <Route path="/treatments" element={<ProtectedRoute requiredModule="treatments"><TreatmentRegister /></ProtectedRoute>} />
          <Route path="/treatments/add" element={<ProtectedRoute requiredModule="treatments"><AddTreatment /></ProtectedRoute>} />

          <Route path="/audit" element={<ProtectedRoute requiredRole={["superadmin"]}><AuditVersionControl /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute requiredRole={["superadmin"]}><Reports /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
