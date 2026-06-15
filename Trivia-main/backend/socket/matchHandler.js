import jwt from 'jsonwebtoken';
import questionsA from '../data/questionsA.js';
import questionsB from '../data/questionsB.js';
import { appendResult } from '../services/sheetsService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const TIME_PER_QUESTION = 4 * 60 * 1000;
const TRANSITION_DURATION = 5000;

// In-memory matches state
const matches = {};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getQuestions(set) {
  return set === 'A' ? questionsA : questionsB;
}

function getConnectedCount(match) {
  return Object.values(match.players).filter((p) => p.connected).length;
}

function clearMatchTimer(match) {
  if (match.timerRef) {
    clearTimeout(match.timerRef);
    match.timerRef = null;
  }
}

function clearTransitionTimer(match) {
  if (match.transition.timerRef) {
    clearTimeout(match.transition.timerRef);
    match.transition.timerRef = null;
  }
}

function clearAllTimers(match) {
  clearMatchTimer(match);
  clearTransitionTimer(match);
}

/** Build a sanitized snapshot to send to a client */
function buildSnapshot(match) {
  const questions = getQuestions(match.set);
  const question = questions[match.currentQuestionIndex];
  const totalQs = match.currentQuestionIndex >= 20 ? questions.length : 20;
  const sanitizedQ = question
    ? { id: question.id, questionText: question.questionText, category: question.category }
    : null;

  return {
    status: match.status,
    currentQuestionIndex: match.currentQuestionIndex,
    totalQuestions: totalQs,
    question: sanitizedQ,
    remainingMs: match.remainingMs,
    deadline: match.questionDeadline,
    questionResolved: match.questionResolved,
    pauseReason: match.pauseReason,
    transition: {
      active: match.transition.active,
      remainingMs: match.transition.remainingMs,
    },
    players: Object.fromEntries(
      Object.entries(match.players).map(([k, v]) => [
        k,
        { username: v.username, playerName: v.playerName, score: v.score, correctAnswers: v.correctAnswers, connected: v.connected },
      ])
    ),
  };
}

// ─── Transition ────────────────────────────────────────────────────────────────

function startTransition(matchId, io) {
  const match = matches[matchId];
  if (!match) return;

  match.transition.active = true;
  match.transition.endsAt = Date.now() + TRANSITION_DURATION;
  match.transition.remainingMs = TRANSITION_DURATION;

  console.log(`[Match] ${matchId} TRANSITION started (${TRANSITION_DURATION}ms)`);

  io.to(`match_${matchId}`).emit('transition_started', {
    duration: TRANSITION_DURATION,
  });

  clearTransitionTimer(match);

  match.transition.timerRef = setTimeout(() => {
    if (!matches[matchId]) return;
    if (matches[matchId].status !== 'active') return;

    proceedToNextQuestion(matchId, io);
  }, TRANSITION_DURATION);
}

function proceedToNextQuestion(matchId, io) {
  const match = matches[matchId];
  if (!match) return;

  // Clear transition state
  match.transition.active = false;
  match.transition.endsAt = null;
  match.transition.remainingMs = null;
  clearTransitionTimer(match);

  match.currentQuestionIndex++;
  startQuestionTimer(matchId, io, TIME_PER_QUESTION);
}

// ─── Pause / Resume ────────────────────────────────────────────────────────────

function pauseMatch(matchId, io, reason) {
  const match = matches[matchId];
  if (!match || match.status !== 'active') return;

  // Preserve question timer remaining time
  if (!match.transition.active && match.questionDeadline) {
    match.remainingMs = Math.max(0, match.questionDeadline - Date.now());
  }

  // Preserve transition remaining time
  if (match.transition.active && match.transition.endsAt) {
    match.transition.remainingMs = Math.max(0, match.transition.endsAt - Date.now());
  }

  // Stop all timers
  clearAllTimers(match);

  match.status = 'paused';
  match.pauseReason = reason || 'opponent_disconnected';
  match.questionDeadline = null;

  console.log(`[Match] ${matchId} PAUSED — reason: ${match.pauseReason}, remainingMs: ${match.remainingMs}, transition.active: ${match.transition.active}, transition.remainingMs: ${match.transition.remainingMs}`);

  io.to(`match_${matchId}`).emit('match_paused', {
    reason: match.pauseReason,
    remainingMs: match.remainingMs,
    currentQuestionIndex: match.currentQuestionIndex,
    transition: {
      active: match.transition.active,
      remainingMs: match.transition.remainingMs,
    },
  });
}

