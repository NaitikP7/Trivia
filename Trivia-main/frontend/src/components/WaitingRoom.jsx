import React from 'react';
import { useGame } from '../context/GameContext';
import CaseFileCard from './CaseFileCard';

export default function WaitingRoom() {
  const { player, gameState, pauseReason, questionIndex, timeRemaining } = useGame();

  const isPaused = gameState === 'paused';

  // Format frozen time for paused display
  const frozenSeconds = Math.ceil((timeRemaining || 0) / 1000);
  const frozenMin = Math.floor(frozenSeconds / 60);
  const frozenSec = frozenSeconds % 60;
  const frozenTime = `${frozenMin.toString().padStart(2, '0')}:${frozenSec.toString().padStart(2, '0')}`;

  return (
    <CaseFileCard>
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">

        {isPaused ? (
          <>
            {/* ─── Paused Mode ─── */}
            <h2 className="text-3xl font-bold font-mono tracking-wider text-amber-500 uppercase"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              ⏸ Case Suspended
            </h2>

            <p className="text-xl font-mono text-gray-800">
              Your partner has gone dark.
            </p>

            <p className="text-lg font-mono text-gray-800 font-semibold">
              Match paused — waiting for reconnection…
            </p>

            <div className="mt-4 space-y-2 text-base font-mono text-gray-700 font-medium">
              <p>Clue #{questionIndex + 1} · ⏱ {frozenTime} remaining</p>
              {player?.matchId && <p>Case ID: {player.matchId}</p>}
            </div>

            <div className="mt-6 animate-pulse text-amber-600">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M3.07 10.94a9 9 0 1116.86 0M9 21h6" />
              </svg>
            </div>
          </>
        ) : (
          <>
            {/* ─── Pre-match Waiting Mode ─── */}
            <h2 className="text-3xl font-bold font-mono tracking-wider text-red-600 uppercase"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Case File Locked
            </h2>

            <p className="text-xl font-mono text-gray-800">
              Awaiting second detective...
            </p>

            <div className="mt-8 animate-pulse text-red-700">
              <svg className="w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </>
        )}
      </div>
    </CaseFileCard>
  );
}
