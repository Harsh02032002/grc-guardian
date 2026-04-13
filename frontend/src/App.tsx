import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthStore } from "@/stores/authStore";

import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import SetPassword from "@/pages/auth/SetPassword";
import CompanyRegister from "@/pages/auth/CompanyRegister";
import CompanyUserRegister from "@/pages/auth/CompanyUserRegister";
import CompanySuperAdminLogin from "@/pages/auth/CompanySuperAdminLogin";
import CompanySubAdminLogin from "@/pages/auth/CompanySubAdminLogin";
import CompanyUserLogin from "@/pages/auth/CompanyUserLogin";
import OSASuperAdminLogin from "@/pages/auth/OSASuperAdminLogin";
import OSASubAdminLogin from "@/pages/auth/OSASubAdminLogin";
import OSAUserLogin from "@/pages/auth/OSAUserLogin";
import LandingPage from "@/pages/LandingPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAssets from "@/pages/admin/AdminAssets";
import AdminRisks from "@/pages/admin/AdminRisks";
import AdminApproveUsers from "@/pages/admin/AdminApproveUsers";
import AdminCreateSubAdmin from "@/pages/admin/AdminCreateSubAdmin";
import AdminPaymentApproval from "@/pages/admin/AdminPaymentApproval";
import CompanyManagement from "@/pages/admin/CompanyManagement";
import ResourceAllocation from "@/pages/admin/ResourceAllocation";

