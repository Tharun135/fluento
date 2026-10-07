import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DailyDashboard } from './components/DailyDashboard';
import { PracticeTab } from './components/PracticeTab';
import { HistoryCalendar } from './components/HistoryCalendar';
import { StatisticsScreen } from './components/StatisticsScreen';
import { SettingsScreen } from './components/SettingsScreen';

import { ListeningTracker } from './components/trackers/ListeningTracker';
import { SpeakingTracker } from './components/trackers/SpeakingTracker';
import { WritingTracker } from './components/trackers/WritingTracker';
import { ReadingTracker } from './components/trackers/ReadingTracker';

import { getUserProfile, saveUserProfile, getAppData, generateSampleData, saveAppData, getTodayKey } from './utils/storage';

export function App() {
  const [user, setUser] = useState(() => getUserProfile());
  const [appData, setAppData] = useState(() => getAppData());
  const [activeTab, setActiveTab] = useState('home');
  const [activeTracker, setActiveTracker] = useState(null); // 'listening' | 'speaking' | 'writing' | 'reading' | null

  const todayKey = getTodayKey();

  const [bannerNotification, setBannerNotification] = useState(null);

  // Apply theme dynamically to body / root element
  useEffect(() => {
    if (user.theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [user.theme]);

  // Automated background reminder checker
  useEffect(() => {
    let lastNotifiedMinute = '';

    const checkReminders = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      // Prevent firing multiple times within the same minute
      if (lastNotifiedMinute === currentHHMM) return;

      const todayLog = appData[todayKey] || {};
      const completedCount = ['listening', 'speaking', 'writing', 'reading'].filter(
        (key) => todayLog[key] && todayLog[key].completed
      ).length;

      const isMorningTime = user.morningReminderEnabled && user.morningReminderTime === currentHHMM;
      const isEveningTime = user.eveningReminderEnabled && user.eveningReminderTime === currentHHMM;

      if (isMorningTime) {
        lastNotifiedMinute = currentHHMM;
        const msg = `🎯 Good morning ${user.name}! Ready for today's English goal? (LSWR Practice)`;
        setBannerNotification(msg);

        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification('Fluento Morning Reminder', {
            body: msg,
            icon: '/favicon.svg'
          });
        }
      } else if (isEveningTime) {
        lastNotifiedMinute = currentHHMM;
        if (completedCount < 4) {
          const msg = `🗣️ Evening Check-in: You have completed ${completedCount}/4 English tasks today! Complete remaining tasks to keep your streak!`;
          setBannerNotification(msg);

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Fluento LSWR Task Alert', {
              body: msg,
              icon: '/favicon.svg'
            });
          }
        }
      }
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [user, appData, todayKey]);

  const refreshData = () => {
    setAppData(getAppData());
  };

  const handleToggleTheme = () => {
    const updated = { ...user, theme: user.theme === 'light' ? 'dark' : 'light' };
    saveUserProfile(updated);
    setUser(updated);
  };

  const handleToggleFrame = () => {
    const updated = { ...user, mobileFrame: !user.mobileFrame };
    saveUserProfile(updated);
    setUser(updated);
  };

  const handleResetData = () => {
    const sample = generateSampleData();
    saveAppData(sample);
    setAppData(sample);
    alert('Sample LSWR practice history has been reloaded!');
  };

  return (
    <div className="app-viewport-wrapper">
      <div className={`mobile-frame-container ${!user.mobileFrame ? 'is-desktop-full' : ''}`}>
        {bannerNotification && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#6366f1',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 13,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              zIndex: 1000,
            }}
          >
            <span>{bannerNotification}</span>
            <button
              onClick={() => setBannerNotification(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginLeft: 12,
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Top App Header */}
        <Header
          user={user}
          appData={appData}
          onToggleTheme={handleToggleTheme}
          onToggleFrame={handleToggleFrame}
        />

        {/* Dynamic Content Area based on activeTab */}
        <main className="app-content">
          {activeTab === 'home' && (
            <DailyDashboard
              user={user}
              appData={appData}
              onOpenTracker={(type) => setActiveTracker(type)}
              onDataChange={refreshData}
            />
          )}

          {activeTab === 'practice' && (
            <PracticeTab
              appData={appData}
              onOpenTracker={(type) => setActiveTracker(type)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryCalendar appData={appData} />
          )}

          {activeTab === 'progress' && (
            <StatisticsScreen appData={appData} />
          )}

          {activeTab === 'settings' && (
            <SettingsScreen
              user={user}
              onUpdateUser={(updated) => setUser(updated)}
              onResetData={handleResetData}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onChangeTab={(tab) => setActiveTab(tab)} />

        {/* Modals for 4 LSWR Trackers */}
        {activeTracker === 'listening' && (
          <ListeningTracker
            dayLog={appData[todayKey]}
            dateKey={todayKey}
            onClose={() => setActiveTracker(null)}
            onSaveSuccess={refreshData}
          />
        )}

        {activeTracker === 'speaking' && (
          <SpeakingTracker
            dayLog={appData[todayKey]}
            dateKey={todayKey}
            onClose={() => setActiveTracker(null)}
            onSaveSuccess={refreshData}
          />
        )}

        {activeTracker === 'writing' && (
          <WritingTracker
            dayLog={appData[todayKey]}
            dateKey={todayKey}
            onClose={() => setActiveTracker(null)}
            onSaveSuccess={refreshData}
          />
        )}

        {activeTracker === 'reading' && (
          <ReadingTracker
            dayLog={appData[todayKey]}
            dateKey={todayKey}
            onClose={() => setActiveTracker(null)}
            onSaveSuccess={refreshData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
