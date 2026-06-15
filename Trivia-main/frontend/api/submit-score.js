import { verifyToken } from './_lib/auth.js';
import { appendResult } from './_lib/sheetsService.js';

/**
 * POST /api/submit-score
 * Body: { score, totalQuestions, correctAnswers, completionTimeSec }
 * Requires Bearer token
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const player = verifyToken(req.headers.authorization);
  if (!player) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  try {
    const { score, totalQuestions, correctAnswers, completionTimeSec } = req.body;
    const { username, playerName, matchId, set } = player;

    if (score == null || totalQuestions == null) {
      return res.status(400).json({ error: 'Missing required score data' });
    }

    await appendResult({
      username,
      playerName,
      matchId,
      set,
      score,
      totalQuestions,
      correctAnswers,
      completionTimeSec,
      finishedAt: new Date().toISOString(),
    });

    return res.json({ success: true, message: 'Score submitted successfully' });
  } catch (err) {
    console.error('Score submission error:', err.message);
    return res.status(500).json({ error: 'Failed to submit score' });
  }
}
