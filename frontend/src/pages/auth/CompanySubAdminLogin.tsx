import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Lock, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";

export default function CompanySubAdminLogin() {
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
      navigate("/company/dashboard");
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <UserCog className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">Company Sub-Admin</h1>
          <p className="text-sm text-muted-foreground">Login with assigned modules</p>
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
                placeholder="subadmin@company.com"
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

          <Button onClick={handleLogin} disabled={loading} className="w-full bg-blue-500 hover:bg-blue-600">
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center text-sm">
            <a href="/forgot-password" className="text-blue-500 hover:underline">Forgot password?</a>
          </div>
        </div>
      </div>
    </div>
  );
}
