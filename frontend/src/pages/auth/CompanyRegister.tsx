import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Phone, User, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CompanyRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    paymentAmount: "5000",
    paymentMethod: "razorpay"
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.companyName || !form.companyEmail || !form.adminName || !form.adminEmail || !form.adminPassword) {
      toast({ title: "Error", description: "All fields required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Register Company with Super Admin
      const res = await fetch(`${API_BASE_URL}/auth/company-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Company Super Admin details
          name: form.adminName,
          email: form.adminEmail,
          password: form.adminPassword,
          // Company details
          companyName: form.companyName,
          companyEmail: form.companyEmail,
          companyPhone: form.companyPhone,
          companyAddress: "",
          // Payment details
          paymentAmount: form.paymentAmount,
          paymentMethod: form.paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({ title: "Registration successful", description: "Please complete payment to activate" });
      setStep(2);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    toast({ title: "Loading...", description: "Initializing payment gateway" });
    
    try {
      // Check if Razorpay is already loaded
      if (!(window as any).Razorpay) {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          toast({ title: "Error", description: "Failed to load Razorpay. Please refresh and try again.", variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      // Create order on backend
      const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(form.paymentAmount) * 100,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YourKeyID";
      
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "EzRiskManagement",
        description: "Company Registration Fee",
        order_id: orderData.id,
        handler: async (response: any) => {
          toast({ title: "Processing...", description: "Verifying your payment" });
          
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                companyEmail: form.companyEmail,
                amount: form.paymentAmount,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              toast({ title: "✅ Payment Successful!", description: "Waiting for OSA approval..." });
              setTimeout(() => navigate("/company/payment-pending"), 1500);
            } else {
              toast({ title: "❌ Verification Failed", description: verifyData.error || "Payment could not be verified", variant: "destructive" });
            }
          } catch (verifyErr: any) {
            toast({ title: "❌ Error", description: verifyErr.message || "Payment verification failed", variant: "destructive" });
          }
        },
        prefill: {
          name: form.adminName,
          email: form.adminEmail,
          contact: form.companyPhone,
        },
        theme: {
          color: "#0f766e",
        },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment Cancelled", description: "You can try again anytime" });
            setLoading(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', (response: any) => {
        toast({ title: "❌ Payment Failed", description: response.error.description, variant: "destructive" });
        setLoading(false);
      });
      
      rzp.open();
    } catch (err: any) {
      console.error("Payment Error:", err);
      toast({ title: "❌ Payment Error", description: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <Building2 className="h-12 w-12 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-bold">Company Registration</h1>
          <p className="text-sm text-muted-foreground">Register your company for GRC platform</p>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={form.companyName} 
                  onChange={(e) => setForm({...form, companyName: e.target.value})}
                  className="pl-10"
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email"
                  value={form.companyEmail} 
                  onChange={(e) => setForm({...form, companyEmail: e.target.value})}
                  className="pl-10"
                  placeholder="company@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Company Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={form.companyPhone} 
                  onChange={(e) => setForm({...form, companyPhone: e.target.value})}
                  className="pl-10"
                  placeholder="+91-9876543210"
                />
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-2">
              <label className="text-sm font-medium">Super Admin Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={form.adminName} 
                  onChange={(e) => setForm({...form, adminName: e.target.value})}
                  className="pl-10"
                  placeholder="Full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Super Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email"
                  value={form.adminEmail} 
                  onChange={(e) => setForm({...form, adminEmail: e.target.value})}
                  className="pl-10"
                  placeholder="admin@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  value={form.adminPassword} 
                  onChange={(e) => setForm({...form, adminPassword: e.target.value})}
                  className="pl-10"
                  placeholder="Create password"
                />
              </div>
            </div>

            <Button onClick={handleRegister} disabled={loading} className="w-full">
              {loading ? "Registering..." : "Continue to Payment"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <a href="/company/superadmin" className="text-primary hover:underline">Login</a>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <CreditCard className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Payment Required</h2>
            <p className="text-muted-foreground">Complete payment to activate your company account</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-2xl font-bold">₹{form.paymentAmount}</p>
              <p className="text-sm text-muted-foreground">One-time registration fee</p>
            </div>
            <Button onClick={handlePayment} disabled={loading} className="w-full">
              {loading ? "Processing..." : "Pay Now"}
            </Button>
            <p className="text-xs text-muted-foreground">After payment, OSA admin will approve your account</p>
          </div>
        )}
      </div>
    </div>
  );
}
