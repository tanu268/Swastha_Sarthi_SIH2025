import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { 
  User, 
  Lock, 
  Mail, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Stethoscope,
  Heart,
  Shield
} from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState("asha");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    workerId: ""
  });

  const roles = [
    { 
      id: "asha", 
      label: "ASHA Worker", 
      icon: Heart,
      description: "Community Health Worker",
      color: "from-accent-cyan to-accent-purple" 
    },
    { 
      id: "doctor", 
      label: "Doctor", 
      icon: Stethoscope,
      description: "Medical Professional",
      color: "from-accent-purple to-accent-coral" 
    },
    { 
      id: "officer", 
      label: "Health Officer", 
      icon: Shield,
      description: "Government Official",
      color: "from-accent-emerald to-accent-cyan" 
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication
    navigate("/dashboard");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="space-y-2">
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
                  Welcome to Swastha Sarthi
                </h1>
                <p className="text-xl text-muted-foreground">
                  Empowering communities through intelligent health monitoring
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: "Community First",
                  description: "Designed for ASHA workers and community health programs"
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description: "Enterprise-grade security with offline sync capabilities"
                },
                {
                  icon: Stethoscope,
                  title: "Expert Support",
                  description: "Real-time collaboration with medical professionals"
                }
              ].map(({ icon: Icon, title, description }, index) => (
                <div 
                  key={title}
                  className="flex items-start space-x-4 p-4 rounded-lg bg-glass-light hover:bg-glass-medium transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="animate-slide-in-right">
            <GlassCard className="max-w-md mx-auto" hover>
              <div className="space-y-6">
                {/* Form Type Toggle */}
                <div className="flex rounded-lg bg-glass-light p-1">
                  <button
                    onClick={() => setFormType("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      formType === "login"
                        ? "bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setFormType("signup")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      formType === "signup"
                        ? "bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Select Your Role</label>
                  <div className="grid gap-2">
                    {roles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-3 rounded-lg border transition-all duration-300 text-left ${
                            selectedRole === role.id
                              ? `bg-gradient-to-r ${role.color} text-white shadow-lg scale-105`
                              : "bg-glass-light text-muted-foreground border-border hover:bg-glass-medium"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="w-5 h-5" />
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs opacity-80">{role.description}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formType === "signup" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="pl-10 bg-glass-light border-border"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-glass-light border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-glass-light border-border"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {formType === "signup" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10 bg-glass-light border-border"
                            required
                          />
                        </div>
                      </div>

                      {selectedRole !== "patient" && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Worker ID (Optional)</label>
                          <Input
                            placeholder="Enter your worker ID"
                            value={formData.workerId}
                            onChange={(e) => handleInputChange("workerId", e.target.value)}
                            className="bg-glass-light border-border"
                          />
                        </div>
                      )}
                    </>
                  )}

                  <Button 
                    type="submit"
                    variant="hero" 
                    className="w-full"
                    size="lg"
                  >
                    {formType === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                {formType === "login" && (
                  <div className="text-center">
                    <button className="text-sm text-accent-cyan hover:text-accent-purple transition-colors">
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}