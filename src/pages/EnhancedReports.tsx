import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { northeastStates } from "@/data/northeastStates";
import { toast } from "sonner";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  BarChart3, 
  Calendar, 
  Filter,
  TrendingUp,
  Users,
  Droplets,
  AlertTriangle,
  Heart,
  Share2,
  Clock,
  MapPin
} from "lucide-react";

export function EnhancedReports() {
  const [selectedState, setSelectedState] = useState("all");
  const [reportType, setReportType] = useState("summary");
  const [dateRange, setDateRange] = useState("week");
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: "summary", label: "Health Summary", icon: Heart, desc: "Overall health status overview" },
    { id: "water", label: "Water Quality", icon: Droplets, desc: "Water quality analysis and trends" },
    { id: "outbreak", label: "Outbreak Analysis", icon: AlertTriangle, desc: "Disease outbreak tracking" },
    { id: "demographic", label: "Demographics", icon: Users, desc: "Population and health demographics" },
    { id: "trends", label: "Trends Analysis", icon: TrendingUp, desc: "Long-term health trends" }
  ];

  const dateRanges = [
    { id: "week", label: "Last Week" },
    { id: "month", label: "Last Month" },
    { id: "quarter", label: "Last Quarter" },
    { id: "year", label: "Last Year" },
    { id: "custom", label: "Custom Range" }
  ];

  const exportFormats = [
    { id: "pdf", label: "PDF Report", icon: FileText, color: "text-accent-coral" },
    { id: "excel", label: "Excel Spreadsheet", icon: FileSpreadsheet, color: "text-accent-emerald" },
    { id: "csv", label: "CSV Data", icon: Download, color: "text-accent-cyan" }
  ];

  const handleGenerateReport = async (format: string) => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${format.toUpperCase()} report generated successfully!`);
    setIsGenerating(false);
  };

  const recentReports = [
    {
      id: 1,
      title: "Weekly Health Summary - Assam",
      type: "Health Summary",
      date: "2024-01-15",
      size: "2.4 MB",
      format: "PDF"
    },
    {
      id: 2,
      title: "Water Quality Analysis - Northeast",
      type: "Water Quality",
      date: "2024-01-14",
      size: "1.8 MB",
      format: "Excel"
    },
    {
      id: 3,
      title: "Outbreak Tracking - Meghalaya",
      type: "Outbreak Analysis",
      date: "2024-01-13",
      size: "956 KB",
      format: "PDF"
    }
  ];

  const quickStats = [
    { label: "Total Reports", value: "156", icon: FileText, color: "text-accent-cyan" },
    { label: "This Month", value: "23", icon: Calendar, color: "text-accent-purple" },
    { label: "Shared Reports", value: "45", icon: Share2, color: "text-accent-emerald" },
    { label: "Avg. Response Time", value: "2.4h", icon: Clock, color: "text-accent-yellow" }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2">Enhanced Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate comprehensive health reports with advanced analytics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map(({ label, value, icon: Icon, color }, index) => (
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report Generation */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-accent-cyan" />
                <span>Generate Custom Report</span>
              </h3>

              <div className="space-y-6">
                {/* Report Configuration */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="bg-glass-light border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {reportTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="bg-glass-light border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="all">All Northeast States</SelectItem>
                        {northeastStates.map(state => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="bg-glass-light border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {dateRanges.map(range => (
                          <SelectItem key={range.id} value={range.id}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Report Preview */}
                <div className="p-4 rounded-lg bg-glass-light border border-border">
                  <h4 className="font-medium text-foreground mb-3">Report Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-foreground">
                        {reportTypes.find(t => t.id === reportType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground">
                        {selectedState === "all" ? "All Northeast States" : 
                         northeastStates.find(s => s.id === selectedState)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Period:</span>
                      <span className="text-foreground">
                        {dateRanges.find(d => d.id === dateRange)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Size:</span>
                      <span className="text-foreground">~2.3 MB</span>
                    </div>
                  </div>
                </div>

                {/* Export Options */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Export Format</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {exportFormats.map(format => {
                      const Icon = format.icon;
                      return (
                        <Button
                          key={format.id}
                          variant="glass"
                          className="h-auto p-4 flex-col space-y-2"
                          onClick={() => handleGenerateReport(format.id)}
                          disabled={isGenerating}
                        >
                          <Icon className={`w-6 h-6 ${format.color}`} />
                          <span className="text-xs">{format.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Report Types Overview */}
            <GlassCard hover>
              <h3 className="text-xl font-bold text-foreground mb-4">Available Report Types</h3>
              <div className="grid gap-3">
                {reportTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <div 
                      key={type.id}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        reportType === type.id 
                          ? 'bg-accent-cyan/20 border-accent-cyan/30' 
                          : 'bg-glass-light border-border hover:bg-glass-medium'
                      }`}
                      onClick={() => setReportType(type.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-accent-cyan" />
                        <div>
                          <div className="font-medium text-foreground">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Reports */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {recentReports.map(report => (
                  <div 
                    key={report.id} 
                    className="p-3 rounded-lg bg-glass-light border border-border hover:bg-glass-medium transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm mb-1">
                          {report.title}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>{report.type}</div>
                          <div className="flex items-center justify-between">
                            <span>{report.date}</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="minimal" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="glass" className="w-full mt-4">
                View All Reports
              </Button>
            </GlassCard>

            {/* Scheduled Reports */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Scheduled Reports</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-glass-light border border-border">
                  <div className="font-medium text-foreground text-sm">Weekly Health Summary</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Every Monday at 9:00 AM
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-glass-light border border-border">
                  <div className="font-medium text-foreground text-sm">Monthly Water Quality</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    1st of every month
                  </div>
                </div>
              </div>
              
              <Button variant="hero" className="w-full mt-4">
                <Calendar className="w-4 h-4 mr-2" />
                Add Schedule
              </Button>
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard hover>
              <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="glass" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location Analysis
                </Button>
                <Button variant="glass" className="w-full justify-start">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}