import React from 'react';
import { Home, Zap, Calendar, BarChart2, Settings } from 'lucide-react';

export const BottomNav = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'practice', label: 'Practice', icon: Zap },
    { id: 'history', label: 'History', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onChangeTab(tab.id)}
          >
            <div className="nav-icon-container">
              <IconComponent size={20} />
            </div>
            <span>{tab.label}</span>
            {isActive && <div className="nav-indicator" />}
          </button>
        );
      })}
    </nav>
  );
};