// App Pages
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
import CompanyUserManagement from "@/pages/CompanyUserManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* OSA User Routes - 3 Types */}
          <Route path="/osa/superadmin/login" element={<OSASuperAdminLogin />} />
          <Route path="/osa/subadmin/login" element={<OSASubAdminLogin />} />
          <Route path="/osa/user/login" element={<OSAUserLogin />} />
          <Route path="/osa/login" element={<OSAUserLogin />} />
          <Route path="/osa/superadmin/register" element={<OSASuperAdminLogin />} />
          <Route path="/osa/subadmin/register" element={<OSASubAdminLogin />} />
          <Route path="/osa/user/register" element={<OSAUserLogin />} />

          {/* Company User Routes - 3 Types */}
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company/superadmin" element={<CompanySuperAdminLogin />} />
          <Route path="/company/superadmin/login" element={<CompanySuperAdminLogin />} />
          <Route path="/company/sub-admin" element={<CompanySubAdminLogin />} />
          <Route path="/company/subadmin/login" element={<CompanySubAdminLogin />} />
          <Route path="/company/user" element={<CompanyUserLogin />} />
          <Route path="/company/user/login" element={<CompanyUserLogin />} />
          <Route path="/company/user/register" element={<CompanyUserRegister />} />
          <Route path="/company/payment-pending" element={<div className="flex items-center justify-center min-h-screen"><div className="text-center p-8 bg-white rounded-lg shadow-lg"><h1 className="text-2xl font-bold mb-4">Payment Pending</h1><p className="text-gray-600 mb-4">Your payment has been received.</p><p className="text-gray-600">Please wait for OSA Super Admin approval.</p><p className="text-sm text-gray-500 mt-4">You will receive an email once approved.</p></div></div>} />

          {/* Admin Routes (superadmin + subadmin) */}
          <Route element={<ProtectedRoute requiredRole={["superadmin", "subadmin"]}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/osa/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/assets" element={<ProtectedRoute requiredModule="assets"><AdminAssets /></ProtectedRoute>} />
            <Route path="/admin/risks" element={<ProtectedRoute requiredModule="risks"><AdminRisks /></ProtectedRoute>} />
            <Route path="/admin/users/approve" element={<AdminApproveUsers />} />
            <Route path="/admin/users/create-subadmin" element={<AdminCreateSubAdmin />} />
            <Route path="/admin/payments" element={<AdminPaymentApproval />} />
            <Route path="/admin/payments/status" element={<AdminPaymentApproval />} />
            <Route path="/admin/payments/history" element={<AdminPaymentApproval />} />
            <Route path="/admin/companies" element={<CompanyManagement />} />
            <Route path="/admin/companies/approve" element={<CompanyManagement />} />
            <Route path="/admin/companies/status" element={<CompanyManagement />} />
            <Route path="/admin/resources/companies" element={<ResourceAllocation />} />
            <Route path="/admin/resources/user-limits" element={<ResourceAllocation />} />
            <Route path="/admin/resources/storage" element={<ResourceAllocation />} />
            <Route path="/admin/users/osa" element={<AdminApproveUsers />} />
            <Route path="/admin/users/client-admins" element={<AdminApproveUsers />} />

            {/* Admin Configuration - reuse same config pages */}
            <Route path="/admin/config/asset-categories" element={<ProtectedRoute requiredModule="configuration"><AssetCategories /></ProtectedRoute>} />
            <Route path="/admin/config/asset-classification" element={<ProtectedRoute requiredModule="configuration"><AssetClassification /></ProtectedRoute>} />
            <Route path="/admin/config/retention-period" element={<ProtectedRoute requiredModule="configuration"><ConfigRetentionPeriod /></ProtectedRoute>} />
            <Route path="/admin/config/department" element={<ProtectedRoute requiredModule="configuration"><ConfigDepartment /></ProtectedRoute>} />
            <Route path="/admin/config/asset-id-format" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetIdFormat /></ProtectedRoute>} />
            <Route path="/admin/config/asset-type" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetType /></ProtectedRoute>} />
            <Route path="/admin/config/location" element={<ProtectedRoute requiredModule="configuration"><ConfigLocation /></ProtectedRoute>} />
            <Route path="/admin/config/impact" element={<ProtectedRoute requiredModule="configuration"><BusinessImpact /></ProtectedRoute>} />
            <Route path="/admin/config/cia-matrix" element={<ProtectedRoute requiredModule="configuration"><CIAMatrixConfig /></ProtectedRoute>} />
            <Route path="/admin/config/risk-owners" element={<ProtectedRoute requiredModule="configuration"><ConfigRiskOwner /></ProtectedRoute>} />
            <Route path="/admin/config/risk-categories" element={<ProtectedRoute requiredModule="configuration"><RiskCategories /></ProtectedRoute>} />
            <Route path="/admin/config/risk-subcategories" element={<ProtectedRoute requiredModule="configuration"><RiskSubcategories /></ProtectedRoute>} />
          </Route>

          {/* Company Client Routes */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<ProtectedRoute requiredModule="dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path="/company/dashboard" element={<ProtectedRoute requiredModule="dashboard"><Dashboard /></ProtectedRoute>} />

          <Route path="/config/asset-categories" element={<ProtectedRoute requiredModule="configuration"><AssetCategories /></ProtectedRoute>} />
          <Route path="/config/asset-classification" element={<ProtectedRoute requiredModule="configuration"><AssetClassification /></ProtectedRoute>} />
          <Route path="/config/retention-period" element={<ProtectedRoute requiredModule="configuration"><ConfigRetentionPeriod /></ProtectedRoute>} />
          <Route path="/config/department" element={<ProtectedRoute requiredModule="configuration"><ConfigDepartment /></ProtectedRoute>} />
          <Route path="/config/asset-id-format" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetIdFormat /></ProtectedRoute>} />
          <Route path="/config/asset-type" element={<ProtectedRoute requiredModule="configuration"><ConfigAssetType /></ProtectedRoute>} />
          <Route path="/config/location" element={<ProtectedRoute requiredModule="configuration"><ConfigLocation /></ProtectedRoute>} />
          <Route path="/config/impact" element={<ProtectedRoute requiredModule="configuration"><BusinessImpact /></ProtectedRoute>} />
          <Route path="/config/cia-matrix" element={<ProtectedRoute requiredModule="configuration"><CIAMatrixConfig /></ProtectedRoute>} />
          <Route path="/company/users" element={<ProtectedRoute requiredRole={["superadmin"]}><CompanyUserManagement /></ProtectedRoute>} />

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
