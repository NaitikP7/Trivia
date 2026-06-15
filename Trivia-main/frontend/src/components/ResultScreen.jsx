import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import CaseFileCard from './CaseFileCard';

export default function ResultScreen() {
  const { player, matchResult } = useGame();
  
  // matchResult = { players: { p01: { score, correctAnswers }, p02: { score, correctAnswers } } }
  
  const myResult = matchResult?.players?.[player?.username];
  const score = myResult?.score || 0;
  
  let grade = 'CASE DISMISSED';
  let gradeClass = 'grade--low';
  
  // Opponent calculation
  const opponentUsername = Object.keys(matchResult?.players || {}).find(u => u !== player?.username) || null;
  const opponentScore = opponentUsername ? matchResult?.players?.[opponentUsername]?.score : 0;
  
  let winStatus = "DRAW";
  if (score > opponentScore) {
    winStatus = "VICTORY";
    grade = 'CASE SOLVED';
    gradeClass = 'grade--high';
  } else if (score < opponentScore) {
    winStatus = "DEFEAT";
    grade = 'CASE DISMISSED';
    gradeClass = 'grade--low';
  } else {
    grade = 'UNDER INVESTIGATION';
    gradeClass = 'grade--mid';
  }

  return (
    <CaseFileCard>
      <div className="case-header">
        <span className="case-header__label">Investigation Complete</span>
        <h1 className="case-header__title">CASE REPORT</h1>
      </div>

      <motion.div
        className="result-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className={`result-grade ${gradeClass}`}>
          {grade}
        </div>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat__label">Match Outcome</span>
            <span className={`result-stat__value text-white font-bold ml-2 py-1 px-3 rounded
              ${winStatus === 'VICTORY' ? 'bg-green-700/80' : winStatus === 'DEFEAT' ? 'bg-red-800/80' : 'bg-gray-700'}
            `}>{winStatus}</span>
          </div>

          <div className="result-stat">
            <span className="result-stat__label">Your Score</span>
            <span className="result-stat__value">{score} pts</span>
          </div>

          <div className="result-stat">
            <span className="result-stat__label">Opponent Score</span>
            <span className="result-stat__value">{opponentScore} pts</span>
          </div>

          <div className="result-stat">
            <span className="result-stat__label">Match ID</span>
            <span className="result-stat__value">{player?.matchId}</span>
          </div>

          <div className="result-stat">
            <span className="result-stat__label">Opponent</span>
            <span className="result-stat__value">{player?.opponent}</span>
          </div>
        </div>

        <motion.p
          className="result-submitted mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ✅ Results filed to headquarters by dispatcher.
        </motion.p>
      </motion.div>
    </CaseFileCard>
  );
}
