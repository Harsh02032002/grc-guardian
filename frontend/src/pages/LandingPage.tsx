import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  Shield, 
  Users, 
  UserCog, 
  CreditCard,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BarChart3,
  Lock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "OSA Super Admin",
      subtitle: "Platform Owner",
      description: "Manage all companies, payments & OSA users",
      icon: ShieldCheck,
      loginPath: "/osa/superadmin/login",
      registerPath: null,
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      iconColor: "text-rose-600",
      features: ["Full Control", "Approve Companies", "Manage OSA"]
    },
    {
      title: "OSA Sub Admin",
      subtitle: "OSA Manager",
      description: "Limited access to assigned OSA modules",
      icon: UserCog,
      loginPath: "/osa/subadmin/login",
      registerPath: null,
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      iconColor: "text-indigo-600",
      features: ["Assigned Modules", "Reports", "OSA Data"]
    },
    {
      title: "OSA User",
      subtitle: "OSA Team Member",
      description: "For OSA auditors and general users",
      icon: Building2,
      loginPath: "/osa/user/login",
      registerPath: "/osa/user/register",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      iconColor: "text-cyan-600",
      features: ["OSA Assets", "View Only", "Internal Access"]
    },
    {
      title: "Company Super Admin",
      subtitle: "Company Owner",
      description: "Register your company with payment to get full access",
      icon: Shield,
      loginPath: "/company/superadmin/login",
      registerPath: "/company/register",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      features: ["Razorpay Payment", "Full Access", "Create Company"]
    },
    {
      title: "Company Sub Admin",
      subtitle: "Company Manager",
      description: "Access assigned modules in your company",
      icon: Users,
      loginPath: "/company/subadmin/login",
      registerPath: null,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      iconColor: "text-violet-600",
      features: ["Limited Access", "View Data", "Reports"]
    },
    {
      title: "Company User",
      subtitle: "Auditor / Auditee / Staff",
      description: "Register your company or login as user",
      icon: CreditCard,
      loginPath: "/company/user/login",
      registerPath: "/company/user/register",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
      features: ["New Company", "Audit Access", "View Only"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  EzRiskManagement
                </h1>
                <p className="text-xs text-slate-500">GRC & Asset Management Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Secure & Certified</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Welcome to EzRiskManagement</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Select Your <span className="text-primary">Portal</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Choose your access level to manage risk, assets, and compliance. 
              Secure, scalable, and user-friendly.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl border-2 ${card.borderColor} p-6
                  transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1`}
              >
                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 
                  transition-opacity duration-300 rounded-2xl pointer-events-none`} />
                
                {/* Icon */}
                <div className={`h-14 w-14 ${card.bgColor} rounded-xl flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-7 w-7 ${card.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className={`text-sm font-medium ${card.iconColor} mb-2`}>
                  {card.subtitle}
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  {card.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.features.map((feature, i) => (
                    <span key={i} className={`text-xs px-2 py-1 ${card.bgColor} ${card.iconColor} rounded-md font-medium`}>
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 relative z-10">
                  <Button 
                    onClick={() => navigate(card.loginPath)}
                    className={`flex-1 bg-gradient-to-r ${card.color} text-white hover:opacity-90`}
                    size="sm"
                  >
                    Login
                  </Button>
                  {card.registerPath && (
                    <Button 
                      onClick={() => navigate(card.registerPath)}
                      variant="outline"
                      className={`flex-1 ${card.borderColor} ${card.iconColor} hover:${card.bgColor}`}
                      size="sm"
                    >
                      Register
                    </Button>
                  )}
                </div>

                {/* Corner Decoration */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} 
                  opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-tr-2xl rounded-bl-full pointer-events-none`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-slate-800">Risk Analytics</h4>
              <p className="text-xs text-slate-500 mt-1">Real-time insights</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-slate-800">Secure Access</h4>
              <p className="text-xs text-slate-500 mt-1">Role-based control</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-slate-800">Compliance</h4>
              <p className="text-xs text-slate-500 mt-1">Audit ready</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-slate-800">Certified</h4>
              <p className="text-xs text-slate-500 mt-1">ISO 27001</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">EzRiskManagement</span>
            </div>
            <p className="text-sm text-slate-400">
              © 2024 EzRiskManagement. All rights reserved. | GRC & Asset Management Platform
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Help</span>
              <span>Privacy</span>
              <span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
