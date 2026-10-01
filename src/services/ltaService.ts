import { BusService, BusArrivalTiming, OccupancyLevel, DeckType } from '../types/transit';

export interface LtaBusUnit {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LtaServiceItem {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaBusUnit;
  NextBus2?: LtaBusUnit;
  NextBus3?: LtaBusUnit;
}

export interface LtaBusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: LtaServiceItem[];
  _source?: string;
  _message?: string;
}

export function parseEtaToMinutes(etaIso?: string): number | 'Arr' {
  if (!etaIso) return 'Arr';
  const etaDate = new Date(etaIso);
  const now = new Date();
  const diffMs = etaDate.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin <= 1) {
    return 'Arr';
  }
  return diffMin;
}

export function parseLoad(load?: string): OccupancyLevel {
  switch (load) {
    case 'SEA':
      return 'seats';
    case 'SDA':
      return 'standing';
    case 'LSD':
      return 'limited';
    default:
      return 'seats';
  }
}

export function parseDeck(type?: string): DeckType {
  if (type === 'DD') return 'DD';
  if (type === 'BD') return 'BD';
  return 'SD';
}

export function parseOperator(op?: string): 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead' {
  switch (op?.toUpperCase()) {
    case 'SBST':
      return 'SBS Transit';
    case 'SMRT':
      return 'SMRT';
    case 'TTS':
      return 'Tower Transit';
    case 'GAS':
      return 'Go-Ahead';
    default:
      return 'SBS Transit';
  }
}

export function mapLtaBusUnitToTiming(unit?: LtaBusUnit, defaultMin: number = 5): BusArrivalTiming {
  if (!unit || !unit.EstimatedArrival) {
    return {
      min: defaultMin,
      occupancy: 'seats',
      deck: 'SD',
      accessible: true,
      loadPercentage: 30,
    };
  }

  const occ = parseLoad(unit.Load);
  let loadPct = 35;
  if (occ === 'standing') loadPct = 70;
  if (occ === 'limited') loadPct = 90;

  return {
    min: parseEtaToMinutes(unit.EstimatedArrival),
    occupancy: occ,
    deck: parseDeck(unit.Type),
    accessible: unit.Feature === 'WAB',
    busPlate: unit.Monitored ? `SG${Math.floor(1000 + Math.random() * 8999)}A` : undefined,
    loadPercentage: loadPct,
  };
}

export function mapLtaServiceToBusService(
  item: LtaServiceItem,
  busStopCode: string,
  existingMeta?: Partial<BusService>
): BusService {
  const nextBus = mapLtaBusUnitToTiming(item.NextBus, 1);
  const secondBus = mapLtaBusUnitToTiming(item.NextBus2, 7);
  const thirdBus = mapLtaBusUnitToTiming(item.NextBus3, 18);

  const lat = item.NextBus?.Latitude ? parseFloat(item.NextBus.Latitude) : 1.302;
  const lng = item.NextBus?.Longitude ? parseFloat(item.NextBus.Longitude) : 103.838;

  const isArr = nextBus.min === 'Arr';
  const distM = isArr ? 250 : typeof nextBus.min === 'number' ? nextBus.min * 350 : 500;
  const progress = isArr ? 85 : Math.max(20, Math.min(80, 100 - (distM / 20)));

  return {
    serviceNo: item.ServiceNo,
    operator: parseOperator(item.Operator),
    category: existingMeta?.category || 'Trunk',
    destination: existingMeta?.destination || `Terminal (Code ${item.NextBus?.DestinationCode || 'Dest'})`,
    via: existingMeta?.via || 'via Major Transit Arteries',
    origin: existingMeta?.origin || `Interchange (Code ${item.NextBus?.OriginCode || 'Orig'})`,
    nextBus,
    secondBus,
    thirdBus,
    tracker: {
      previousStop: existingMeta?.tracker?.previousStop || 'Approaching Stop',
      previousStopCode: existingMeta?.tracker?.previousStopCode || 'B09037',
      targetStop: existingMeta?.tracker?.targetStop || `Stop ${busStopCode}`,
      targetStopCode: busStopCode,
      distanceMeters: distM,
      speedKmh: Math.floor(25 + Math.random() * 15),
      syncedSecondsAgo: 3,
      progressPercent: progress,
    },
  };
}

/**
 * Fetches Bus Arrival data from /api/bus-arrival proxy (which calls LTA DataMall v3).
 */
export async function fetchLtaBusArrivals(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse> {
  const cleanStopCode = busStopCode.replace(/^B/i, '');
  const url = new URL('/api/bus-arrival', window.location.origin);
  url.searchParams.append('BusStopCode', cleanStopCode);
  if (serviceNo) {
    url.searchParams.append('ServiceNo', serviceNo);
  }

  const res = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch LTA bus arrival: HTTP ${res.status}`);
  }

  return res.json();
}
