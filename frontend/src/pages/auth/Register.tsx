import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, Building2, Phone, MapPin, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyAddress: "",
  });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    try {
      const message = await register(form);
      toast({ title: "Registration Successful", description: message });
      navigate("/login");
    } catch (err: any) {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Register Company</h1>
          <p className="text-sm text-muted-foreground mt-1">Create your account & company profile</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground border-b pb-2">Personal Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="name" placeholder="John Doe" value={form.name} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="email" type="email" placeholder="john@company.com" value={form.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-foreground border-b pb-2 pt-2">Company Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Company Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="companyName" placeholder="Acme Corp" value={form.companyName} onChange={handleChange} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Company Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="companyEmail" type="email" placeholder="info@company.com" value={form.companyEmail} onChange={handleChange} className="pl-10" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="companyPhone" placeholder="+1234567890" value={form.companyPhone} onChange={handleChange} className="pl-10" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="companyAddress" placeholder="123 Main St" value={form.companyAddress} onChange={handleChange} className="pl-10" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register Company"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
