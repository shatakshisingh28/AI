import React, { useState } from 'react';
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

  return (
    <div className="mpin-wrapper">
      <div className="mpin-card">
        <h2>🔐 MPIN Strength Checker</h2>

        <form onSubmit={handleSubmit}>
          <div className="mpin-input">
            <label>MPIN (4 or 6 digits)</label>
            <input
              type="password"
              value={mpin}
              maxLength={6}
              onChange={(e) => setMpin(e.target.value)}
              required
            />
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
