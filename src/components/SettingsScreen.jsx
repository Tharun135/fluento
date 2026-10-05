import React, { useState } from 'react';
import { User, Bell, Moon, Sun, Smartphone, RefreshCw, Download, Check, AlertCircle } from 'lucide-react';
import { saveUserProfile, generateSampleData, saveAppData } from '../utils/storage';

export const SettingsScreen = ({ user, onUpdateUser, onResetData }) => {
  const [name, setName] = useState(user.name || 'Tharun');
  const [morningTime, setMorningTime] = useState(user.morningReminderTime || '08:30');
  const [morningEnabled, setMorningEnabled] = useState(user.morningReminderEnabled ?? true);
  const [eveningTime, setEveningTime] = useState(user.eveningReminderTime || '20:00');
  const [eveningEnabled, setEveningEnabled] = useState(user.eveningReminderEnabled ?? true);

  const [notificationMsg, setNotificationMsg] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name,
      morningReminderTime: morningTime,
      morningReminderEnabled: morningEnabled,
      eveningReminderTime: eveningTime,
      eveningReminderEnabled: eveningEnabled,
    };
    saveUserProfile(updated);
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleToggleTheme = () => {
    const updated = { ...user, theme: user.theme === 'light' ? 'dark' : 'light' };
    saveUserProfile(updated);
    onUpdateUser(updated);
  };

  const handleToggleMobileFrame = () => {
    const updated = { ...user, mobileFrame: !user.mobileFrame };
    saveUserProfile(updated);
    onUpdateUser(updated);
  };

  const handleTestNotification = (type) => {
    let msg = '';
    if (type === 'morning') {
      msg = `🎯 Good morning ${name}! What is your English goal for today? (Listening, Speaking, Writing, Reading)`;
    } else {
      msg = `🗣️ Evening Check-in: Have you completed your LSWR practice today? You're almost there!`;
    }
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 5000);
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage.getItem('lswr_daily_app_data_v1')));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Fluento_Backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>App Settings</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Customize profile, daily notifications, and display preferences.
        </p>
      </div>

      {/* Profile Form */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <User size={20} style={{ color: 'var(--listening-color)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Personal Profile</h3>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ backgroundColor: 'var(--listening-color)' }}>
            <Check size={16} /> Save Profile Settings
          </button>
          {savedSuccess && (
            <div style={{ fontSize: 12, color: '#10b981', marginTop: 8, textAlign: 'center', fontWeight: 700 }}>
              ✓ Settings saved successfully!
            </div>
          )}
        </form>
      </div>

      {/* Reminders & Notifications */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Bell size={20} style={{ color: 'var(--writing-color)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>Daily Practice Reminders</h3>
        </div>

        {notificationMsg && (
          <div
            style={{
              padding: 12,
              borderRadius: 12,
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid var(--listening-color)',
              marginBottom: 16,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Bell size={18} style={{ color: 'var(--listening-color)' }} />
            <div>
              <strong>Notification Toast Preview:</strong>
              <div>{notificationMsg}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Morning Reminder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Morning Goal Reminder</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>"What is your English goal today?"</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="time"
                className="form-input"
                style={{ width: 110, padding: 6, fontSize: 13 }}
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleTestNotification('morning')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Test
              </button>
            </div>
          </div>

          {/* Evening Reminder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Evening LSWR Check-in</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>"Have you completed your LSWR practice today?"</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="time"
                className="form-input"
                style={{ width: 110, padding: 6, fontSize: 13 }}
                value={eveningTime}
                onChange={(e) => setEveningTime(e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleTestNotification('evening')}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme & Layout Preferences */}
      <div className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Display & Layout</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>App Theme</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Current: {user.theme === 'light' ? 'Light Mode' : 'Dark Mode'}
              </div>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={handleToggleTheme}
              style={{ width: 'auto', padding: '8px 16px', gap: 8 }}
            >
              {user.theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
              <span>Toggle Theme</span>
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Mobile Screen Frame</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Simulate mobile device frame on desktop
              </div>
            </div>
            <button
              type="button"
              className="icon-btn"
              onClick={handleToggleMobileFrame}
              style={{ width: 'auto', padding: '8px 16px', gap: 8 }}
            >
              <Smartphone size={18} />
              <span>{user.mobileFrame ? 'Mobile Frame On' : 'Full Screen'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Data & Storage</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={handleExportData}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <Download size={16} /> Export Practice Backup (JSON)
          </button>

          <button
            type="button"
            onClick={onResetData}
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              background: 'rgba(244, 63, 94, 0.1)',
              color: '#f43f5e',
              fontWeight: 700,
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} /> Reset & Reload Sample History
          </button>
        </div>
      </div>
    </div>
  );
};
