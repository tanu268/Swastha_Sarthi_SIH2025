import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { 
  Play, 
  BookOpen, 
  BarChart3, 
  Activity, 
  Users, 
  Shield,
  Globe,
  RefreshCw,
  AlertTriangle,
  Heart
} from "lucide-react";

export function Home() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("asha");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [liveStats, setLiveStats] = useState({
    reportsToday: 0,
    hotVillages: 0,
    doctorsOnline: 4
  });

  const roles = [
    { id: "asha", label: "ASHA Worker", color: "from-accent-cyan to-accent-purple" },
    { id: "doctor", label: "Doctor", color: "from-accent-purple to-accent-coral" },
    { id: "officer", label: "Health Officer", color: "from-accent-emerald to-accent-cyan" }
  ];

  const handleLogin = () => {
    if (email) {
      navigate("/dashboard");
    }
  };

  const startDemo = () => {
    setLiveStats({
      reportsToday: 12,
      hotVillages: 3,
      doctorsOnline: 4
    });
    navigate("/dashboard");
  };

  const refreshStats = () => {
    setLiveStats(prev => ({
      ...prev,
      reportsToday: prev.reportsToday + Math.floor(Math.random() * 3),
      hotVillages: Math.floor(Math.random() * 5)
    }));
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Main Hero Content */}
          <div>
            <GlassCard className="h-full" hover>
              <div className="space-y-5">
                <div className="space-y-3">
                  <h1 className="text-4xl lg:text-6xl font-bold gradient-text animate-fade-in">
                    <span className="block">Swastha Sarthi</span>
                    <span className="block text-2xl lg:text-3xl mt-2 text-muted-foreground">Real-time Community Health</span>
                  </h1>
                  <p className="text-xl lg:text-2xl text-muted-foreground animate-slide-in-right">
                    Monitor water quality, track disease outbreaks, and protect communities 
                    with our intelligent early warning system.
                  </p>
                </div>

                {/* Key Features Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 border border-accent-cyan/20">
                    <div className="text-2xl font-bold text-accent-cyan mb-1">24/7</div>
                    <div className="text-sm text-muted-foreground">Real-time Monitoring</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent-purple/10 to-accent-coral/10 border border-accent-purple/20">
                    <div className="text-2xl font-bold text-accent-purple mb-1">250+</div>
                    <div className="text-sm text-muted-foreground">Villages Connected</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent-emerald/10 to-accent-cyan/10 border border-accent-emerald/20">
                    <div className="text-2xl font-bold text-accent-emerald mb-1">Live</div>
                    <div className="text-sm text-muted-foreground">Health Alerts</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 animate-bounce-in">
                  <Button 
                    variant="hero" 
                    size="xl" 
                    onClick={startDemo}
                    className="flex items-center space-x-3"
                  >
                    <Play className="w-6 h-6" />
                    <span>Try Demo</span>
                  </Button>
                  <Button 
                    variant="glass" 
                    size="xl"
                    onClick={() => navigate("/awareness")}
                    className="flex items-center space-x-3"
                  >
                    <BookOpen className="w-6 h-6" />
                    <span>How it Works</span>
                  </Button>
                </div>

                {/* Language Selector */}
                <div className="flex items-center space-x-4 p-4 rounded-xl bg-glass-light">
                  <Globe className="w-6 h-6 text-accent-cyan" />
                  <span className="text-foreground font-medium">Language:</span>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-glass-medium border border-border rounded-lg px-4 py-2 text-foreground min-w-[150px]"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी</option>
                    <option value="local">Local Language</option>
                  </select>
                </div>

                {/* About Section */}
                <div className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-glass-light to-glass-medium border border-accent-cyan/20">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">About <span className="gradient-text">Swastha Sarthi</span></h3>
                  </div>
                  
                  <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                    <p>
                      <span className="font-semibold text-accent-cyan">Swastha Sarthi</span> is a revolutionary 
                      community health monitoring platform designed specifically for rural India. Our system empowers 
                      ASHA workers, doctors, and health officers with real-time data and AI-powered insights.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-accent-emerald/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Activity className="w-3 h-3 text-accent-emerald" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Smart Detection</div>
                          <div className="text-xs text-muted-foreground">AI-powered early warning system for disease outbreaks</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-accent-purple/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Users className="w-3 h-3 text-accent-purple" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Community Network</div>
                          <div className="text-xs text-muted-foreground">Connecting 250+ villages across multiple states</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-accent-coral/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="w-3 h-3 text-accent-coral" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Secure Platform</div>
                          <div className="text-xs text-muted-foreground">End-to-end encryption for patient data protection</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 rounded-full bg-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BarChart3 className="w-3 h-3 text-accent-cyan" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">Real-time Analytics</div>
                          <div className="text-xs text-muted-foreground">Live dashboards and predictive health insights</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 mt-4 border-t border-border">
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground italic">
                          "स्वास्थ्य सारथी - समुदाय के स्वास्थ्य का संरक्षक"
                        </span>
                        <br />
                        <span className="text-xs text-accent-cyan font-medium">
                          Your trusted companion for community health management
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Enhanced Login & Stats Section */}
          <div className="space-y-6">
            {/* Login Card - Enhanced */}
            <GlassCard className="relative overflow-hidden" hover>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-coral"></div>
              
              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h3>
                  <p className="text-muted-foreground">Sign in to access your health dashboard</p>
                </div>

                {/* Role Selection - Enhanced */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Select Your Role</label>
                  <div className="grid gap-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className={`group p-4 rounded-xl border transition-all duration-300 text-left ${
                          selectedRole === role.id
                            ? `bg-gradient-to-r ${role.color} text-white shadow-xl scale-105 border-white/20`
                            : "bg-glass-light text-muted-foreground border-border hover:bg-glass-medium hover:border-accent-cyan/30 hover:scale-102"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            selectedRole === role.id 
                              ? "bg-white/20" 
                              : "bg-accent-cyan/20 group-hover:bg-accent-cyan/30"
                          }`}>
                            <Activity className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{role.label}</div>
                            <div className="text-xs opacity-80">Community Health Worker</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-glass-light border-border h-12 text-lg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="hero" 
                      className="h-12 text-base font-semibold"
                      onClick={handleLogin}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="glass" 
                      className="h-12 text-base"
                      onClick={() => navigate("/login")}
                    >
                      Sign Up
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      className="text-sm text-accent-cyan hover:text-accent-purple transition-colors"
                      onClick={() => navigate("/login")}
                    >
                      Need help signing in?
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Live Stats - Enhanced */}
            <GlassCard className="relative overflow-hidden" hover>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-emerald to-accent-cyan"></div>
              
              <div className="space-y-4 pt-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-foreground">Live Dashboard</h3>
                  <Button 
                    variant="minimal" 
                    size="sm" 
                    onClick={refreshStats}
                    className="flex items-center space-x-2 hover:bg-accent-cyan/10"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Refresh</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 border border-accent-cyan/20">
                    <div className="text-3xl font-bold text-accent-cyan mb-1">
                      {liveStats.reportsToday}
                    </div>
                    <div className="text-sm text-muted-foreground">Reports Today</div>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-coral/20 to-accent-yellow/20 border border-accent-coral/20">
                    <div className="text-3xl font-bold text-accent-coral mb-1">
                      {liveStats.hotVillages}
                    </div>
                    <div className="text-sm text-muted-foreground">Hot Villages</div>
                  </div>
                </div>

                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-emerald/20 to-accent-cyan/20 border border-accent-emerald/20">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-accent-emerald animate-pulse"></div>
                    <div className="text-2xl font-bold text-accent-emerald">
                      {liveStats.doctorsOnline}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">Doctors Online</div>
                </div>

                {/* Mini alerts section */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Recent Activity</h4>
                  <div className="space-y-2">
                    {[
                      { village: "Nongya", issue: "Water contamination", time: "2h ago", severity: "high" },
                      { village: "Rampur", issue: "Fever cases", time: "4h ago", severity: "medium" }
                    ].map((alert, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-glass-light border border-border hover:bg-glass-medium transition-all duration-300"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-foreground">{alert.village}</div>
                            <div className="text-xs text-muted-foreground">{alert.issue}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Enhanced Feature Grid - Bottom Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Activity, label: "Health Monitoring", value: "Smart AI", color: "from-accent-cyan to-accent-purple" },
            { icon: Users, label: "Community Care", value: "Unified", color: "from-accent-purple to-accent-coral" },
            { icon: Shield, label: "Data Security", value: "Protected", color: "from-accent-emerald to-accent-cyan" },
            { icon: BarChart3, label: "Analytics", value: "Advanced", color: "from-accent-coral to-accent-yellow" }
          ].map(({ icon: Icon, label, value, color }, index) => (
            <div 
              key={label}
              className={`text-center p-6 rounded-xl bg-gradient-to-br ${color} bg-opacity-20 border border-white/10 hover:scale-105 transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Icon className="w-10 h-10 mx-auto mb-3 text-white" />
              <div className="text-sm text-white/80 mb-1">{label}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions - Bottom Section */}
        <GlassCard hover className="mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground text-center">Control Center</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="hero" 
                className="h-14 text-base justify-start"
                onClick={() => navigate("/dashboard")}
              >
                <BarChart3 className="w-6 h-6 mr-3" />
                Open Dashboard
              </Button>
              <Button 
                variant="success" 
                className="h-14 text-base justify-start"
                onClick={() => navigate("/report")}
              >
                <Activity className="w-6 h-6 mr-3" />
                New Health Report
              </Button>
              <Button 
                variant="glass" 
                className="h-14 text-base justify-start"
                onClick={() => navigate("/alerts")}
              >
                <AlertTriangle className="w-6 h-6 mr-3" />
                View Alerts
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center text-muted-foreground text-sm">
          <p>Advanced Health Monitoring System — Swastha Sarthi © 2024</p>
        </div>
      </div>
    </div>
  );
}