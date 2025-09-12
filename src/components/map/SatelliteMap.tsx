import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { StateData, northeastStates } from '@/data/northeastStates';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Satellite, Map as MapIcon } from 'lucide-react';

interface SatelliteMapProps {
  onStateSelect?: (state: StateData) => void;
}

export function SatelliteMap({ onStateSelect }: SatelliteMapProps) {
  const { t } = useTranslation();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [isSatelliteView, setIsSatelliteView] = useState(true);
  const [isTokenEntered, setIsTokenEntered] = useState(false);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenEntered(true);
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: isSatelliteView ? 'mapbox://styles/mapbox/satellite-v9' : 'mapbox://styles/mapbox/streets-v12',
      center: [92.9376, 26.2006], // Center of Northeast India
      zoom: 6,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add scale control
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    map.current.on('load', () => {
      addStateMarkers();
      addStateBoundaries();
    });
  };

  const addStateMarkers = () => {
    if (!map.current) return;

    northeastStates.forEach((state) => {
      const statusColor = getStatusColor(state.healthStatus);
      
      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = `marker-${state.healthStatus}`;
      markerElement.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${statusColor.bg};
        border: 3px solid ${statusColor.border};
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      `;
      
      // Add state initial
      markerElement.textContent = state.name.charAt(0);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3 min-w-[200px]">
          <h3 class="font-bold text-lg mb-2">${t(state.name.toLowerCase().replace(/\s+/g, '_'))}</h3>
          <div class="space-y-1 text-sm">
            <p><strong>Capital:</strong> ${state.capital}</p>
            <p><strong>Population:</strong> ${state.population.toLocaleString()}</p>
            <p><strong>Health Status:</strong> 
              <span class="px-2 py-1 rounded text-xs" style="background-color: ${statusColor.bg}20; color: ${statusColor.text}">
                ${t(state.healthStatus)}
              </span>
            </p>
            <p><strong>Water Quality:</strong> ${state.waterQuality}/100</p>
            <p><strong>Health Facilities:</strong> ${state.healthFacilities}</p>
            <p><strong>Active Alerts:</strong> ${state.activeAlerts}</p>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([state.coordinates.lng, state.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click handler
      markerElement.addEventListener('click', () => {
        setSelectedState(state);
        onStateSelect?.(state);
      });
    });
  };

  const addStateBoundaries = () => {
    if (!map.current) return;

    // Add a simple boundary visualization
    // In a real implementation, you'd use GeoJSON data for actual state boundaries
    northeastStates.forEach((state) => {
      const statusColor = getStatusColor(state.healthStatus);
      
      // Create a circle around each state as a simple boundary representation
      map.current!.addSource(`state-${state.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [state.coordinates.lng, state.coordinates.lat]
          },
          properties: {}
        }
      });

      map.current!.addLayer({
        id: `state-boundary-${state.id}`,
        type: 'circle',
        source: `state-${state.id}`,
        paint: {
          'circle-radius': 50,
          'circle-color': statusColor.bg,
          'circle-opacity': 0.1,
          'circle-stroke-width': 2,
          'circle-stroke-color': statusColor.border,
          'circle-stroke-opacity': 0.5
        }
      });
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return { bg: '#10b981', border: '#059669', text: '#065f46' };
      case 'moderate':
        return { bg: '#f59e0b', border: '#d97706', text: '#92400e' };
      case 'high':
        return { bg: '#ef4444', border: '#dc2626', text: '#991b1b' };
      case 'critical':
        return { bg: '#dc2626', border: '#b91c1c', text: '#7f1d1d' };
      default:
        return { bg: '#6b7280', border: '#4b5563', text: '#374151' };
    }
  };

  const toggleMapStyle = () => {
    if (!map.current) return;
    
    const newStyle = isSatelliteView ? 'mapbox://styles/mapbox/streets-v12' : 'mapbox://styles/mapbox/satellite-v9';
    setIsSatelliteView(!isSatelliteView);
    
    map.current.setStyle(newStyle);
    
    // Re-add markers after style change
    map.current.once('styledata', () => {
      addStateMarkers();
      addStateBoundaries();
    });
  };

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!isTokenEntered) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <MapPin className="w-12 h-12 mx-auto text-primary" />
        <h3 className="text-xl font-bold text-foreground">{t('northeast_india_map')}</h3>
        <p className="text-muted-foreground">
          To enable the satellite map, please enter your Mapbox public token.
          <br />
          <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            Get your token from Mapbox
          </a>
        </p>
        <div className="flex space-x-2 max-w-md mx-auto">
          <Input
            type="text"
            placeholder="Enter Mapbox public token..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-foreground">{t('northeast_india_map')}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMapStyle}
            className="flex items-center space-x-2"
          >
            {isSatelliteView ? <MapIcon className="w-4 h-4" /> : <Satellite className="w-4 h-4" />}
            <span>{isSatelliteView ? 'Street View' : 'Satellite'}</span>
          </Button>
        </div>
      </div>
      
      <div className="relative">
        <div ref={mapContainer} className="w-full h-[500px] rounded-lg overflow-hidden" />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
          <h4 className="font-semibold text-sm mb-2">{t('legend')}</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span>{t('safe')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>{t('moderate')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{t('high')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span>{t('critical')}</span>
            </div>
          </div>
        </div>
      </div>
      
      {selectedState && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-bold text-lg">{t(selectedState.name.toLowerCase().replace(/\s+/g, '_'))}</h3>
          <p className="text-sm text-muted-foreground">{t('select_state')}</p>
        </div>
      )}
    </div>
  );
}