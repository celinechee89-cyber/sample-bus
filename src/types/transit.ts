export type OccupancyLevel = 'seats' | 'standing' | 'limited';

export type DeckType = 'DD' | 'SD' | 'BD'; // Double Decker, Single Deck, Bendy

export interface BusArrivalTiming {
  min: number | 'Arr';
  occupancy: OccupancyLevel;
  deck: DeckType;
  accessible: boolean;
  busPlate?: string;
  loadPercentage?: number;
}

export interface BusService {
  serviceNo: string;
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  category: 'Trunk' | 'Feeder' | 'Express' | 'City Direct';
  destination: string;
  via: string;
  origin: string;
  nextBus: BusArrivalTiming;
  secondBus: BusArrivalTiming;
  thirdBus: BusArrivalTiming;
  tracker: {
    previousStop: string;
    previousStopCode: string;
    targetStop: string;
    targetStopCode: string;
    distanceMeters: number;
    speedKmh: number;
    syncedSecondsAgo: number;
    progressPercent: number;
  };
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  directionDesc: string;
  distanceMeters: number;
  walkMinutes: number;
  services: BusService[];
  coordinates: { x: number; y: number; lat: number; lng: number };
}

export interface RouteStopNode {
  stopCode: string;
  stopName: string;
  roadName: string;
  isPassed: boolean;
  isCurrentTarget: boolean;
  distanceFromStartKm: number;
  hasBusHere?: {
    busPlate: string;
    deck: DeckType;
    occupancy: OccupancyLevel;
  };
}

export interface ServiceAlert {
  id: string;
  title: string;
  severity: 'normal' | 'info' | 'warning' | 'delay';
  affectedRoutes: string[];
  description: string;
  timestamp: string;
  isRead?: boolean;
}
