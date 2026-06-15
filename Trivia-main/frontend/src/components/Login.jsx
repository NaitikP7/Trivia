import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameDispatch } from '../context/GameContext';
import { login as apiLogin } from '../services/api';
import { socket } from '../services/socket';
import CaseFileCard from './CaseFileCard';

export default function Login() {
  const dispatch = useGameDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Both fields are required, detective.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Login to get token
      const data = await apiLogin(username.trim(), password.trim());

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: data.token,
          username: username.trim(),
          playerName: data.playerName,
          matchId: data.matchId,
          set: data.set,
          opponent: data.opponent,
        },
      });

      // 2. Connect socket
      socket.auth = { token: data.token };
      socket.connect();
      
    } catch (err) {
      setError(err.message || 'Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CaseFileCard>
      <div className="case-header">
        <span className="case-header__label">Restricted Access</span>
        <h1 className="case-header__title">AGENT LOGIN</h1>
      </div>

      {error && (
        <motion.p
          className="login-error"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⛔ {error}
        </motion.p>
      )}

      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="answer-field">
          <label className="answer-field__label" htmlFor="login-username">
            Agent ID
          </label>
          <input
            id="login-username"
            type="text"
            className="answer-field__input"
            placeholder="Enter your agent ID…"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            disabled={loading}
          />
        </div>

        <div className="answer-field">
          <label className="answer-field__label" htmlFor="login-password">
            Clearance Code
          </label>
          <input
            id="login-password"
            type="password"
            className="answer-field__input"
            placeholder="Enter your clearance code…"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            disabled={loading}
          />
        </div>


        <motion.button
          type="submit"
          className="submit-btn"
          disabled={loading}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? 'Verifying…' : 'File Report'}
        </motion.button>
      </motion.form>
    </CaseFileCard>
  );
}
