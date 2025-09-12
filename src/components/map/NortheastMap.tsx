import { useState } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { northeastStates, getStateColor, StateData } from "@/data/northeastStates";
import { MapPin, Droplets, Users, AlertTriangle, Building2 } from "lucide-react";

interface NortheastMapProps {
  onStateSelect?: (state: StateData) => void;
}

export function NortheastMap({ onStateSelect }: NortheastMapProps) {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateChange = (stateId: string) => {
    setSelectedState(stateId);
    if (stateId !== "all") {
      const state = northeastStates.find(s => s.id === stateId);
      if (state && onStateSelect) {
        onStateSelect(state);
      }
    }
  };

  const filteredStates = selectedState === "all" 
    ? northeastStates 
    : northeastStates.filter(state => state.id === selectedState);

  const getStateStatus = (status: string) => {
    switch (status) {
      case "safe": return { color: "text-accent-emerald", bg: "bg-accent-emerald/20" };
      case "moderate": return { color: "text-accent-cyan", bg: "bg-accent-cyan/20" };
      case "high": return { color: "text-accent-yellow", bg: "bg-accent-yellow/20" };
      case "critical": return { color: "text-accent-coral", bg: "bg-accent-coral/20" };
      default: return { color: "text-muted-foreground", bg: "bg-muted/20" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground">Northeast India Health Map</h3>
            <p className="text-muted-foreground">Monitor health status across 8 states</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger className="w-48 bg-glass-light border-border">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All States</SelectItem>
                {northeastStates.map(state => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Map Visualization */}
      <GlassCard hover>
        <div className="relative h-96 bg-gradient-to-br from-bg-deep to-bg-navy rounded-lg overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`v-${i}`} 
                className="absolute border-l border-border" 
                style={{ left: `${i * 8.33}%`, height: "100%" }}
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={`h-${i}`} 
                className="absolute border-t border-border" 
                style={{ top: `${i * 12.5}%`, width: "100%" }}
              />
            ))}
          </div>

          {/* State Markers */}
          {filteredStates.map((state, index) => {
            const { color, bg } = getStateStatus(state.healthStatus);
            // Convert lat/lng to relative positions on the map
            const x = ((state.coordinates.lng - 88) / (95 - 88)) * 100;
            const y = 100 - ((state.coordinates.lat - 22) / (30 - 22)) * 100;
            
            return (
              <div
                key={state.id}
                className="absolute group cursor-pointer animate-bounce-in"
                style={{ 
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`,
                  animationDelay: `${index * 0.2}s`
                }}
                onMouseEnter={() => setHoveredState(state.id)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleStateChange(state.id)}
              >
                <div className={`
                  w-6 h-6 rounded-full transition-all duration-300 group-hover:scale-150 border-2 border-white/30
                  ${state.healthStatus === 'critical' ? 'bg-accent-coral animate-pulse-glow' : 
                    state.healthStatus === 'high' ? 'bg-accent-yellow' : 
                    state.healthStatus === 'moderate' ? 'bg-accent-cyan' : 'bg-accent-emerald'}
                `}>
                  {state.healthStatus === 'critical' && (
                    <div className="absolute inset-0 rounded-full bg-accent-coral/30 animate-ping"></div>
                  )}
                </div>
                
                {/* State Tooltip */}
                {hoveredState === state.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
                    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-4 text-sm whitespace-nowrap shadow-xl">
                      <div className="font-bold text-foreground text-base">{state.name}</div>
                      <div className="text-muted-foreground mb-2">Capital: {state.capital}</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Status:</span>
                          <span className={`font-medium ${color} capitalize`}>{state.healthStatus}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Water Quality:</span>
                          <span className="font-medium text-foreground">{state.waterQuality}/10</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Population:</span>
                          <span className="font-medium text-foreground">{(state.population / 1000000).toFixed(1)}M</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-muted-foreground">Active Alerts:</span>
                          <span className="font-medium text-accent-coral">{state.activeAlerts}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="text-sm font-medium text-foreground mb-2">Health Status</div>
            <div className="space-y-1">
              {[
                { status: "safe", label: "Safe", color: "bg-accent-emerald" },
                { status: "moderate", label: "Moderate", color: "bg-accent-cyan" },
                { status: "high", label: "High Risk", color: "bg-accent-yellow" },
                { status: "critical", label: "Critical", color: "bg-accent-coral" }
              ].map(({ status, label, color }) => (
                <div key={status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`}></div>
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* State Statistics */}
      {selectedState !== "all" && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredStates.map(state => (
            <GlassCard key={state.id} hover className={getStateStatus(state.healthStatus).bg}>
              <div className="text-center">
                <h4 className="font-bold text-foreground text-lg mb-3">{state.name}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-accent-purple" />
                      <span className="text-sm text-muted-foreground">Population</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {(state.population / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-accent-cyan" />
                      <span className="text-sm text-muted-foreground">Water Quality</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{state.waterQuality}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-accent-emerald" />
                      <span className="text-sm text-muted-foreground">Health Facilities</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{state.healthFacilities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-accent-coral" />
                      <span className="text-sm text-muted-foreground">Active Alerts</span>
                    </div>
                    <span className="text-sm font-medium text-accent-coral">{state.activeAlerts}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}