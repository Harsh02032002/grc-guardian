import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CompanyUserRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.companyName || !form.companyEmail || !form.name || !form.email || !form.password) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/company-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          companyName: form.companyName,
          companyEmail: form.companyEmail,
          companyPhone: form.companyPhone,
          companyAddress: "",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({ title: "✅ Registration Successful", description: "Please complete payment to activate" });
      navigate("/company/payment-pending");
    } catch (err: any) {
      toast({ title: "❌ Registration Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold">Company User Register</h1>
          <p className="text-sm text-muted-foreground">Register your company account</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={form.companyName} 
                onChange={(e) => setForm({...form, companyName: e.target.value})}
                className="pl-10"
                placeholder="Your Company Ltd"
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
            <label className="text-sm font-medium">Your Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                value={form.name} 
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="pl-10"
                placeholder="Full Name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password"
                value={form.password} 
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="pl-10"
                placeholder="Create password"
              />
            </div>
          </div>

          <Button onClick={handleRegister} disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
            {loading ? "Registering..." : "Register & Continue to Payment"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm pt-4 border-t">
            <span className="text-muted-foreground">Already have an account? </span>
            <a href="/company/user/login" className="text-teal-600 hover:underline font-medium">Login here</a>
          </div>

          <div className="text-center text-sm">
            <a href="/" className="text-muted-foreground hover:text-gray-600">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
