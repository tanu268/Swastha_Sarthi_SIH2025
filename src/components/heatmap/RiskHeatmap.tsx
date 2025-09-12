import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Zap, Shield, Activity, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/common/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RiskData {
  state: string;
  riskLevel: 'high' | 'medium' | 'low';
  confidence: number;
  factors: string[];
  cases: number;
  waterQuality: number;
  population: number;
}

interface RiskHeatmapProps {
  onStateSelect?: (state: string, riskData: RiskData) => void;
}

export function RiskHeatmap({ onStateSelect }: RiskHeatmapProps) {
  const { t } = useTranslation();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    generateRiskData();
    const interval = setInterval(generateRiskData, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateRiskData = () => {
    const states = [
      'Assam', 'Arunachal Pradesh', 'Manipur', 'Meghalaya', 
      'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'
    ];

    const newRiskData = states.map(state => {
      const cases = Math.floor(Math.random() * 100) + 10;
      const waterQuality = Math.random() * 100;
      const population = Math.floor(Math.random() * 1000000) + 500000;
      
      const riskScore = calculateRiskScore(cases, waterQuality, population);
      
      let riskLevel: 'high' | 'medium' | 'low';
      if (riskScore > 70) riskLevel = 'high';
      else if (riskScore > 40) riskLevel = 'medium';
      else riskLevel = 'low';

      return {
        state,
        riskLevel,
        confidence: Math.floor(Math.random() * 30) + 70,
        factors: getRiskFactors(riskLevel),
        cases,
        waterQuality,
        population
      };
    });

    setRiskData(newRiskData);
    
    const highRiskStates = newRiskData.filter(data => data.riskLevel === 'high');
    if (highRiskStates.length > 0) {
      highRiskStates.forEach(state => {
        toast.error(`High outbreak risk detected in ${state.state}!`, {
          description: `Confidence: ${state.confidence}% - Immediate attention required`,
        });
      });
    }
  };

  const calculateRiskScore = (cases: number, waterQuality: number, population: number) => {
    const caseWeight = (cases / 100) * 40;
    const waterWeight = ((100 - waterQuality) / 100) * 30;
    const populationWeight = (population / 1000000) * 30;
    
    return Math.min(caseWeight + waterWeight + populationWeight, 100);
  };

  const getRiskFactors = (riskLevel: 'high' | 'medium' | 'low') => {
    const allFactors = [
      'High case density', 'Poor water quality', 'Population density',
      'Weather patterns', 'Healthcare capacity', 'Historical trends'
    ];
    
    const factorCount = riskLevel === 'high' ? 4 : riskLevel === 'medium' ? 2 : 1;
    return allFactors.slice(0, factorCount);
  };

  const filteredData = filter === 'all' ? riskData : riskData.filter(data => data.riskLevel === filter);
  
  const riskCounts = {
    high: riskData.filter(d => d.riskLevel === 'high').length,
    medium: riskData.filter(d => d.riskLevel === 'medium').length,
    low: riskData.filter(d => d.riskLevel === 'low').length,
  };

  const handleStateClick = (state: RiskData) => {
    setSelectedState(state.state);
    onStateSelect?.(state.state, state);
  };

  return (
    <div className="space-y-6">
      {/* Risk Overview Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div 
          className={`p-4 cursor-pointer transition-all duration-300 border-2 rounded-lg ${
            filter === 'high' ? 'border-red-500/50 bg-red-500/10' : 'border-red-500/20 hover:border-red-500/40'
          } bg-glass-light`}
          onClick={() => setFilter(filter === 'high' ? 'all' : 'high')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{riskCounts.high}</div>
              <div className="text-sm text-muted-foreground">High Risk</div>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 cursor-pointer transition-all duration-300 border-2 rounded-lg ${
            filter === 'medium' ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-yellow-500/20 hover:border-yellow-500/40'
          } bg-glass-light`}
          onClick={() => setFilter(filter === 'medium' ? 'all' : 'medium')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{riskCounts.medium}</div>
              <div className="text-sm text-muted-foreground">Medium Risk</div>
            </div>
          </div>
        </div>

        <div 
          className={`p-4 cursor-pointer transition-all duration-300 border-2 rounded-lg ${
            filter === 'low' ? 'border-green-500/50 bg-green-500/10' : 'border-green-500/20 hover:border-green-500/40'
          } bg-glass-light`}
          onClick={() => setFilter(filter === 'low' ? 'all' : 'low')}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{riskCounts.low}</div>
              <div className="text-sm text-muted-foreground">Low Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Risk Map */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-primary">Northeast India Risk Assessment</h3>
            {filter !== 'all' && (
              <Badge variant="outline" className="text-xs capitalize">
                Showing: {filter} risk areas
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">Real-time</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilter('all')}
              className={filter !== 'all' ? 'visible' : 'invisible'}
            >
              Show All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {filteredData.map((data) => (
            <div
              key={data.state}
              onClick={() => handleStateClick(data)}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${data.riskLevel === 'high' ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30' : ''}
                ${data.riskLevel === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30' : ''}
                ${data.riskLevel === 'low' ? 'bg-green-500/20 border-green-500/50 hover:bg-green-500/30' : ''}
                ${selectedState === data.state ? 'ring-2 ring-primary/50 scale-105' : 'hover:scale-102'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-1 rounded">
                  {data.riskLevel === 'high' && <AlertTriangle className="w-5 h-5 text-red-400" />}
                  {data.riskLevel === 'medium' && <Zap className="w-5 h-5 text-yellow-400" />}
                  {data.riskLevel === 'low' && <Shield className="w-5 h-5 text-green-400" />}
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-muted-foreground">
                    {data.confidence}%
                  </div>
                  <div className="text-xs text-muted-foreground">confidence</div>
                </div>
              </div>
              
              <h4 className="font-semibold text-sm mb-2 text-foreground">{data.state}</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Cases:</span>
                  <span className="font-medium">{data.cases}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Water Quality:</span>
                  <span className="font-medium">{data.waterQuality.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mt-3">
                <Badge 
                  variant={data.riskLevel === 'high' ? 'destructive' : 
                          data.riskLevel === 'medium' ? 'default' : 'secondary'}
                  className="text-xs w-full justify-center"
                >
                  {data.riskLevel.toUpperCase()} RISK
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No states match the selected risk filter</p>
          </div>
        )}

        {selectedState && (
          <div className="mt-6 p-6 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg">{selectedState} - Detailed Risk Analysis</h4>
              <Button variant="ghost" size="sm" onClick={() => setSelectedState(null)}>
                ✕
              </Button>
            </div>
            
            {(() => {
              const state = riskData.find(d => d.state === selectedState);
              if (!state) return null;
              
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                      Risk Factors
                    </h5>
                    <div className="space-y-2">
                      {state.factors.map((factor, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded bg-background/50">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span className="text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                      Key Metrics
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-sm">Population</span>
                        <span className="font-semibold">{state.population.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-sm">Active Cases</span>
                        <span className="font-semibold text-red-400">{state.cases}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-sm">Water Quality</span>
                        <span className={`font-semibold ${state.waterQuality > 70 ? 'text-green-400' : state.waterQuality > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {state.waterQuality.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded bg-background/50">
                        <span className="text-sm">Risk Confidence</span>
                        <span className="font-semibold text-primary">{state.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </GlassCard>
    </div>
  );
}