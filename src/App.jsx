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

  // Apply theme dynamically to body / root element
  useEffect(() => {
    if (user.theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [user.theme]);

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
