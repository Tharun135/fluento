import React from 'react';
import { Flame, Sun, Moon, Smartphone, Sparkles } from 'lucide-react';
import { calculateStreak } from '../utils/storage';

export const Header = ({ user, appData, onToggleTheme, onToggleFrame }) => {
  const streakInfo = calculateStreak(appData);

  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon">FL</div>
        <div className="logo-text">
          <h1>Fluento</h1>
          <p>LSWR Daily Practice & Consistency</p>
        </div>
      </div>

      <div className="header-actions">
        {/* Streak Pill */}
        <div className="streak-pill-header" title="Current Daily Streak">
          <span>🔥</span>
          <span>{streakInfo.currentStreak}</span>
        </div>

        {/* Theme Toggle */}
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={user.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {user.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Mobile Frame Toggle */}
        <button
          className="icon-btn"
          onClick={onToggleFrame}
          title={user.mobileFrame ? 'Switch to Full Screen View' : 'Switch to Mobile Frame View'}
        >
          <Smartphone size={18} />
        </button>
      </div>
    </header>
  );
};
