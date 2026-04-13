import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCog, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function OSASubAdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Check if OSA Sub Admin
      if (data.user.userType !== "osa" || data.user.role !== "subadmin") {
        throw new Error("Access denied. OSA Sub Admin only.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      toast({ title: "✅ Login Successful", description: `Welcome ${data.user.name}` });
      navigate("/osa/dashboard");
    } catch (err: any) {
      toast({ title: "❌ Login Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserCog className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold">OSA Sub Admin</h1>
          <p className="text-sm text-muted-foreground">Login with assigned modules</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email"
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="pl-10"
                placeholder="subadmin@ezrisk.com"
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
                placeholder="Enter password"
              />
            </div>
          </div>

          <Button onClick={handleLogin} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
            {loading ? "Logging in..." : "Login"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center text-sm pt-4 border-t">
            <span className="text-muted-foreground">No OSA Sub Admin account? </span>
            <a href="/osa/subadmin/register" className="text-indigo-600 hover:underline font-medium">Request Access</a>
          </div>

          <div className="text-center text-sm">
            <a href="/" className="text-muted-foreground hover:text-gray-600">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
