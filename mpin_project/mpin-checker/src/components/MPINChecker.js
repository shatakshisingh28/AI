import React, { useState, useEffect } from 'react';
import { analyzeMPIN } from '../utils/mpinUtils';
import './MPINChecker.css';

const MPINChecker = () => {
  const [mpin, setMpin] = useState('');
  const [userData, setUserData] = useState({
    dob: '',
    anniversary: '',
    spouseDob: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');
  const [showMpin, setShowMpin] = useState(false);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d{4}$|^\d{6}$/.test(mpin)) {
      setError("MPIN must be exactly 4 or 6 digits.");
      setResult(null);
      return;
    }
    setError('');
    const analysis = analyzeMPIN(mpin, userData);
    setResult(analysis);
  };

  const generateStrongMPIN = () => {
    const generate = () => {
      let pin = '';
      while (pin.length < 6) {
        const digit = Math.floor(Math.random() * 10);
        pin += digit;
      }
      const reasons = analyzeMPIN(pin, userData).reasons;
      return reasons.length === 0 ? pin : generate();
    };

    const strongPin = generate();
    setMpin(strongPin);
    setResult(null);
    setError('');
  };

  return (
    <div className="mpin-wrapper">
      <div className="mpin-card">
        <div className="theme-toggle">
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
            <span className="slider round"></span>
          </label>
          <span style={{ marginLeft: '10px', fontWeight: '500' }}>
            {theme === 'dark' ? 'Dark' : 'Light'} Mode
          </span>
        </div>

        <h2>🔐 MPIN Strength Checker</h2>

        <form onSubmit={handleSubmit}>
          <div className="mpin-input">
            <label>MPIN (4 or 6 digits)</label>
            <div className="mpin-input-wrapper">
              <input
                type={showMpin ? 'text' : 'password'}
                value={mpin}
                maxLength={6}
                onChange={(e) => setMpin(e.target.value)}
                required
              />
              <span
                className="eye-toggle"
                onClick={() => setShowMpin(!showMpin)}
                title={showMpin ? 'Hide MPIN' : 'Show MPIN'}
              >
                {showMpin ? '🙈' : '👁️'}
              </span>
            </div>
            <button
              type="button"
              className="mpin-suggest"
              onClick={generateStrongMPIN}
            >
              🔄 Suggest a Strong MPIN
            </button>
          </div>

          <div className="mpin-input">
            <label>Your Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={userData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="mpin-input">
            <label>Spouse's Date of Birth</label>
            <input
              type="date"
              name="spouseDob"
              value={userData.spouseDob}
              onChange={handleChange}
            />
          </div>

          <div className="mpin-input">
            <label>Wedding Anniversary</label>
            <input
              type="date"
              name="anniversary"
              value={userData.anniversary}
              onChange={handleChange}
            />
          </div>

          {error && <div className="mpin-error">{error}</div>}

          <button type="submit" className="mpin-button">
            🔍 Analyze MPIN
          </button>
        </form>

        {result && (
          <div className={`mpin-result ${result.strength.toLowerCase()}`}>
            <h5>MPIN is <strong>{result.strength}</strong></h5>
            {result.reasons.length > 0 && (
              <div className="mpin-reason">
                <strong>Reasons:</strong>
                <ul>
                  {result.reasons.map((reason, i) => (
                    <li key={i}>👉 {reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MPINChecker;
