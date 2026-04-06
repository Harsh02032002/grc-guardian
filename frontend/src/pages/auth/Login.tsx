import { useState } from "react";

import { useNavigate, Link } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { Shield, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { toast } from "@/hooks/use-toast";

import { getDefaultRouteForUser } from "@/lib/access";



export default function Login() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading } = useAuthStore();

  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      await login(email, password);

      const nextUser = useAuthStore.getState().user;

      

      // Block admin users from company login

      if (nextUser?.role === "superadmin" || nextUser?.role === "subadmin") {

        useAuthStore.getState().logout();

        toast({ title: "Admin login alag hai", description: "Admin portal se login karo.", variant: "destructive" });

        return;

      }

      

      toast({ title: "Login successful" });

      navigate(getDefaultRouteForUser(nextUser), { replace: true });

    } catch (err: any) {

      toast({ title: "Login failed", description: err.message, variant: "destructive" });

    }

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">

          <div className="flex justify-center mb-4">

            <div className=" flex items-center justify-center">

            
              
          <img 

            src="/logo.png" 

            alt="ezRisk Management" 

            className="h-10 w-auto"

            onError={(e) => {

              // Fallback if logo.png doesn't exist yet

              const target = e.target as HTMLImageElement;

              target.style.display = 'none';

            }}

          />
            

          

          <p className="text-sm text-muted-foreground mt-1">Company Portal — Sign in to manage your GRC</p>

        </div>



        <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-4 shadow-sm">

          <div className="space-y-2">

            <Label htmlFor="email">Email</Label>

            <div className="relative">

              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />

            </div>

          </div>



          <div className="space-y-2">

            <Label htmlFor="password">Password</Label>

            <div className="relative">

              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" required />

              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">

                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

              </button>

            </div>

          </div>



          <div className="flex justify-between items-center">

            <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>

          </div>



          <Button type="submit" className="w-full" disabled={isLoading}>

            {isLoading ? "Signing in..." : "Sign In"}

          </Button>



          <p className="text-center text-sm text-muted-foreground">

            New company?{" "}

            <Link to="/register" className="text-primary hover:underline font-medium">Register here</Link>

          </p>



          <div className="border-t pt-3 text-center">

            <Link to="/admin/login" className="text-xs text-muted-foreground hover:text-primary">

              Admin Portal Login →

            </Link>

          </div>

        </form>

      </div>

    </div>

  );

}