function resumeMatch(matchId, io) {
  const match = matches[matchId];
  if (!match || match.status !== 'paused') return;

  match.status = 'active';
  match.pauseReason = null;

  console.log(`[Match] ${matchId} RESUMED — transition.active: ${match.transition.active}`);

  io.to(`match_${matchId}`).emit('match_resumed');

  if (match.transition.active) {
    // Resume the transition timer from saved remaining time
    const remaining = match.transition.remainingMs || 0;
    match.transition.endsAt = Date.now() + remaining;

    io.to(`match_${matchId}`).emit('transition_resumed', {
      remainingMs: remaining,
    });

    clearTransitionTimer(match);

    match.transition.timerRef = setTimeout(() => {
      if (!matches[matchId]) return;
      if (matches[matchId].status !== 'active') return;

      proceedToNextQuestion(matchId, io);
    }, remaining);
  } else {
    // Resume question timer from saved remaining time
    startQuestionTimer(matchId, io, match.remainingMs);
  }
}

function startQuestionTimer(matchId, io, durationMs) {
  const match = matches[matchId];
  if (!match) return;

  match.questionResolved = false;
  match.questionDeadline = Date.now() + durationMs;
  match.remainingMs = durationMs;

  const questions = getQuestions(match.set);

  if (match.currentQuestionIndex === 20) {
    const pVals = Object.values(match.players);
    if (pVals.length >= 2 && pVals[0].score !== pVals[1].score) {
      return finishMatch(matchId, io);
    }
  } else if (match.currentQuestionIndex > 20 || match.currentQuestionIndex >= questions.length) {
    return finishMatch(matchId, io);
  }

  const question = questions[match.currentQuestionIndex];

  if (!question) {
    return finishMatch(matchId, io);
  }

  const sanitized = { id: question.id, questionText: question.questionText, category: question.category };
  const totalQs = match.currentQuestionIndex >= 20 ? questions.length : 20;

  io.to(`match_${matchId}`).emit('question_started', {
    questionIndex: match.currentQuestionIndex,
    totalQuestions: totalQs,
    question: sanitized,
    deadline: match.questionDeadline,
    timeRemaining: durationMs,
  });

  // Clear any stale timer before setting a new one
  clearMatchTimer(match);

  match.timerRef = setTimeout(() => {
    // Guard: only fire if match is still active (not paused/finished)
    if (!matches[matchId] || matches[matchId].status !== 'active') return;
    if (matches[matchId].questionResolved) return;

    advanceQuestion(matchId, io, { timedOut: true });
  }, durationMs);
}

// ─── Match Lifecycle ───────────────────────────────────────────────────────────

function startMatch(matchId, io) {
  const match = matches[matchId];
  match.status = 'active';
  match.matchStartedAt = Date.now();

  console.log(`[Match] ${matchId} STARTED`);

  io.to(`match_${matchId}`).emit('match_ready');
  startQuestionTimer(matchId, io, TIME_PER_QUESTION);
}

function advanceQuestion(matchId, io, resolveReason) {
  const match = matches[matchId];
  if (!match) return;

  // Guard against double-advance
  if (match.questionResolved) return;

  match.questionResolved = true;
  clearMatchTimer(match);

  io.to(`match_${matchId}`).emit('question_resolved', { reason: resolveReason });

  // Start 4-second transition instead of immediate next question
  startTransition(matchId, io);
}

async function finishMatch(matchId, io) {
  const match = matches[matchId];
  if (!match) return;

  match.status = 'finished';
  clearAllTimers(match);

  console.log(`[Match] ${matchId} FINISHED`);

  io.to(`match_${matchId}`).emit('match_finished', { players: match.players });

  const completionTimeSec = Math.floor((Date.now() - match.matchStartedAt) / 1000);
  const questions = getQuestions(match.set);
  const totalQuestions = match.currentQuestionIndex >= 20 ? questions.length : 20;

  for (const p of Object.values(match.players)) {
    try {
      await appendResult({
        username: p.username,
        playerName: p.playerName,
        matchId: match.matchId,
        set: match.set,
        score: p.score,
        totalQuestions,
        correctAnswers: p.correctAnswers,
        completionTimeSec,
        finishedAt: new Date().toISOString(),
      });
      console.log(`[Sheets] Successfully appended result for ${p.username}`);
    } catch (e) {
      console.error('Error appending result for', p.username, e);
    }
  }
}

