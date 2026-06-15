import { findPlayer } from './_lib/sheetsService.js';
import { signToken } from './_lib/auth.js';

/**
 * POST /api/login
 * Body: { username, password }
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Server error during login' });
  }
}
