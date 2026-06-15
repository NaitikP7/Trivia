import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

// Can be rendered standalone (wraps its own card) or inline inside another card.
// When `inline` prop is true, it just returns the inner content with no CaseFileCard wrapper.
export default function TransitionOverlay() {
  const { transition, questionIndex, feedback, player } = useGame();
  const [countdown, setCountdown] = useState(Math.ceil((transition.remainingMs || 5000) / 1000));

  useEffect(() => {
    setCountdown(Math.ceil((transition.remainingMs || 5000) / 1000));
  }, [transition.remainingMs]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Build the result message from feedback
  let resultMessage = null;
  let resultColor = 'text-gray-700';

  if (feedback?.reason) {
    if (feedback.reason.timedOut) {
      resultMessage = "Time's up! Nobody answered in time.";
      resultColor = 'text-yellow-600';
    } else {
      const isMe = feedback.reason.answeredBy === player?.username;
      if (isMe) {
        resultMessage = 'You answered correctly! Moving on to the next question...';
        resultColor = 'text-green-600';
      } else {
        resultMessage = 'The opponent answered correctly! Moving on to the next question...';
        resultColor = 'text-red-600';
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">

      {/* Result message */}
      {resultMessage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`text-xl font-bold font-mono tracking-wide ${resultColor}`}
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.15)' }}
        >
          {resultMessage}
        </motion.div>
      )}

      {/* Animated magnifying glass */}
      <motion.div
        initial={{ rotate: -15, scale: 0.8 }}
        animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [0.9, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="text-5xl"
      >
        🔍
      </motion.div>

      <motion.h2
        className="text-xl font-bold font-mono tracking-wider text-red-600 uppercase"
        style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Preparing Next Case File…
      </motion.h2>

      <motion.p
        className="text-lg font-mono text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Moving to Clue #{questionIndex + 2}
      </motion.p>

      {/* Countdown */}
      <motion.div
        className="font-mono text-4xl font-bold text-red-500"
        key={countdown}
        initial={{ scale: 1.4, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {countdown}
      </motion.div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-gray-700/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-red-600 rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: (transition.remainingMs || 5000) / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
}