// ─── Socket Init ───────────────────────────────────────────────────────────────

export function initSocket(io) {
  // JWT auth middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.user;
    const matchId = user.matchId;
    const username = user.username;
    const socketRoom = `match_${matchId}`;

    socket.join(socketRoom);

    // ── Initialize match if first connection ──
    if (!matches[matchId]) {
      matches[matchId] = {
        matchId,
        set: user.set,
        status: 'waiting',           // waiting | active | paused | finished
        currentQuestionIndex: 0,
        players: {},
        questionStartedAt: null,
        questionDeadline: null,
        remainingMs: TIME_PER_QUESTION,
        timerRef: null,
        questionResolved: false,
        pauseReason: null,
        matchStartedAt: null,
        transition: {
          active: false,
          endsAt: null,
          remainingMs: null,
          timerRef: null,
        },
      };
    }

    const match = matches[matchId];

    // ── Register / re-register player ──
    if (!match.players[username]) {
      match.players[username] = {
        username,
        playerName: user.playerName,
        connected: true,
        socketId: socket.id,
        score: 0,
        correctAnswers: 0,
      };
    } else {
      // Reconnecting player — update socket reference
      match.players[username].connected = true;
      match.players[username].socketId = socket.id;
    }

    const connectedCount = getConnectedCount(match);
    console.log(`[Socket] ${username} connected to match ${matchId} (status: ${match.status}, connected: ${connectedCount})`);

    // ── State-dependent join behavior ──
    if (match.status === 'waiting') {
      if (connectedCount === 2) {
        console.log(`[Socket] Match ${matchId} has 2 players. Starting match!`);
        startMatch(matchId, io);
      } else {
        socket.emit('waiting_for_opponent');
      }
    } else if (match.status === 'paused') {
      // Send snapshot so reconnecting player knows the paused state
      socket.emit('match_state_snapshot', buildSnapshot(match));

      if (connectedCount === 2) {
        // Both players are back — resume!
        resumeMatch(matchId, io);
      } else {
        // Still waiting for the other player
        socket.emit('waiting_for_opponent');
      }
    } else if (match.status === 'active') {
      // Mid-game reconnect while match is still active (edge case: very fast reconnect)
      socket.emit('match_state_snapshot', buildSnapshot(match));
    } else if (match.status === 'finished') {
      socket.emit('match_finished', { players: match.players });
    }

    // ── Answer submission ──
    socket.on('submit_answer', (answer, callback) => {
      // Guard: only accept answers during active play, unresolved question, and not in transition
      if (match.status !== 'active' || match.questionResolved || match.transition.active) {
        if (typeof callback === 'function') callback({ success: false });
        return;
      }

      const questions = getQuestions(match.set);
      const question = questions[match.currentQuestionIndex];

      if (!question) {
        if (typeof callback === 'function') callback({ success: false });
        return;
      }

      const normalizedAnswer = (answer || '').trim().toLowerCase();
      const isCorrect = Array.isArray(question.correctAnswer)
        ? question.correctAnswer.some((ans) => ans.trim().toLowerCase() === normalizedAnswer)
        : question.correctAnswer.trim().toLowerCase() === normalizedAnswer;

      if (isCorrect) {
        if (typeof callback === 'function') callback({ success: true, isCorrect: true });
        match.players[username].score += 10;
        match.players[username].correctAnswers += 1;
        advanceQuestion(matchId, io, { answeredBy: username, isCorrect: true });
      } else {
        if (typeof callback === 'function') callback({ success: true, isCorrect: false });
      }
    });

    // ── Disconnect ──
    socket.on('disconnect', () => {
      if (!matches[matchId] || !matches[matchId].players[username]) return;

      matches[matchId].players[username].connected = false;
      matches[matchId].players[username].socketId = null;

      const remaining = getConnectedCount(matches[matchId]);
      console.log(`[Socket] ${username} disconnected from match ${matchId} (remaining connected: ${remaining})`);

      if (matches[matchId].status === 'active') {
        // Pause the match immediately (works during question OR transition)
        pauseMatch(matchId, io, 'opponent_disconnected');
      }

      // Notify any remaining connected player
      socket.to(socketRoom).emit('opponent_disconnected', { username });
    });
  });
}
