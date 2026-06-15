const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * Login — POST /api/login
 * Returns: { token, playerName, matchId, set, opponent }
 */
export async function login(username, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

/**
 * Fetch questions for the player's assigned set.
 * GET /api/questions/:set
 */
export async function fetchQuestions(set, token) {
  const res = await fetch(`${API_BASE}/questions/${set}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch questions');
  }

  return data.questions;
}

/**
 * Check a single answer server-side.
 * POST /api/questions/check
 */
export async function checkAnswer(questionId, answer, token) {
  const res = await fetch(`${API_BASE}/questions/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ questionId, answer }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to check answer');
  }

  return data; // { correct, correctAnswer }
}

/**
 * Submit final score.
 * POST /api/submit-score
 */
export async function submitScore(scoreData, token) {
  const res = await fetch(`${API_BASE}/submit-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(scoreData),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit score');
  }

  return data;
}
