export interface StateData {
  id: string;
  name: string;
  capital: string;
  coordinates: { lat: number; lng: number };
  population: number;
  healthStatus: "safe" | "moderate" | "high" | "critical";
  waterQuality: number;
  healthFacilities: number;
  activeAlerts: number;
  districts: DistrictData[];
}

export interface DistrictData {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  population: number;
  healthStatus: "safe" | "moderate" | "high" | "critical";
  waterQuality: number;
  cases: number;
  lastUpdated: Date;
}

export const northeastStates: StateData[] = [
  {
    id: "assam",
    name: "Assam",
    capital: "Dispur",
    coordinates: { lat: 26.2006, lng: 92.9376 },
    population: 31169272,
    healthStatus: "moderate",
    waterQuality: 6.8,
    healthFacilities: 45,
    activeAlerts: 8,
    districts: [
      {
        id: "kamrup",
        name: "Kamrup",
        coordinates: { lat: 26.1445, lng: 91.7362 },
        population: 1517542,
        healthStatus: "moderate",
        waterQuality: 6.5,
        cases: 23,
        lastUpdated: new Date()
      },
      {
        id: "darrang",
        name: "Darrang",
        coordinates: { lat: 26.7542, lng: 92.0281 },
        population: 928500,
        healthStatus: "high",
        waterQuality: 4.2,
        cases: 45,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "arunachal",
    name: "Arunachal Pradesh",
    capital: "Itanagar",
    coordinates: { lat: 28.2180, lng: 94.7278 },
    population: 1382611,
    healthStatus: "safe",
    waterQuality: 8.2,
    healthFacilities: 12,
    activeAlerts: 2,
    districts: [
      {
        id: "papumpare",
        name: "Papum Pare",
        coordinates: { lat: 27.1048, lng: 93.6055 },
        population: 176573,
        healthStatus: "safe",
        waterQuality: 8.5,
        cases: 3,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "manipur",
    name: "Manipur",
    capital: "Imphal",
    coordinates: { lat: 24.6637, lng: 93.9063 },
    population: 2855794,
    healthStatus: "moderate",
    waterQuality: 7.1,
    healthFacilities: 18,
    activeAlerts: 5,
    districts: [
      {
        id: "imphal-west",
        name: "Imphal West",
        coordinates: { lat: 24.7570, lng: 93.9063 },
        population: 517992,
        healthStatus: "moderate",
        waterQuality: 7.0,
        cases: 18,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "meghalaya",
    name: "Meghalaya",
    capital: "Shillong",
    coordinates: { lat: 25.4670, lng: 91.3662 },
    population: 2964007,
    healthStatus: "high",
    waterQuality: 5.4,
    healthFacilities: 16,
    activeAlerts: 12,
    districts: [
      {
        id: "east-khasi-hills",
        name: "East Khasi Hills",
        coordinates: { lat: 25.5788, lng: 91.8933 },
        population: 825922,
        healthStatus: "high",
        waterQuality: 5.1,
        cases: 67,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "mizoram",
    name: "Mizoram",
    capital: "Aizawl",
    coordinates: { lat: 23.1645, lng: 92.9376 },
    population: 1091014,
    healthStatus: "safe",
    waterQuality: 7.8,
    healthFacilities: 8,
    activeAlerts: 1,
    districts: [
      {
        id: "aizawl",
        name: "Aizawl",
        coordinates: { lat: 23.7307, lng: 92.7173 },
        population: 400309,
        healthStatus: "safe",
        waterQuality: 8.0,
        cases: 5,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "nagaland",
    name: "Nagaland",
    capital: "Kohima",
    coordinates: { lat: 26.1584, lng: 94.5624 },
    population: 1980602,
    healthStatus: "moderate",
    waterQuality: 6.9,
    healthFacilities: 14,
    activeAlerts: 6,
    districts: [
      {
        id: "kohima",
        name: "Kohima",
        coordinates: { lat: 25.6751, lng: 94.1086 },
        population: 267988,
        healthStatus: "moderate",
        waterQuality: 6.8,
        cases: 21,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "sikkim",
    name: "Sikkim",
    capital: "Gangtok",
    coordinates: { lat: 27.5330, lng: 88.5122 },
    population: 607688,
    healthStatus: "safe",
    waterQuality: 8.7,
    healthFacilities: 6,
    activeAlerts: 0,
    districts: [
      {
        id: "east-sikkim",
        name: "East Sikkim",
        coordinates: { lat: 27.3389, lng: 88.6065 },
        population: 283583,
        healthStatus: "safe",
        waterQuality: 8.9,
        cases: 2,
        lastUpdated: new Date()
      }
    ]
  },
  {
    id: "tripura",
    name: "Tripura",
    capital: "Agartala",
    coordinates: { lat: 23.9408, lng: 91.9882 },
    population: 3671032,
    healthStatus: "high",
    waterQuality: 4.8,
    healthFacilities: 22,
    activeAlerts: 15,
    districts: [
      {
        id: "west-tripura",
        name: "West Tripura",
        coordinates: { lat: 23.8315, lng: 91.2868 },
        population: 1725739,
        healthStatus: "high",
        waterQuality: 4.5,
        cases: 89,
        lastUpdated: new Date()
      }
    ]
  }
];

export const getStateColor = (status: string) => {
  switch (status) {
    case "safe": return "#10b981"; // emerald
    case "moderate": return "#06b6d4"; // cyan
    case "high": return "#f59e0b"; // yellow
    case "critical": return "#ef4444"; // red
    default: return "#6b7280"; // gray
  }
};