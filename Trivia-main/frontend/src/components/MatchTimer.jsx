import React from 'react';
import { useGame } from '../context/GameContext';

export default function MatchTimer() {
  const { timeRemaining, gameState } = useGame();

  const isPaused = gameState === 'paused';

  const totalSeconds = Math.ceil(timeRemaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Turn red and pulse when under 30 seconds (only when actively playing)
  const isUrgent = !isPaused && totalSeconds > 0 && totalSeconds <= 30;

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 font-mono text-xl font-bold tracking-widest border-2 rounded shadow-lg
      ${isPaused
        ? 'border-amber-500 text-amber-400 bg-amber-950/40'
        : isUrgent 
          ? 'border-red-600 text-red-500 bg-red-950/40 animate-pulse' 
          : 'border-gray-600 text-gray-300 bg-gray-900/60'
      }`}>
      {isPaused && <span className="mr-2 text-sm">⏸</span>}
      {formattedTime}
    </div>
  );
}
