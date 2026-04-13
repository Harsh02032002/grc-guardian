import { useState, useEffect } from "react";
import { useAuthStore, getAuthHeaders } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, CreditCard, Building2, Calendar, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminPaymentApproval() {
  const { user } = useAuthStore();
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [approvedCompanies, setApprovedCompanies] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const fetchPayments = async () => {
    const headers = { ...getAuthHeaders(), "Content-Type": "application/json" };
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/payments/pending`, { headers }),
        fetch(`${API_BASE_URL}/admin/companies/approved`, { headers }),
      ]);
      if (pendingRes.ok) setPendingPayments(await pendingRes.json());
      if (approvedRes.ok) setApprovedCompanies(await approvedRes.json());
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchPayments(); }, []);

  const approvePayment = async (companyId: string, paymentId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/payments/${paymentId}/approve`, {
        method: "PATCH",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, approved: true }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      toast({ title: "Payment approved", description: "Company can now access the system" });
      fetchPayments();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const rejectPayment = async (paymentId: string) => {
    if (!confirm("Reject this payment?")) return;
    try {
      await fetch(`${API_BASE_URL}/admin/payments/${paymentId}/reject`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      toast({ title: "Payment rejected" });
      fetchPayments();
    } catch { /* ignore */ }
  };

  return (
    <div className="page-container">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Payment Approvals</h1>
          <p className="page-subtitle">Approve company registrations after payment verification</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "pending" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >
          <CreditCard className="h-4 w-4 inline mr-2" />
          Pending Payments ({pendingPayments.length})
        </button>
        <button 
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "approved" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
        >
          <CheckCircle className="h-4 w-4 inline mr-2" />
          Approved Companies ({approvedCompanies.length})
        </button>
      </div>

      {/* Pending Payments */}
      {activeTab === "pending" && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Companies Waiting for Approval</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Transaction ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingPayments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      {payment.companyId?.name}
                    </div>
                  </td>
                  <td>{payment.companyId?.email}</td>
                  <td>
                    <span className="font-semibold text-success">${payment.amount}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar className="h-3 w-3" />
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="font-mono text-xs">{payment.transactionId || "N/A"}</td>
                  <td>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => approvePayment(payment.companyId?._id, payment._id)}>
                        <CheckCircle className="h-4 w-4 text-success mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => rejectPayment(payment._id)}>
                        <XCircle className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingPayments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No pending payments</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Approved Companies */}
      {activeTab === "approved" && (
        <div className="stat-card">
          <h3 className="text-sm font-semibold mb-4">Approved & Active Companies</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Approved On</th>
                <th>Super Admin</th>
              </tr>
            </thead>
            <tbody>
              {approvedCompanies.map((company) => (
                <tr key={company._id}>
                  <td className="font-medium">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-success" />
                      {company.name}
                    </div>
                  </td>
                  <td>{company.email}</td>
                  <td>{company.phone || "—"}</td>
                  <td>
                    <span className="status-badge status-active">
                      <CheckCircle className="h-3 w-3 mr-1" /> Active
                    </span>
                  </td>
                  <td className="text-xs">{new Date(company.approvedAt).toLocaleDateString()}</td>
                  <td>{company.superAdmin?.name || "—"}</td>
                </tr>
              ))}
              {approvedCompanies.length === 0 && (
                <tr><td colSpan={6} className="text-center text-muted-foreground py-8">No approved companies yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
