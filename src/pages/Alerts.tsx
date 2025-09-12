"use client";

import Firebase from "firebase/app";
import { useEffect } from "react";
import { db } from "@/lib/firebase";  // make sure firebase.ts is created
import { ref, onValue } from "firebase/database";
import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { AlertCreationWizard } from "@/components/alerts/AlertCreationWizard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  Send,
  CheckCircle,
  XCircle,
  Bell,
  Heart,
  Droplets,
  TrendingUp,
  Search,
  Filter,
  Plus
} from "lucide-react";

interface Prediction {
  district: string;
  risk_level: string;
  predicted_cases: number;
  timestamp: string;
  water_quality?: number;   // optional
  confidence?: number;      // optional
}

export default function AlertsFirebase() {
  const [alerts, setAlerts] = useState<Prediction[]>([]);

  useEffect(() => {
    const predictionsRef = ref(db, "predictions/");
    onValue(predictionsRef, (snapshot) => {
      const data = snapshot.val();

      // 👇 Debug log to see if Firebase returns anything
      console.log("📢 Raw Firebase Data:", data);

      if (data) {
        const parsed = Object.values(data) as Prediction[];
        setAlerts(parsed.reverse());
      }
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Disease Alerts (Firebase)</h1>
      {alerts.length === 0 ? (
        <p>No alerts yet</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-2xl shadow-md border"
            >
              <h2 className="text-xl font-semibold">{alert.district}</h2>
              <p>
                <span className="font-bold">Risk:</span> {alert.risk_level}
              </p>
              <p>
                <span className="font-bold">Predicted Cases:</span>{" "}
                {alert.predicted_cases}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


interface Alert {
  id: number;
  village: string;
  type: "health" | "water" | "emergency";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  reportedBy: string;
  timestamp: Date;
  status: "active" | "assigned" | "resolved";
  assignedTo?: string;
  symptoms?: string[];
  waterQuality?: number;
  affectedCount?: number;
}

export function Alerts() {
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  /*const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      village: "Nongya",
      type: "health",
      severity: "critical",
      title: "Diarrhea Outbreak",
      description: "Multiple cases of acute diarrhea reported in the village",
      reportedBy: "Priya Sharma (ASHA)",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "active",
      symptoms: ["Diarrhea", "Vomiting", "Fever"],
      affectedCount: 8
    },
    {
      id: 2,
      village: "Bharatpur",
      type: "water",
      severity: "high",
      title: "Water Contamination",
      description: "High turbidity levels detected in main water source",
      reportedBy: "Dr. Rajesh Kumar",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      status: "assigned",
      assignedTo: "Water Testing Team",
      waterQuality: 3.2,
      affectedCount: 950
    },
    {
      id: 3,
      village: "Rampur",
      type: "health",
      severity: "medium",
      title: "Skin Infections",
      description: "Increasing cases of skin infections among children",
      reportedBy: "Sunita Devi (ASHA)",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: "active",
      symptoms: ["Skin Rash", "Itching"],
      affectedCount: 5
    },
    {
      id: 4,
      village: "Khawai",
      type: "emergency",
      severity: "critical",
      title: "Medical Emergency",
      description: "Pregnant woman needs immediate medical attention",
      reportedBy: "Village Head",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "assigned",
      assignedTo: "Dr. Meera Patel",
      affectedCount: 1
    }
  ]);
   */
  const [alerts, setAlerts] = useState<Prediction[]>([]);

  useEffect(() => {
    const predictionsRef = ref(db, "predictions/");
    const unsubscribe = onValue(predictionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.values(data) as Prediction[];
        setAlerts(parsed.reverse());
      }
    });

    return () => unsubscribe();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "health" | "water" | "emergency">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "assigned" | "resolved">("all");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-accent-coral bg-gradient-to-r from-accent-coral/20 to-accent-yellow/20 border-accent-coral/30";
      case "high": return "text-accent-yellow bg-gradient-to-r from-accent-yellow/20 to-accent-coral/20 border-accent-yellow/30";
      case "medium": return "text-accent-cyan bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 border-accent-cyan/30";
      default: return "text-accent-emerald bg-gradient-to-r from-accent-emerald/20 to-accent-cyan/20 border-accent-emerald/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health": return Heart;
      case "water": return Droplets;
      case "emergency": return AlertTriangle;
      default: return Bell;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved": return "text-accent-emerald";
      case "assigned": return "text-accent-cyan";
      default: return "text-accent-yellow";
    }
  };
  /*
    const filteredAlerts = alerts.filter(alert => {
      const matchesSearch = alert.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || alert.type === filterType;
      const matchesStatus = filterStatus === "all" || alert.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
     
  
  
    const handleAssignAlert = (alertId: number) => {
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: "assigned" as const, assignedTo: "Dr. Kumar" }
          : alert
      ));
    };
  
    
    const handleResolveAlert = (alertId: number) => {
      setAlerts(prev => prev.map(alert =>
        alert.id === alertId
          ? { ...alert, status: "resolved" as const }
          : alert
      ));
    };
    */

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.risk_level.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, ignore filterType & filterStatus (since Firebase doesn’t have those)
    return matchesSearch;
  });

  const handleAssignAlert = (idx: number) => {
    setAlerts(prev =>
      prev.map((alert, i) =>
        i === idx ? { ...alert, status: "assigned", assignedTo: "Dr. Kumar" } : alert
      )
    );
  };

  const handleResolveAlert = (idx: number) => {
    setAlerts(prev =>
      prev.map((alert, i) =>
        i === idx ? { ...alert, status: "resolved" } : alert
      )
    );
  };




  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
    return `${diffInHours}h ago`;
  };

  /* const stats = {
     total: alerts.length,
     active: alerts.filter(a => a.status === "active").length,
     critical: alerts.filter(a => a.severity === "critical").length,
     resolved: alerts.filter(a => a.status === "resolved").length
   };
    */
  const stats = {
    total: alerts.length,
    highRisk: alerts.filter(a => a.risk_level === "High").length,
    mediumRisk: alerts.filter(a => a.risk_level === "Medium").length,
    lowRisk: alerts.filter(a => a.risk_level === "Low").length,
  };


  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold gradient-text">Alert Center</h1>
            <p className="text-muted-foreground">Monitor and respond to community health alerts</p>
          </div>

          <div className="flex items-center space-x-3 animate-slide-in-right">
            <Button
              variant="hero"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => setShowCreateWizard(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Create Alert</span>
            </Button>
            <Button
              variant="glass"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => toast.info("Notifications: 5 new updates")}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Alerts", value: stats.total, icon: Bell, color: "text-accent-cyan" },
            { label: "High Risk", value: stats.highRisk, icon: AlertTriangle, color: "text-accent-coral" },
            { label: "Medium Risk", value: stats.mediumRisk, icon: AlertTriangle, color: "text-accent-yellow" },
            { label: "Low Risk", value: stats.lowRisk, icon: CheckCircle, color: "text-accent-emerald" }
          ].map(({ label, value, icon: Icon, color }, index) => (
            <GlassCard
              key={label}
              className="text-center animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              hover
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </GlassCard>
          ))}
        </div>


        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Alert List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Filters */}
            <GlassCard hover>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-glass-light border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground"
                  >
                    <option value="all">All Types</option>
                    <option value="health">Health</option>
                    <option value="water">Water</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="assigned">Assigned</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            {/* Alerts List */}
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <GlassCard
                  key={index}
                  className={`border animate-fade-in ${alert.risk_level === "High"
                      ? "bg-gradient-to-r from-accent-coral/20 to-accent-yellow/20"
                      : alert.risk_level === "Medium"
                        ? "bg-gradient-to-r from-accent-yellow/20 to-accent-cyan/20"
                        : "bg-gradient-to-r from-accent-emerald/20 to-accent-cyan/20"
                    }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  hover
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">

                    {/* Left side: info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-bold text-foreground text-lg">
                        {alert.district}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Predicted Cases: <span className="font-semibold">{alert.predicted_cases}</span>
                      </p>
                      {alert.water_quality !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          Water Quality Index: <span className="font-semibold">{alert.water_quality}</span>
                        </p>
                      )}
                      {alert.confidence !== undefined && (
                        <p className="text-sm text-muted-foreground">
                          Confidence: <span className="font-semibold">{(alert.confidence * 100).toFixed(1)}%</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>

                    {/* Right side: Risk Badge */}
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-bold ${alert.risk_level === "High"
                          ? "bg-accent-coral text-white"
                          : alert.risk_level === "Medium"
                            ? "bg-accent-yellow text-black"
                            : "bg-accent-emerald text-white"
                        }`}
                    >
                      {alert.risk_level}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Response Team */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Response Team</h3>
              <div className="space-y-3">
                {[
                  { name: "Dr. Rajesh Kumar", role: "Senior Doctor", status: "Available", color: "text-accent-emerald" },
                  { name: "Dr. Meera Patel", role: "Pediatrician", status: "On Call", color: "text-accent-cyan" },
                  { name: "Water Testing Team", role: "Quality Control", status: "Available", color: "text-accent-emerald" },
                  { name: "Emergency Response", role: "Ambulance", status: "Standby", color: "text-accent-yellow" }
                ].map(({ name, role, status, color }) => (
                  <div key={name} className="flex justify-between items-center p-2 rounded-lg bg-glass-light">
                    <div>
                      <div className="text-sm font-medium text-foreground">{name}</div>
                      <div className="text-xs text-muted-foreground">{role}</div>
                    </div>
                    <span className={`text-xs ${color}`}>{status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="hero"
                  className="w-full justify-start"
                  onClick={() => toast.success("Broadcasting alert to all channels!")}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Broadcast Alert
                </Button>
                <Button
                  variant="glass"
                  className="w-full justify-start"
                  onClick={() => toast.info("Calling emergency services...")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Emergency
                </Button>
                <Button
                  variant="glass"
                  className="w-full justify-start"
                  onClick={() => toast.success("Medical support team contacted!")}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Medical Support
                </Button>
                <Button
                  variant="glass"
                  className="w-full justify-start"
                  onClick={() => window.open('/reports', '_blank')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </GlassCard>

            {/* Alert Guidelines */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Alert Guidelines</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent-coral/20 to-accent-yellow/20">
                  <div className="font-medium text-accent-coral">Critical (0-30 min)</div>
                  <div>Immediate medical emergency</div>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent-yellow/20 to-accent-coral/20">
                  <div className="font-medium text-accent-yellow">High (1-2 hours)</div>
                  <div>Potential outbreak or contamination</div>
                </div>
                <div className="p-2 rounded-lg bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20">
                  <div className="font-medium text-accent-cyan">Medium (4-8 hours)</div>
                  <div>Requires medical attention</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Alert Creation Wizard */}
      {showCreateWizard && (
        <AlertCreationWizard
          onClose={() => setShowCreateWizard(false)}
          onSubmit={(newAlert) => {
            setAlerts(prev => [newAlert, ...prev]);
            setShowCreateWizard(false);
          }}
        />
      )}
    </div>
  );
}