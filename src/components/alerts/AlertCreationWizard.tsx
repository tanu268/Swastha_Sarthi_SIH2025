import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlassCard } from "@/components/common/GlassCard";
import { 
  AlertTriangle, 
  Heart, 
  Droplets, 
  MapPin, 
  User, 
  Phone, 
  Clock,
  Send,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { northeastStates } from "@/data/northeastStates";
import { toast } from "sonner";

interface AlertWizardProps {
  onClose: () => void;
  onSubmit: (alert: any) => void;
}

export function AlertCreationWizard({ onClose, onSubmit }: AlertWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [alertData, setAlertData] = useState({
    type: "",
    severity: "",
    title: "",
    description: "",
    location: {
      state: "",
      district: ""
    },
    reporter: {
      name: "",
      role: "",
      phone: ""
    },
    affectedCount: "",
    symptoms: [] as string[],
    waterQuality: "",
    priority: "normal"
  });

  const steps = [
    { id: 1, title: "Alert Type", icon: AlertTriangle },
    { id: 2, title: "Location", icon: MapPin },
    { id: 3, title: "Details", icon: Heart },
    { id: 4, title: "Reporter Info", icon: User },
    { id: 5, title: "Review", icon: CheckCircle }
  ];

  const alertTypes = [
    { id: "health", label: "Health Emergency", icon: Heart, color: "text-accent-coral" },
    { id: "water", label: "Water Quality", icon: Droplets, color: "text-accent-cyan" },
    { id: "emergency", label: "Medical Emergency", icon: AlertTriangle, color: "text-accent-yellow" }
  ];

  const severityLevels = [
    { id: "low", label: "Low", color: "text-accent-emerald", desc: "Minor issue, routine care" },
    { id: "medium", label: "Medium", color: "text-accent-cyan", desc: "Attention needed, monitor" },
    { id: "high", label: "High", color: "text-accent-yellow", desc: "Urgent care required" },
    { id: "critical", label: "Critical", color: "text-accent-coral", desc: "Immediate emergency response" }
  ];

  const commonSymptoms = [
    "Fever", "Diarrhea", "Vomiting", "Skin Rash", "Cough", 
    "Headache", "Stomach Pain", "Nausea", "Weakness", "Dehydration"
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const newAlert = {
      ...alertData,
      id: Date.now(),
      timestamp: new Date(),
      status: "active"
    };
    
    onSubmit(newAlert);
    toast.success("Alert created successfully!");
    onClose();
  };

  const toggleSymptom = (symptom: string) => {
    setAlertData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const selectedState = northeastStates.find(s => s.id === alertData.location.state);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Create Alert</h2>
            <Button variant="minimal" size="icon" onClick={onClose}>
              ×
            </Button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isCompleted ? 'bg-accent-emerald border-accent-emerald text-white' :
                      isActive ? 'bg-accent-cyan border-accent-cyan text-white' :
                      'border-border text-muted-foreground'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      isCompleted ? 'bg-accent-emerald' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Alert Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Alert Type</h3>
                <div className="grid gap-3">
                  {alertTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        variant={alertData.type === type.id ? "hero" : "glass"}
                        className="h-auto p-4 justify-start"
                        onClick={() => setAlertData(prev => ({ ...prev, type: type.id }))}
                      >
                        <Icon className={`w-5 h-5 mr-3 ${type.color}`} />
                        <span>{type.label}</span>
                      </Button>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Severity Level</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {severityLevels.map(severity => (
                      <Button
                        key={severity.id}
                        variant={alertData.severity === severity.id ? "hero" : "glass"}
                        className="h-auto p-3 flex-col items-start"
                        onClick={() => setAlertData(prev => ({ ...prev, severity: severity.id }))}
                      >
                        <span className={`font-medium ${severity.color}`}>{severity.label}</span>
                        <span className="text-xs text-muted-foreground">{severity.desc}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Select Location</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">State</label>
                    <Select 
                      value={alertData.location.state} 
                      onValueChange={(value) => setAlertData(prev => ({
                        ...prev,
                        location: { ...prev.location, state: value, district: "" }
                      }))}
                    >
                      <SelectTrigger className="bg-glass-light border-border">
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        {northeastStates.map(state => (
                          <SelectItem key={state.id} value={state.id}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedState && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">District</label>
                      <Select 
                        value={alertData.location.district} 
                        onValueChange={(value) => setAlertData(prev => ({
                          ...prev,
                          location: { ...prev.location, district: value }
                        }))}
                      >
                        <SelectTrigger className="bg-glass-light border-border">
                          <SelectValue placeholder="Select District" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-border">
                          {selectedState.districts.map(district => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Alert Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Alert Title</label>
                    <Input
                      placeholder="Brief description of the alert"
                      value={alertData.title}
                      onChange={(e) => setAlertData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-glass-light border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                    <Textarea
                      placeholder="Detailed description of the situation"
                      value={alertData.description}
                      onChange={(e) => setAlertData(prev => ({ ...prev, description: e.target.value }))}
                      className="bg-glass-light border-border min-h-24"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Affected Count</label>
                    <Input
                      type="number"
                      placeholder="Number of people affected"
                      value={alertData.affectedCount}
                      onChange={(e) => setAlertData(prev => ({ ...prev, affectedCount: e.target.value }))}
                      className="bg-glass-light border-border"
                    />
                  </div>

                  {alertData.type === "health" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Symptoms</label>
                      <div className="grid grid-cols-2 gap-2">
                        {commonSymptoms.map(symptom => (
                          <Button
                            key={symptom}
                            variant={alertData.symptoms.includes(symptom) ? "hero" : "glass"}
                            size="sm"
                            onClick={() => toggleSymptom(symptom)}
                          >
                            {symptom}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {alertData.type === "water" && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Water Quality (1-10)</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="Water quality rating"
                        value={alertData.waterQuality}
                        onChange={(e) => setAlertData(prev => ({ ...prev, waterQuality: e.target.value }))}
                        className="bg-glass-light border-border"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Reporter Info */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Reporter Information</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                    <Input
                      placeholder="Reporter's name"
                      value={alertData.reporter.name}
                      onChange={(e) => setAlertData(prev => ({
                        ...prev,
                        reporter: { ...prev.reporter, name: e.target.value }
                      }))}
                      className="bg-glass-light border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                    <Select 
                      value={alertData.reporter.role} 
                      onValueChange={(value) => setAlertData(prev => ({
                        ...prev,
                        reporter: { ...prev.reporter, role: value }
                      }))}
                    >
                      <SelectTrigger className="bg-glass-light border-border">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border">
                        <SelectItem value="asha">ASHA Worker</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="village-head">Village Head</SelectItem>
                        <SelectItem value="citizen">Citizen</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                    <Input
                      placeholder="Contact number"
                      value={alertData.reporter.phone}
                      onChange={(e) => setAlertData(prev => ({
                        ...prev,
                        reporter: { ...prev.reporter, phone: e.target.value }
                      }))}
                      className="bg-glass-light border-border"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Review Alert</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-glass-light border border-border">
                    <h4 className="font-medium text-foreground mb-2">Alert Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="text-foreground capitalize">{alertData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Severity:</span>
                        <span className="text-foreground capitalize">{alertData.severity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="text-foreground">
                          {selectedState?.name}, {selectedState?.districts.find(d => d.id === alertData.location.district)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Affected:</span>
                        <span className="text-foreground">{alertData.affectedCount} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reporter:</span>
                        <span className="text-foreground">{alertData.reporter.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-glass-light border border-border">
                    <h4 className="font-medium text-foreground mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{alertData.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="glass"
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < steps.length ? (
              <Button
                variant="hero"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!alertData.type || !alertData.severity)) ||
                  (currentStep === 2 && (!alertData.location.state || !alertData.location.district)) ||
                  (currentStep === 3 && (!alertData.title || !alertData.description)) ||
                  (currentStep === 4 && (!alertData.reporter.name || !alertData.reporter.role))
                }
                className="flex items-center"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmit}
                className="flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}