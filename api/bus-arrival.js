/**
 * Vercel Serverless Function: LTA Bus Arrival v3 Proxy
 * Calls LTA DataMall v3 API: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 * Query params: BusStopCode, ServiceNo (optional)
 * Auth: AccountKey header using process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const busStopCodeParam = req.query.BusStopCode || req.query.busStopCode;
  const serviceNo = req.query.ServiceNo || req.query.serviceNo;

  if (!busStopCodeParam) {
    return res.status(400).json({
      error: 'Missing required query parameter: BusStopCode',
      example: '/api/bus-arrival?BusStopCode=83139',
    });
  }

  // Clean stop code (e.g. "B09048" -> "09048")
  const cleanStopCode = String(busStopCodeParam).trim().replace(/^B/i, '');

  const apiKey = process.env.LTA_ACCOUNT_KEY ? process.env.LTA_ACCOUNT_KEY.trim() : null;

  if (apiKey) {
    try {
      const url = new URL('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival');
      url.searchParams.append('BusStopCode', cleanStopCode);
      if (serviceNo) {
        url.searchParams.append('ServiceNo', String(serviceNo).trim());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          AccountKey: apiKey,
          accept: 'application/json',
          'User-Agent': 'SBSTransit-LiveArrival/1.0',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          ...data,
          _source: 'lta_datamall_v3',
          _timestamp: new Date().toISOString(),
        });
      }

      // If LTA returns error (e.g. 401 Unauthorized due to invalid key)
      const errorText = await response.text();
      console.warn(`LTA API responded with status ${response.status}: ${errorText}`);

      // Fallback to simulated live arrivals if key is rejected
      const fallbackData = generateFallbackArrivals(cleanStopCode, serviceNo);
      return res.status(200).json({
        ...fallbackData,
        _source: 'simulated_fallback',
        _lta_error: `LTA API HTTP ${response.status}`,
        _message: 'LTA Datamall API request failed; serving simulated real-time arrivals.',
      });
    } catch (err) {
      console.error('Failed to fetch from LTA Datamall API:', err);
      const fallbackData = generateFallbackArrivals(cleanStopCode, serviceNo);
      return res.status(200).json({
        ...fallbackData,
        _source: 'simulated_fallback',
        _error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // If no LTA_ACCOUNT_KEY configured yet
  const simulatedData = generateFallbackArrivals(cleanStopCode, serviceNo);
  return res.status(200).json({
    ...simulatedData,
    _source: 'simulated_no_key',
    _message:
      'LTA_ACCOUNT_KEY environment variable is not set. Add it in Vercel settings for live official LTA feeds.',
  });
}

function generateFallbackArrivals(busStopCode, filterServiceNo) {
  const now = Date.now();
  const getEtaIso = (minutesAhead) => new Date(now + minutesAhead * 60000).toISOString();

  // Known services for common stops
  const defaultServices = [
    {
      ServiceNo: '65',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '14009',
        DestinationCode: '75009',
        EstimatedArrival: getEtaIso(1),
        Monitored: 1,
        Latitude: '1.30150',
        Longitude: '103.83850',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '14009',
        DestinationCode: '75009',
        EstimatedArrival: getEtaIso(7),
        Monitored: 1,
        Latitude: '1.29850',
        Longitude: '103.84210',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '14009',
        DestinationCode: '75009',
        EstimatedArrival: getEtaIso(19),
        Monitored: 1,
        Latitude: '1.28520',
        Longitude: '103.84800',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
    {
      ServiceNo: '14',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: getEtaIso(4),
        Monitored: 1,
        Latitude: '1.30320',
        Longitude: '103.83410',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: getEtaIso(12),
        Monitored: 1,
        Latitude: '1.30600',
        Longitude: '103.83100',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '17009',
        DestinationCode: '84009',
        EstimatedArrival: getEtaIso(24),
        Monitored: 1,
        Latitude: '1.30900',
        Longitude: '103.82700',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '124',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '52009',
        DestinationCode: '14009',
        EstimatedArrival: getEtaIso(2),
        Monitored: 1,
        Latitude: '1.30280',
        Longitude: '103.83600',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus2: {
        OriginCode: '52009',
        DestinationCode: '14009',
        EstimatedArrival: getEtaIso(9),
        Monitored: 1,
        Latitude: '1.30550',
        Longitude: '103.83300',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
      NextBus3: {
        OriginCode: '52009',
        DestinationCode: '14009',
        EstimatedArrival: getEtaIso(21),
        Monitored: 1,
        Latitude: '1.30800',
        Longitude: '103.82900',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    },
    {
      ServiceNo: '174',
      Operator: 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '22009',
        EstimatedArrival: getEtaIso(6),
        Monitored: 1,
        Latitude: '1.30400',
        Longitude: '103.83500',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '22009',
        EstimatedArrival: getEtaIso(15),
        Monitored: 1,
        Latitude: '1.30750',
        Longitude: '103.83050',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '22009',
        EstimatedArrival: getEtaIso(27),
        Monitored: 1,
        Latitude: '1.31100',
        Longitude: '103.82600',
        VisitNumber: '1',
        Load: 'LSD',
        Feature: 'WAB',
        Type: 'DD',
      },
    },
  ];

  let services = defaultServices;
  if (filterServiceNo) {
    services = defaultServices.filter(
      (s) => s.ServiceNo.toLowerCase() === String(filterServiceNo).toLowerCase()
    );
    if (services.length === 0) {
      services = [
        {
          ServiceNo: String(filterServiceNo),
          Operator: 'SBST',
          NextBus: {
            OriginCode: '10009',
            DestinationCode: '45009',
            EstimatedArrival: getEtaIso(3),
            Monitored: 1,
            Latitude: '1.30210',
            Longitude: '103.83750',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
          },
          NextBus2: {
            OriginCode: '10009',
            DestinationCode: '45009',
            EstimatedArrival: getEtaIso(11),
            Monitored: 1,
            Latitude: '1.29800',
            Longitude: '103.84100',
            VisitNumber: '1',
            Load: 'SDA',
            Feature: 'WAB',
            Type: 'SD',
          },
          NextBus3: {
            OriginCode: '10009',
            DestinationCode: '45009',
            EstimatedArrival: getEtaIso(23),
            Monitored: 1,
            Latitude: '1.28500',
            Longitude: '103.84700',
            VisitNumber: '1',
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
          },
        },
      ];
    }
  }

  return {
    'odata.metadata': 'https://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3/@Element',
    BusStopCode: busStopCode,
    Services: services,
  };
}
