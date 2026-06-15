import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BackgroundScene from './components/BackgroundScene';
import CaseFileCard from './components/CaseFileCard';
import Login from './components/Login';
import ScoreBoard from './components/ScoreBoard';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerInput from './components/AnswerInput';
import SubmitButton from './components/SubmitButton';
import ResultScreen from './components/ResultScreen';
import WaitingRoom from './components/WaitingRoom';
import MatchTimer from './components/MatchTimer';
import TransitionOverlay from './components/TransitionScreen';
import { GameProvider, useGame } from './context/GameContext';
import { socket } from './services/socket';
import './index.css';

function GameScreen() {
  const { currentQuestion, questionIndex, feedback, questionResolved, transition } = useGame();
  const [answer, setAnswer] = useState('');
  const [checking, setChecking] = useState(false);
  const [localFeedback, setLocalFeedback] = useState(null);

  useEffect(() => {
    setLocalFeedback(null);
  }, [currentQuestion]);

  const handleSubmit = () => {
    if (!answer.trim() || checking || questionResolved) return;

    setChecking(true);
    setLocalFeedback(null);
    socket.emit('submit_answer', answer.trim(), (response) => {
      setChecking(false);
      if (response && response.isCorrect === false) {
        setLocalFeedback('❌ Incorrect clue. Try again!');
        setAnswer('');
      } else {
        setAnswer('');
      }
    });
  };

  const activeFeedback = feedback || (localFeedback ? { isLocal: true, text: localFeedback } : null);

  return (
    <>
      <ScoreBoard />
      <MatchTimer />
      {/* Single persistent CaseFileCard — never remounts between question and transition */}
      <CaseFileCard>
        <AnimatePresence mode="wait">
          {transition.active ? (
            <motion.div
              key="transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TransitionOverlay />
            </motion.div>
          ) : (
            <motion.div
              key="question"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionDisplay
                question={currentQuestion}
                questionNumber={questionIndex + 1}
                feedback={activeFeedback}
              />
              <AnswerInput
                value={answer}
                onChange={(val) => { setAnswer(val); setLocalFeedback(null); }}
                disabled={checking || questionResolved}
              />
              <SubmitButton
                onClick={handleSubmit}
                disabled={checking || questionResolved || !answer.trim()}
                label={checking ? 'Analyzing…' : 'Submit Answer'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CaseFileCard>
    </>
  );
}

function AppContent() {
  const { gameState } = useGame();

  return (
    <>
      <BackgroundScene />
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem 1rem',
          gap: '1rem',
        }}
      >
        {gameState === 'login' && <Login />}
        {gameState === 'waiting' && <WaitingRoom />}
        {gameState === 'paused' && <WaitingRoom />}
        {gameState === 'playing' && <GameScreen />}
        {gameState === 'result' && <ResultScreen />}
      </main>
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
