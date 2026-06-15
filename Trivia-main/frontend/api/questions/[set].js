import { verifyToken } from '../_lib/auth.js';
import questionsA from '../_lib/questionsA.js';
import questionsB from '../_lib/questionsB.js';

/**
 * GET /api/questions/:set
 * Vercel dynamic route: /api/questions/[set]
 * Requires Bearer token
 */
export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const player = verifyToken(req.headers.authorization);
  if (!player) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const requestedSet = req.query.set?.toUpperCase();
  const playerSet = player.set;

  // Security: prevent a player from requesting the wrong set
  if (requestedSet !== playerSet) {
    return res.status(403).json({
      error: 'Access denied — you are not assigned to this question set',
    });
  }

  const questions = requestedSet === 'A' ? questionsA : questionsB;

  if (!questions) {
    return res.status(404).json({ error: 'Question set not found' });
  }

  // Return questions WITHOUT the correct answers
  const sanitized = questions.map(({ id, questionText, category }) => ({
    id,
    questionText,
    category,
  }));

  return res.json({ set: requestedSet, questions: sanitized });
}
