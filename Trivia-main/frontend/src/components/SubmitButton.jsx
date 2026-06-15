import { motion } from 'framer-motion';

export default function SubmitButton({ onClick, disabled, label }) {
  return (
    <motion.button
      className="submit-btn"
      onClick={onClick}
      disabled={disabled}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.6 }}
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
    >
      {label || 'Submit Answer'}
    </motion.button>
  );
}
