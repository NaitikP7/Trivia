import { createContext, useContext, useReducer, useEffect } from 'react';
import { socket } from '../services/socket.js';

const GameContext = createContext(null);
const GameDispatchContext = createContext(null);

const initialState = {
  // Auth
  token: null,
  player: null, // { username, playerName, matchId, set, opponent }

  // Game tracking
  gameState: 'login', // 'login' | 'waiting' | 'playing' | 'paused' | 'result'
  currentQuestion: null,
  questionIndex: 0,
  totalQuestions: 0,
  timeRemaining: 0,
  deadline: null,
  questionResolved: false,
  feedback: null, // { reason, correctAnswer }
  
  score: 0,
  
  // Pause state
  pauseReason: null, // 'opponent_disconnected' | null

  // Transition state
  transition: { active: false, remainingMs: 0 },

  // Players ending state
  matchResult: null, // { players: { [username]: { score, correctAnswers } } }
  opponentConnected: true,
  
  error: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        player: { ...action.payload },
        gameState: 'waiting',
        score: 0,
        error: null,
      };

    case 'MATCH_WAITING':
      return { ...state, gameState: 'waiting' };

    case 'MATCH_READY':
      return { ...state, gameState: 'playing', pauseReason: null, opponentConnected: true };

    case 'QUESTION_STARTED':
      return {
        ...state,
        gameState: 'playing',
        currentQuestion: action.payload.question,
        questionIndex: action.payload.questionIndex,
        totalQuestions: action.payload.totalQuestions ?? state.totalQuestions,
        deadline: action.payload.deadline,
        timeRemaining: action.payload.timeRemaining,
        questionResolved: false,
        feedback: null,
        pauseReason: null,
        opponentConnected: true,
        transition: { active: false, remainingMs: 0 },
      };

    case 'UPDATE_TIME':
      return {
        ...state,
        timeRemaining: action.payload,
      };

    case 'QUESTION_RESOLVED': {
      const isMyAnswer = action.payload.reason?.answeredBy === state.player?.username;
      const isCorrect = action.payload.reason?.isCorrect;
      
      return {
        ...state,
        questionResolved: true,
        feedback: {
          reason: action.payload.reason,
        },
        score: isMyAnswer && isCorrect ? state.score + 10 : state.score,
      };
    }

    case 'MATCH_PAUSED':
      return {
        ...state,
        gameState: 'paused',
        pauseReason: action.payload.reason || 'opponent_disconnected',
        timeRemaining: action.payload.remainingMs ?? state.timeRemaining,
        deadline: null, // freeze — no countdown target
        opponentConnected: false,
        transition: action.payload.transition ?? state.transition,
      };

    case 'TRANSITION_STARTED':
      return {
        ...state,
        transition: { active: true, remainingMs: action.payload.duration },
      };

    case 'TRANSITION_RESUMED':
      return {
        ...state,
        transition: { active: true, remainingMs: action.payload.remainingMs },
      };

    case 'MATCH_RESUMED':
      return {
        ...state,
        gameState: 'playing',
        pauseReason: null,
        opponentConnected: true,
      };

    case 'MATCH_STATE_SNAPSHOT': {
      const snap = action.payload;
      const newState = {
        ...state,
        questionIndex: snap.currentQuestionIndex,
        totalQuestions: snap.totalQuestions ?? state.totalQuestions,
        currentQuestion: snap.question,
        questionResolved: snap.questionResolved,
        pauseReason: snap.pauseReason,
        transition: snap.transition ?? { active: false, remainingMs: 0 },
      };

      // Restore own score from snapshot
      if (snap.players && state.player?.username && snap.players[state.player.username]) {
        newState.score = snap.players[state.player.username].score;
      }

      if (snap.status === 'paused') {
        newState.gameState = 'paused';
        newState.timeRemaining = snap.remainingMs ?? 0;
        newState.deadline = null;
        newState.opponentConnected = false;
      } else if (snap.status === 'active') {
        newState.gameState = 'playing';
        newState.deadline = snap.deadline;
        newState.timeRemaining = snap.remainingMs ?? 0;
        newState.opponentConnected = true;
      } else if (snap.status === 'finished') {
        newState.gameState = 'result';
        newState.matchResult = { players: snap.players };
      }

      return newState;
    }

    case 'MATCH_FINISHED':
      return {
        ...state,
        gameState: 'result',
        matchResult: action.payload,
      };

    case 'OPPONENT_DISCONNECTED':
      return { ...state, opponentConnected: false };

    case 'OPPONENT_RECONNECTED':
      return { ...state, opponentConnected: true };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'RESET':
      socket.disconnect();
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Socket event listeners
    socket.on('waiting_for_opponent', () => {
      console.log('Socket received: waiting_for_opponent');
      dispatch({ type: 'MATCH_WAITING' });
    });
    
    socket.on('match_ready', () => {
      console.log('Socket received: match_ready');
      dispatch({ type: 'MATCH_READY' });
    });
    
    socket.on('question_started', (data) => {
      console.log('Socket received: question_started', data);
      dispatch({ type: 'QUESTION_STARTED', payload: data });
    });
    
    socket.on('question_resolved', (data) => {
      console.log('Socket received: question_resolved', data);
      dispatch({ type: 'QUESTION_RESOLVED', payload: data });
    });
    
    socket.on('match_finished', (data) => {
      console.log('Socket received: match_finished', data);
      dispatch({ type: 'MATCH_FINISHED', payload: data });
    });

    socket.on('match_paused', (data) => {
      console.log('Socket received: match_paused', data);
      dispatch({ type: 'MATCH_PAUSED', payload: data });
    });

    socket.on('match_resumed', () => {
      console.log('Socket received: match_resumed');
      dispatch({ type: 'MATCH_RESUMED' });
    });

    socket.on('match_state_snapshot', (data) => {
      console.log('Socket received: match_state_snapshot', data);
      dispatch({ type: 'MATCH_STATE_SNAPSHOT', payload: data });
    });
    
    socket.on('transition_started', (data) => {
      console.log('Socket received: transition_started', data);
      dispatch({ type: 'TRANSITION_STARTED', payload: data });
    });

    socket.on('transition_resumed', (data) => {
      console.log('Socket received: transition_resumed', data);
      dispatch({ type: 'TRANSITION_RESUMED', payload: data });
    });

    socket.on('opponent_disconnected', () => {
      console.log('Socket received: opponent_disconnected');
      dispatch({ type: 'OPPONENT_DISCONNECTED' });
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
      dispatch({ type: 'SET_ERROR', payload: `Detective connection failed: ${err.message}. Check your clearance level (credentials) or signal strength (network).` });
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    return () => {
      socket.off('waiting_for_opponent');
      socket.off('match_ready');
      socket.off('question_started');
      socket.off('question_resolved');
      socket.off('match_finished');
      socket.off('match_paused');
      socket.off('match_resumed');
      socket.off('match_state_snapshot');
      socket.off('transition_started');
      socket.off('transition_resumed');
      socket.off('opponent_disconnected');
      socket.off('connect_error');
      socket.off('disconnect');
    };
  }, []);

  // Update timer remaining locally based on deadline — only when playing (not paused/transitioning)
  useEffect(() => {
    if (state.gameState !== 'playing' || !state.deadline || state.questionResolved || state.transition.active) {
      return;
    }
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, state.deadline - Date.now());
      dispatch({ type: 'UPDATE_TIME', payload: remaining });
      
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [state.deadline, state.gameState, state.questionResolved]);

  return (
    <GameContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}

export function useGameDispatch() {
  return useContext(GameDispatchContext);
}
