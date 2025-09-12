"use client";

import DashboardAlerts from "../components/DashboardAlerts";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { RiskHeatmap } from "@/components/heatmap/RiskHeatmap";
import { SimpleVoiceController } from "@/components/voice/SimpleVoiceController";
import { Button } from "@/components/ui/button";
import { northeastStates } from "@/data/northeastStates";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Activity,
  Droplets,
  Heart,
  Download,
  RefreshCw,
  Send,
  UserCheck
} from "lucide-react";


export default function DashboardPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: Alerts Section */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-4">Live Alerts</h1>

        {/* 🔥 Firebase-powered alerts */}
        <DashboardAlerts />
      </div>

      {/* Right: Sidebar */}
      <div className="col-span-1">
        {/* Keep your existing widgets (Response Team, Quick Actions, etc.) */}
      </div>
    </div>
  );
}


interface VillageData {
  id: number;
  name: string;
  x: number;
  y: number;
  cases: number;
  status: "low" | "medium" | "high";
  waterQuality: number;
  population: number;
}

export function Dashboard() {
  const { t } = useTranslation();
  const [villages, setVillages] = useState<VillageData[]>([
    { id: 1, name: "Rampur", x: 18, y: 30, cases: 2, status: "low", waterQuality: 7.2, population: 1250 },
    { id: 2, name: "Nongya", x: 42, y: 50, cases: 8, status: "high", waterQuality: 4.1, population: 890 },
    { id: 3, name: "Khawai", x: 65, y: 20, cases: 1, status: "low", waterQuality: 8.5, population: 2100 },
    { id: 4, name: "Mela", x: 75, y: 70, cases: 5, status: "medium", waterQuality: 5.8, population: 1680 },
    { id: 5, name: "Bharatpur", x: 25, y: 80, cases: 12, status: "high", waterQuality: 3.2, population: 950 },
  ]);

  const [stats, setStats] = useState({
    totalReports: 0,
    hotVillages: 0,
    doctorsOnline: 4,
    alertsActive: 0,
    totalPopulation: 0,
    avgWaterQuality: 0
  });

  useEffect(() => {
    updateStats();
  }, [villages]);

  const updateStats = () => {
    const totalReports = villages.reduce((sum, v) => sum + v.cases, 0);
    const hotVillages = villages.filter(v => v.status === "high").length;
    const alertsActive = villages.filter(v => v.status === "high" || v.waterQuality < 5).length;
    const totalPopulation = villages.reduce((sum, v) => sum + v.population, 0);
    const avgWaterQuality = villages.reduce((sum, v) => sum + v.waterQuality, 0) / villages.length;

    setStats({
      totalReports,
      hotVillages,
      doctorsOnline: 4,
      alertsActive,
      totalPopulation,
      avgWaterQuality: Number(avgWaterQuality.toFixed(1))
    });
  };

  const getStatusColor = (status: string, waterQuality?: number) => {
    if (waterQuality && waterQuality < 5) return "text-accent-coral";
    if (status === "high") return "text-accent-coral";
    if (status === "medium") return "text-accent-yellow";
    return "text-accent-emerald";
  };

  const refreshData = () => {
    // Simulate real-time updates
    setVillages(prev => prev.map(village => ({
      ...village,
      cases: village.cases + Math.floor(Math.random() * 2),
      waterQuality: Math.max(1, village.waterQuality + (Math.random() - 0.5) * 0.5)
    })));
  };

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold gradient-text">{t('dashboard')}</h1>
            <p className="text-muted-foreground">Real-time community health monitoring</p>
          </div>
          
          <div className="flex items-center space-x-3 animate-slide-in-right">
            <SimpleVoiceController 
              onQuickAction={(action) => {
                if (action === 'refresh') refreshData();
              }}
              onRiskQuery={(query) => console.log('Risk query:', query)}
            />
            <Button variant="glass" size="sm" onClick={refreshData} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>{t('refresh_data')}</span>
            </Button>
            <Button variant="minimal" size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>{t('export_report')}</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { 
              label: "Total Reports", 
              value: stats.totalReports, 
              icon: BarChart3, 
              color: "text-accent-cyan",
              bgColor: "from-accent-cyan/20 to-accent-purple/20"
            },
            { 
              label: "Hot Villages", 
              value: stats.hotVillages, 
              icon: AlertTriangle, 
              color: "text-accent-coral",
              bgColor: "from-accent-coral/20 to-accent-yellow/20"
            },
            { 
              label: "Doctors Online", 
              value: stats.doctorsOnline, 
              icon: Heart, 
              color: "text-accent-emerald",
              bgColor: "from-accent-emerald/20 to-accent-cyan/20"
            },
            { 
              label: "Active Alerts", 
              value: stats.alertsActive, 
              icon: Activity, 
              color: "text-accent-yellow",
              bgColor: "from-accent-yellow/20 to-accent-coral/20"
            },
            { 
              label: "Population", 
              value: `${(stats.totalPopulation / 1000).toFixed(1)}k`, 
              icon: Users, 
              color: "text-accent-purple",
              bgColor: "from-accent-purple/20 to-accent-coral/20"
            },
            { 
              label: "Water Quality", 
              value: stats.avgWaterQuality, 
              icon: Droplets, 
              color: "text-accent-cyan",
              bgColor: "from-accent-cyan/20 to-accent-emerald/20"
            }
          ].map(({ label, value, icon: Icon, color, bgColor }, index) => (
            <GlassCard 
              key={label} 
              className={`text-center animate-bounce-in bg-gradient-to-br ${bgColor}`}
              style={{ animationDelay: `${index * 0.1}s` }}
              hover
            >
              <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
              <div className="text-2xl font-bold text-foreground">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Risk Prediction Heatmap */}
          <div className="lg:col-span-2 space-y-6">
            <RiskHeatmap onStateSelect={(stateName, riskData) => {
              console.log('Selected state:', stateName, riskData);
            }} />
            
            {/* Outbreak Trend Chart */}
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-4">Outbreak Trend</h3>
              <div className="h-64 flex items-end justify-around space-x-2">
                {villages.map((village, index) => (
                  <div key={village.id} className="flex flex-col items-center space-y-2">
                    <div 
                      className={`
                        w-12 rounded-t-lg transition-all duration-1000 animate-bounce-in
                        ${village.cases > 5 ? 'bg-gradient-to-t from-accent-coral to-accent-yellow' : 
                          village.cases > 2 ? 'bg-gradient-to-t from-accent-yellow to-accent-emerald' : 
                          'bg-gradient-to-t from-accent-emerald to-accent-cyan'}
                      `}
                      style={{ 
                        height: `${Math.max(20, (village.cases / 15) * 200)}px`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                    <div className="text-xs text-muted-foreground text-center">
                      <div className="font-medium">{village.name}</div>
                      <div>{village.cases}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alert Panel */}
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-4">Active Alerts</h3>
              <div className="space-y-3">
                {villages
                  .filter(v => v.status === "high" || v.waterQuality < 5)
                  .map((village) => (
                    <div 
                      key={village.id} 
                      className="p-3 rounded-lg bg-gradient-to-r from-accent-coral/20 to-accent-yellow/20 border border-accent-coral/30 animate-fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-foreground flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-accent-coral" />
                            <span>{village.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {village.cases} cases • Water: {village.waterQuality}
                          </div>
                        </div>
                        <Button variant="minimal" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="hero" 
                  className="w-full justify-start"
                  onClick={() => toast.success("Alert sent to all health workers!")}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Alert
                </Button>
                <Button 
                  variant="success" 
                  className="w-full justify-start"
                  onClick={() => toast.success("Doctor assigned to critical areas!")}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Assign Doctor
                </Button>
                <Button 
                  variant="glass" 
                  className="w-full justify-start"
                  onClick={() => toast.success("Report generation started!")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button 
                  variant="glass" 
                  className="w-full justify-start"
                  onClick={() => window.open('/reports', '_blank')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </GlassCard>

            {/* System Status */}
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-4">System Status</h3>
              <div className="space-y-3">
                {[
                  { label: "Data Sync", status: "Online", color: "text-accent-emerald" },
                  { label: "SMS Gateway", status: "Active", color: "text-accent-emerald" },
                  { label: "Weather API", status: "Connected", color: "text-accent-emerald" },
                  { label: "Backup Status", status: "Updated", color: "text-accent-cyan" }
                ].map(({ label, status, color }) => (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`text-sm font-medium ${color}`}>{status}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}