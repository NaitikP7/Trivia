import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const CHAR_DELAY = 30;

export default function QuestionDisplay({ question, questionNumber, feedback }) {
  const { player } = useGame();
  const [displayed, setDisplayed] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const timeoutRef = useRef(null);

  // Reset and type out each new question
  useEffect(() => {
    setDisplayed('');
    setTypingDone(false);

    if (!question) return;

    const text = question.questionText;
    let charIdx = 0;

    const typeNext = () => {
      if (charIdx <= text.length) {
        setDisplayed(text.slice(0, charIdx));
        charIdx++;
        timeoutRef.current = setTimeout(typeNext, CHAR_DELAY);
      } else {
        setTypingDone(true);
      }
    };

    // Small delay before typing starts
    timeoutRef.current = setTimeout(typeNext, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [question]);

  if (!question) return null;

  let feedbackMessage = null;
  let feedbackType = ''; // 'correct', 'incorrect', or 'transition'

  if (feedback) {
    if (feedback.isLocal) {
      feedbackMessage = feedback.text;
      feedbackType = 'incorrect';
    } else {
      feedbackType = 'transition';
      if (feedback.reason?.timedOut) {
        feedbackMessage = "Time's up! Moving on to the next question...";
      } else {
        const isMe = feedback.reason?.answeredBy === player?.username;
        feedbackMessage = isMe 
          ? "You answered correctly! Moving on to the next question..."
          : "The opponent answered correctly! Moving on to the next question...";
      }
    }
  }

  return (
    <div className="question-text">
      <div className="case-header">
        <span className="case-header__label">
          {question.category || 'Trivia'}
        </span>
        <h1 className="case-header__title">
          QUESTION #{questionNumber}
        </h1>
      </div>

      <p className="question-body">
        {displayed}
        {!typingDone && <span className="cursor" />}
      </p>

      <AnimatePresence>
        {feedback && (
          <motion.div
            className={`feedback-banner feedback--${feedbackType}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {feedbackMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
