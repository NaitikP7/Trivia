import { motion } from 'framer-motion';

export default function AnswerInput({ value, onChange, disabled }) {
  return (
    <motion.div
      className="answer-field"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <label className="answer-field__label" htmlFor="deduction">
        Your Answer
      </label>
      <input
        id="deduction"
        type="text"
        className="answer-field__input"
        placeholder="Enter your answer…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        disabled={disabled}
      />
    </motion.div>
  );
}
