import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

export default function OSAUserLogin() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast({ title: "Error", description: "Email and password required", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Login successful" });
      navigate("/osa/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500/5 to-purple-500/10 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Building2 className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold">OSA User Login</h1>
          <p className="text-sm text-muted-foreground">For OSA Super Admin, Sub-Admin, Auditors</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="user@osa.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                placeholder="Enter password"
              />
            </div>
          </div>

          <Button onClick={handleLogin} disabled={loading} className="w-full bg-purple-500 hover:bg-purple-600">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center space-y-2 pt-4 border-t">
            <span className="text-muted-foreground">No OSA User account? </span>
            <a href="/osa/user/register" className="text-purple-500 hover:underline font-medium">Register here</a>
          </div>

          <div className="text-center space-y-2">
            <a href="/forgot-password" className="text-sm text-purple-500 hover:underline block">Forgot password?</a>
            <p className="text-xs text-muted-foreground mt-4">
              Or contact OSA Super Admin for access.
            </p>
          </div>

          <div className="text-center text-sm">
            <a href="/" className="text-muted-foreground hover:text-gray-600">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
