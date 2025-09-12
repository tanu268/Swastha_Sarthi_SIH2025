import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  User, 
  Droplets, 
  Thermometer, 
  Heart, 
  Save, 
  Camera,
  Mic,
  MicOff,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";

interface ReportForm {
  village: string;
  reporterName: string;
  reporterRole: string;
  contactNumber: string;
  waterSource: string;
  turbidity: number;
  ph: number;
  symptoms: string[];
  patientCount: number;
  description: string;
  urgency: "low" | "medium" | "high" | "critical";
  coordinates?: { lat: number; lng: number };
  images?: File[];
  audioNote?: Blob;
}

export function Report() {
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState<ReportForm>({
    village: "",
    reporterName: "",
    reporterRole: "asha",
    contactNumber: "",
    waterSource: "well",
    turbidity: 1.0,
    ph: 7.0,
    symptoms: [],
    patientCount: 0,
    description: "",
    urgency: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const symptoms = [
    "Fever", "Diarrhea", "Vomiting", "Stomach Pain", "Skin Rash", 
    "Headache", "Dehydration", "Nausea", "Fatigue", "Joint Pain"
  ];

  const waterSources = [
    { value: "well", label: "Open Well" },
    { value: "tubewell", label: "Tube Well" },
    { value: "stream", label: "Stream/River" },
    { value: "tap", label: "Tap Water" },
    { value: "pond", label: "Pond" },
    { value: "other", label: "Other" }
  ];

  const roles = [
    { value: "asha", label: "ASHA Worker" },
    { value: "volunteer", label: "Community Volunteer" },
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "other", label: "Other" }
  ];

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmitStatus("success");
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setSubmitStatus("idle");
      setFormData({
        village: "",
        reporterName: "",
        reporterRole: "asha",
        contactNumber: "",
        waterSource: "well",
        turbidity: 1.0,
        ph: 7.0,
        symptoms: [],
        patientCount: 0,
        description: "",
        urgency: "medium"
      });
    }, 3000);
  };

  const startRecording = () => {
    setIsRecording(true);
    // Implement audio recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording and save audio
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "from-accent-coral to-accent-yellow";
      case "high": return "from-accent-yellow to-accent-coral";
      case "medium": return "from-accent-cyan to-accent-purple";
      default: return "from-accent-emerald to-accent-cyan";
    }
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <AnimatedBackground />
        <div className="relative z-10 max-w-md mx-auto px-4">
          <GlassCard className="text-center animate-bounce-in" hover>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent-emerald to-accent-cyan flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Report Submitted Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your health report has been received and will be reviewed by our medical team.
            </p>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-glass-light">
                <div className="text-sm text-muted-foreground">Report ID</div>
                <div className="font-mono text-foreground">HSR-{Date.now().toString().slice(-6)}</div>
              </div>
              <Button 
                variant="hero" 
                className="w-full"
                onClick={() => setSubmitStatus("idle")}
              >
                Submit Another Report
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2">Health Report Form</h1>
          <p className="text-muted-foreground">Report health incidents and water quality issues</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reporter Information */}
              <GlassCard className="animate-slide-in-right" hover>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
                  <User className="w-5 h-5 text-accent-cyan" />
                  <span>Reporter Information</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input
                      placeholder="Enter your name"
                      value={formData.reporterName}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
                      className="bg-glass-light border-border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                    <select
                      value={formData.reporterRole}
                      onChange={(e) => setFormData(prev => ({ ...prev, reporterRole: e.target.value }))}
                      className="w-full bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground"
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter mobile number"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                        className="pl-10 bg-glass-light border-border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Village Name</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Enter village name"
                        value={formData.village}
                        onChange={(e) => setFormData(prev => ({ ...prev, village: e.target.value }))}
                        className="pl-10 bg-glass-light border-border"
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  type="button"
                  variant="glass" 
                  size="sm" 
                  onClick={getCurrentLocation}
                  className="mt-4 flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Current Location</span>
                </Button>
              </GlassCard>

              {/* Water Quality Information */}
              <GlassCard className="animate-slide-in-right" style={{ animationDelay: "0.1s" }} hover>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-accent-cyan" />
                  <span>Water Quality Assessment</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Water Source</label>
                    <select
                      value={formData.waterSource}
                      onChange={(e) => setFormData(prev => ({ ...prev, waterSource: e.target.value }))}
                      className="w-full bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground"
                    >
                      {waterSources.map(source => (
                        <option key={source.value} value={source.value}>{source.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Turbidity (NTU)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      value={formData.turbidity}
                      onChange={(e) => setFormData(prev => ({ ...prev, turbidity: parseFloat(e.target.value) || 0 }))}
                      className="bg-glass-light border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">pH Level</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="14"
                      placeholder="7.0"
                      value={formData.ph}
                      onChange={(e) => setFormData(prev => ({ ...prev, ph: parseFloat(e.target.value) || 7 }))}
                      className="bg-glass-light border-border"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <div className={`
                      w-full h-16 rounded-lg bg-gradient-to-r flex items-center justify-center
                      ${formData.turbidity > 5 || formData.ph < 6.5 || formData.ph > 8.5 ? 
                        'from-accent-coral/20 to-accent-yellow/20 border border-accent-coral/30' : 
                        'from-accent-emerald/20 to-accent-cyan/20 border border-accent-emerald/30'}
                    `}>
                      <span className={`text-sm font-medium ${
                        formData.turbidity > 5 || formData.ph < 6.5 || formData.ph > 8.5 ? 
                        'text-accent-coral' : 'text-accent-emerald'
                      }`}>
                        Water Quality: {formData.turbidity > 5 || formData.ph < 6.5 || formData.ph > 8.5 ? 'Poor' : 'Good'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Health Information */}
              <GlassCard className="animate-slide-in-right" style={{ animationDelay: "0.2s" }} hover>
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-accent-coral" />
                  <span>Health Information</span>
                </h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Number of Affected Patients</label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.patientCount}
                        onChange={(e) => setFormData(prev => ({ ...prev, patientCount: parseInt(e.target.value) || 0 }))}
                        className="bg-glass-light border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Urgency Level</label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as any }))}
                        className="w-full bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Reported Symptoms</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {symptoms.map(symptom => (
                        <button
                          key={symptom}
                          type="button"
                          onClick={() => toggleSymptom(symptom)}
                          className={`
                            p-3 rounded-lg text-sm transition-all duration-300 border
                            ${formData.symptoms.includes(symptom) 
                              ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white shadow-lg scale-105 border-accent-cyan' 
                              : 'bg-glass-light text-muted-foreground border-border hover:bg-glass-medium hover:text-foreground'
                            }
                          `}
                        >
                          {symptom}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Additional Description</label>
                    <textarea
                      placeholder="Provide additional details about the health situation..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-glass-light border border-border rounded-lg px-3 py-2 text-foreground min-h-[100px]"
                      rows={4}
                    />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <GlassCard className="animate-fade-in" hover>
                <h3 className="text-lg font-bold text-foreground mb-4">Report Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Village:</span>
                    <span className="text-foreground">{formData.village || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Patients:</span>
                    <span className="text-foreground">{formData.patientCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Symptoms:</span>
                    <span className="text-foreground">{formData.symptoms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Urgency:</span>
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${formData.urgency === 'critical' ? 'bg-gradient-to-r from-accent-coral to-accent-yellow text-white' :
                        formData.urgency === 'high' ? 'bg-gradient-to-r from-accent-yellow to-accent-coral text-white' :
                        formData.urgency === 'medium' ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white' :
                        'bg-gradient-to-r from-accent-emerald to-accent-cyan text-white'}
                    `}>
                      {formData.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Multimedia */}
              <GlassCard hover>
                <h3 className="text-lg font-bold text-foreground mb-4">Attachments</h3>
                <div className="space-y-3">
                  <Button 
                    type="button"
                    variant="glass" 
                    className="w-full justify-start"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photos
                  </Button>
                  <Button 
                    type="button"
                    variant={isRecording ? "warning" : "glass"}
                    className="w-full justify-start"
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                    {isRecording ? "Stop Recording" : "Voice Note"}
                  </Button>
                </div>
              </GlassCard>

              {/* Guidelines */}
              <GlassCard hover>
                <h3 className="text-lg font-bold text-foreground mb-4">Reporting Guidelines</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-accent-coral mt-0.5 flex-shrink-0" />
                    <span>Report immediately for critical symptoms</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Droplets className="w-4 h-4 text-accent-cyan mt-0.5 flex-shrink-0" />
                    <span>Test water quality regularly</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-accent-emerald mt-0.5 flex-shrink-0" />
                    <span>Provide accurate patient count</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-accent-yellow mt-0.5 flex-shrink-0" />
                    <span>Include timeline of symptoms</span>
                  </div>
                </div>
              </GlassCard>

              {/* Submit Button */}
              <Button 
                type="submit"
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting || !formData.village || !formData.reporterName}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Submit Report</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}