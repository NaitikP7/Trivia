import { verifyToken } from '../_lib/auth.js';
import questionsA from '../_lib/questionsA.js';
import questionsB from '../_lib/questionsB.js';

/**
 * POST /api/questions/check
 * Body: { questionId, answer }
 * Requires Bearer token
 */
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const player = verifyToken(req.headers.authorization);
  if (!player) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  const { questionId, answer } = req.body;
  const playerSet = player.set;
  const questions = playerSet === 'A' ? questionsA : questionsB;

  const question = questions.find((q) => q.id === questionId);

  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }

  const normalizedAnswer = (answer || '').trim().toLowerCase();
  const isCorrect = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.some((ans) => ans.trim().toLowerCase() === normalizedAnswer)
    : question.correctAnswer.trim().toLowerCase() === normalizedAnswer;

  return res.json({
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
  });
}
