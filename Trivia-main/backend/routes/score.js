import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { appendResult } from '../services/sheetsService.js';

const router = Router();

/**
 * POST /api/submit-score
 * Requires: Bearer token
 * Body: { score, totalQuestions, correctAnswers, completionTimeSec }
 */
router.post('/submit-score', verifyToken, async (req, res) => {
  try {
    const { score, totalQuestions, correctAnswers, completionTimeSec } = req.body;
    const { username, playerName, matchId, set } = req.player;

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
});

export default router;
