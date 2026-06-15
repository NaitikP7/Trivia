import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';

export default function ScoreBoard() {
  const { player, questionIndex, totalQuestions, score } = useGame();

  if (!player) return null;

  const total = totalQuestions || 10; // Use backend value, fallback to 10
  const progress = total > 0 ? ((questionIndex) / total) * 100 : 0;

  return (
    <motion.div
      className="scoreboard"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="scoreboard__left">
        <span className="scoreboard__label">Match</span>
        <span className="scoreboard__value">{player.matchId}</span>
      </div>

      <div className="scoreboard__center">
        <span className="scoreboard__label">Question</span>
        <span className="scoreboard__value">
          {questionIndex + 1} / {total}
        </span>
        <div className="scoreboard__progress-track">
          <motion.div
            className="scoreboard__progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="scoreboard__right">
        <span className="scoreboard__label">Score</span>
        <span className="scoreboard__value scoreboard__score">{score || 0}</span>
      </div>
    </motion.div>
  );
}
