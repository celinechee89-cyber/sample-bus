/**
 * Health check endpoint for monitoring service status.
 * Responds with current timestamp, uptime, and LTA Datamall API configuration status.
 */
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, AccountKey');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const hasLtaKey = Boolean(process.env.LTA_ACCOUNT_KEY && process.env.LTA_ACCOUNT_KEY.trim().length > 0);

  return res.status(200).json({
    status: 'ok',
    service: 'SBS Transit Live Arrival API',
    version: 'v3',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    ltaConfigured: hasLtaKey,
    ltaKeyStatus: hasLtaKey ? 'configured' : 'pending_env_var (LTA_ACCOUNT_KEY)',
    endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
  });
}
