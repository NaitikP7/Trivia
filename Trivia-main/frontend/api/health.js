/**
 * GET /api/health
 * Simple health check endpoint.
 */
export default function handler(req, res) {
  return res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
