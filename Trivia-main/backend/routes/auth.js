import { Router } from 'express';
import { findPlayer } from '../services/sheetsService.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/login
 * Body: { username, password }
 * Returns: { token, playerName, matchId, set, opponent }
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const player = await findPlayer(username.trim());

    if (!player) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (player.password !== password.trim()) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Sign a JWT with player info (no password)
    const token = signToken({
      username: player.username,
      playerName: player.playerName,
      matchId: player.matchId,
      set: player.set,
      opponent: player.opponent,
    });

    return res.json({
      token,
      playerName: player.playerName,
      matchId: player.matchId,
      set: player.set,
      opponent: player.opponent,
    });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

export default router;
